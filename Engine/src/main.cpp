#include <grpcpp/grpcpp.h>
#include "../include/services/engine_service.hpp"
#include "../include/core/service_class.hpp"

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
  // Backend engine instance
  ServiceClass backend; // ensure default ctor exists
  EngineServiceClass service(backend);

  // Create thread-pool for background work
  size_t threads = std::max<size_t>(1, std::thread::hardware_concurrency());
  SimpleThreadPool pool(threads);

  // Example: periodic maintenance task (calls backend method you implement)
  std::atomic<bool> maint_running{true};
  std::thread maintenance_thread([&]{
    while (maint_running.load()) {
      // Post a short job to the pool (avoid long work while holding locks)
      pool.post([&backend]{
        // implement ServiceClass::performMaintenance() or replace with suitable call
        // backend.performMaintenance();
      });
      std::this_thread::sleep_for(std::chrono::seconds(10));
    }
  });

  // Build and start gRPC synchronous server
  std::string server_address("0.0.0.0:50051");
  grpc::ServerBuilder builder;
  builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
  builder.RegisterService(&service);
  std::unique_ptr<grpc::Server> server(builder.BuildAndStart());
  if (!server) {
    std::cerr << "Failed to start gRPC server\n";
    maint_running = false;
    pool.stop();
    maintenance_thread.join();
    return 1;
  }
  std::cout << "Server listening on " << server_address << '\n';

  // Run server::Wait in a background thread so main can respond to signals
  std::thread server_thread([&]{ server->Wait(); });

  // install signal handler
  std::signal(SIGINT, handle_sigint);
  std::signal(SIGTERM, handle_sigint);

  // Wait for shutdown signal
  while (!g_shutdown.load()) std::this_thread::sleep_for(std::chrono::milliseconds(200));

  std::cout << "Shutdown requested, stopping server...\n";
  // Ask gRPC to shutdown; this will cause server->Wait() to return
  server->Shutdown();

  // stop background work
  maint_running = false;
  maintenance_thread.join();
  pool.stop();

  // join server thread
  if (server_thread.joinable()) server_thread.join();

  std::cout << "Server stopped cleanly\n";
  return 0;
}