#include "../../include/core/service_class.hpp"
#include "../../include/core/quadtree.hpp"
#include "../../include/core/wifi_node.hpp"
#include "../../include/core/boundary.hpp"
#include "../../include/utils/logger.hpp"

#include <memory>
#include <string>
#include <chrono>
#include <stdexcept>

namespace {
void validateNodePayload(const mesh::WifiNode& node, const std::string& context) {
    if (node.id() == 0) {
        throw std::invalid_argument(context + " has an invalid id");
    }
    if (node.total_bandwidth() <= 0 || node.available_bandwidth() < 0 || node.available_bandwidth() > node.total_bandwidth()) {
        throw std::invalid_argument(context + " has invalid bandwidth values");
    }
    if (node.lat() < -90.0 || node.lat() > 90.0 || node.lon() < -180.0 || node.lon() > 180.0) {
        throw std::invalid_argument(context + " has invalid coordinates");
    }
}
}

void ServiceClass::createQuadtree(const mesh::NodeBatch& batch) {
    if (batch.nodes_size() == 0) {
        throw std::invalid_argument("Node batch is empty");
    }

    this->id2PtrMap.clear();
    Boundary bound{};
    this->quadtree = std::make_unique<Quadtree>(bound);

    for (const auto& batchNode : batch.nodes()) {
        validateNodePayload(batchNode, "NodeBatch entry");

        auto newNode = std::make_unique<InternalWifiNode>();
        newNode->id = batchNode.id();
        newNode->lat = batchNode.lat();
        newNode->lon = batchNode.lon();
        newNode->total_bandwidth = batchNode.total_bandwidth();
        newNode->available_bandwidth = batchNode.available_bandwidth();
        newNode->is_gateway = batchNode.is_gateway();
        newNode->latency_ms = batchNode.latency_ms();

        if (!quadtree->insert(newNode.get())) {
            throw std::runtime_error("Node fell outside the quadtree boundary");
        }

        this->id2PtrMap[newNode->id] = std::move(newNode);
    }
}

std::vector<int64_t> ServiceClass::createNode(const mesh::AddNode& nodeToInsert) {
    if (!nodeToInsert.has_node()) {
        throw std::invalid_argument("AddNode request is missing a node payload");
    }

    const auto& node = nodeToInsert.node();
    validateNodePayload(node, "AddNode payload");
    if (this->quadtree == nullptr || this->id2PtrMap.find(node.id()) != this->id2PtrMap.end()) {
        throw std::invalid_argument("Node already exists or quadtree is not initialized");
    }

    auto newNode = std::make_unique<InternalWifiNode>();
    newNode->id = node.id();
    newNode->lat = node.lat();
    newNode->lon = node.lon();
    newNode->total_bandwidth = node.total_bandwidth();
    newNode->available_bandwidth = node.available_bandwidth();
    newNode->is_gateway = node.is_gateway();
    newNode->latency_ms = node.latency_ms();

    if (!quadtree->insert(newNode.get())) {
        throw std::runtime_error("New node could not be inserted into quadtree");
    }

    Boundary boundary = Boundary::fromMeters(newNode->lat, newNode->lon, 30.0);
    quadtree->query(boundary, newNode->adjacency_list);

    std::vector<int64_t> listToReturn;
    for (const auto nodePtr : newNode->adjacency_list) {
        listToReturn.push_back(nodePtr->id);
    }

    this->id2PtrMap[newNode->id] = std::move(newNode);
    return listToReturn;
}

void ServiceClass::createAdjacencyList() {
    if (this->quadtree == nullptr) {
        throw std::runtime_error("Quadtree has not been initialized");
    }

    for (auto& [id, nodePtr] : this->id2PtrMap) {
        if (nodePtr == nullptr) {
            continue;
        }
        try {
            Boundary boundary = Boundary::fromMeters(nodePtr->lat, nodePtr->lon, 30.0);
            quadtree->query(boundary, nodePtr->adjacency_list);
        } catch (const std::exception& ex) {
            ErrorHandling::logError("ServiceClass", std::string("Failed to build adjacency for node ") + std::to_string(id) + ": " + ex.what());
            throw;
        }
    }
}

int64_t ServiceClass::removeNodeById(const mesh::RemoveNode& nodeId) {
    int64_t id = nodeId.id();
    if (id <= 0) {
        throw std::invalid_argument("Removal request contains an invalid node id");
    }

    auto it = id2PtrMap.find(id);
    if (it == id2PtrMap.end() || it->second == nullptr) {
        throw std::runtime_error("Id not found");
    }

    bool isRemoved = quadtree->remove(it->second.get());
    if (!isRemoved) {
        throw std::runtime_error("Node removal failed internally");
    }

    id2PtrMap.erase(it);
    return id;
}

void ServiceClass::removeUser(const mesh::RemoveUser& userToBeRemoved) {
    if (userToBeRemoved.bandwidth_occupied() < 0) {
        throw std::invalid_argument("Bandwidth occupied cannot be negative");
    }

    for (int64_t nodeToUpdate : userToBeRemoved.path_occupied()) {
        auto it = id2PtrMap.find(nodeToUpdate);
        if (it == id2PtrMap.end() || it->second == nullptr) {
            ErrorHandling::logWarning("ServiceClass", "Skipping missing node in removeUser path");
            continue;
        }
        it->second->updateNode(userToBeRemoved.bandwidth_occupied());
    }
}

std::string ServiceClass::getPerformanceMetrics() const {
    auto now = std::chrono::steady_clock::now();
    auto uptime_seconds = std::chrono::duration_cast<std::chrono::seconds>(now - start_time_).count();

    std::stringstream ss;
    ss << "[Uptime: " << uptime_seconds << "s] "
       << "[Total Requests: " << total_requests_.load(std::memory_order_relaxed) << "]";
    
    return ss.str();
}