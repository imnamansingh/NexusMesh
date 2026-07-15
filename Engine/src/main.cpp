#include <grpcpp/grpcpp.h>
#include "../include/services/engine_service.hpp"
#include "../include/core/service_class.hpp"
#include "../include/utils/logger.hpp"

#include <thread>
#include <vector>
#include <atomic>
#include <condition_variable>
#include <queue>
#include <functional>
#include <csignal>
#include <iostream>
#include <chrono>
#include <mutex>
#include <stdexcept>

// Simple thread-pool for background tasks
class SimpleThreadPool {
public:
  explicit SimpleThreadPool(size_t n) : stop_(false) {
    for (size_t i = 0; i < n; ++i) {
      workers_.emplace_back([this]{ this->workerLoop(); });
    }
  }
  ~SimpleThreadPool() { stop(); }

  void post(std::function<void()> f) {
    {
      std::unique_lock<std::mutex> lk(mutex_);
      tasks_.push(std::move(f));
    }
    cv_.notify_one();
  }

  void stop() {
    {
      std::unique_lock<std::mutex> lk(mutex_);
      stop_ = true;
    }
    cv_.notify_all();
    for (auto &t : workers_) if (t.joinable()) t.join();
  }

private:
  void workerLoop() {
    while (true) {
      std::function<void()> task;
      {
        std::unique_lock<std::mutex> lk(mutex_);
        cv_.wait(lk, [this]{ return stop_ || !tasks_.empty(); });
        if (stop_ && tasks_.empty()) return;
        task = std::move(tasks_.front());
        tasks_.pop();
      }
      try { task(); } catch(...) { /* log error */ }
    }
  }

  std::vector<std::thread> workers_;
  std::queue<std::function<void()>> tasks_;
  std::mutex mutex_;
  std::condition_variable cv_;
  bool stop_;
};

// process-wide shutdown flag for signal handler
static std::atomic<bool> g_shutdown{false};
static void handle_sigint(int) { g_shutdown.store(true); }

int main(int argc, char** argv) {
  try {
    ServiceClass backend;
    EngineServiceClass service(backend);

    size_t threads = std::max<size_t>(1, std::thread::hardware_concurrency());
    SimpleThreadPool pool(threads);

    std::atomic<bool> maint_running{true};
    std::thread maintenance_thread([&] {
      while (maint_running.load()) {
        try {
          pool.post([&backend] {
            try
            {
              backend.getPerformanceMetrics();
            }
            catch(const std::exception& e)
            {
              ErrorHandling::logError("Main", std::string("Performance metrics can't be fetched: ") + e.what());
            }    
          });
        } catch (const std::exception& ex) {
          ErrorHandling::logError("Main", std::string("Background task failed: ") + ex.what());
        }
        std::this_thread::sleep_for(std::chrono::seconds(10));
      }
    });

    std::string server_address("0.0.0.0:50051");
    grpc::ServerBuilder builder;
    builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
    builder.RegisterService(&service);
    std::unique_ptr<grpc::Server> server(builder.BuildAndStart());
    if (!server) {
      ErrorHandling::logError("Main", "Failed to start gRPC server");
      maint_running = false;
      pool.stop();
      maintenance_thread.join();
      return 1;
    }

    std::cout << "Server listening on " << server_address << '\n';

    std::thread server_thread([&] { server->Wait(); });

    std::signal(SIGINT, handle_sigint);
    std::signal(SIGTERM, handle_sigint);

    while (!g_shutdown.load()) {
      std::this_thread::sleep_for(std::chrono::milliseconds(200));
    }

    std::cout << "Shutdown requested, stopping server...\n";
    server->Shutdown();

    maint_running = false;
    maintenance_thread.join();
    pool.stop();

    if (server_thread.joinable()) {
      server_thread.join();
    }

    std::cout << "Server stopped cleanly\n";
    return 0;
  } catch (const std::exception& ex) {
    ErrorHandling::logError("Main", std::string("Fatal startup failure: ") + ex.what());
    return 1;
  }
}