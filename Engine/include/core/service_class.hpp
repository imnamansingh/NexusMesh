#pragma once

#include <memory>
#include <chrono>
#include <string>
#include <atomic>
#include <unordered_map>
#include <vector>
#include "wifi_node.hpp"
#include "quadtree.hpp"
#include "../../generated/mesh.pb.h"

class ServiceClass {
public:
    
    //a map to map wifinode ids to the unique pointer pointing to that wifinode object residing on heap memory.
    std::unordered_map<int64_t, std::unique_ptr<InternalWifiNode>> id2PtrMap;
    std::unique_ptr<Quadtree> quadtree;

    //Although the initializer list puts start_time_ first, C++ initializes members in the order they are declared in the class (they are declared in the private section below), so here total_requests_ is initialized before start_time_.
    ServiceClass(): start_time_(std::chrono::steady_clock::now()), total_requests_(0) {}

    void createQuadtree(const mesh::NodeBatch& batch);

    //this fn returns the adjacency list of the added node in form of a vector containing the ids of nodes.
    std::vector<int64_t> createNode(const mesh::AddNode& node);

    //this fn is for creating the adjacency list for all the nodes once the initial reboot finishes.
    void createAdjacencyList();
    int64_t removeNodeById(const mesh::RemoveNode& nodeId);
    void removeUser(const mesh::RemoveUser& userToBeRemoved);

    //std::memory_order_relaxed means the increment is atomic, but it does not synchronize other data between threads. That’s appropriate here if the counter is just tracking how many requests occurred and isn’t being used to signal or coordinate access to other data.
    void incrementRequestCount() { 
        total_requests_.fetch_add(1, std::memory_order_relaxed);
    }
    std::string getPerformanceMetrics() const;

private:
    // std::atomic<int64_t> stores an integer that can be read or updated
    // safely as a single indivisible operation across threads. This lets the
    // server's worker threads increment the request count without a data race.
    // Atomic operations do not make other state or multi-step operations safe.
    std::atomic<int64_t> total_requests_;
    std::chrono::steady_clock::time_point start_time_;

};