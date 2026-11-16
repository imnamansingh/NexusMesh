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
    
    std::unordered_map<int64_t, std::unique_ptr<InternalWifiNode>> id2PtrMap;
    std::unique_ptr<Quadtree> quadtree;

    ServiceClass(): start_time_(std::chrono::steady_clock::now()) {}

    void createQuadtree(const mesh::NodeBatch& batch);

    std::vector<int64_t> createNode(const mesh::AddNode& node);

    void createAdjacencyList();
    int64_t removeNodeById(const mesh::RemoveNode& nodeId);
    void removeUser(const mesh::RemoveUser& userToBeRemoved);

    std::string getPerformanceMetrics() const;

private:
    std::chrono::steady_clock::time_point start_time_;

};