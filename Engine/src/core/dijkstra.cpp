#include "../../include/core/dijkstra.hpp"
#include "../../include/core/boundary.hpp"
#include "../../include/core/service_class.hpp"
#include "../../include/core/wifi_node.hpp"
#include "../../generated/mesh.pb.h"
#include "../../include/utils/logger.hpp"

#include <cstdint>
#include <vector>
#include <unordered_map>
#include <queue>
#include <cmath>
#include <algorithm>
#include <stdexcept>

namespace MeshAlgorithms {

    std::vector<int64_t> getShortestPath(const mesh::User& userData, ServiceClass& serviceClass) {
        if (serviceClass.quadtree == nullptr) {
            throw std::runtime_error("Mesh has not been initialized yet");
        }
        if (userData.required_bandwidth() <= 0) {
            throw std::invalid_argument("Required bandwidth must be positive");
        }
        if (userData.max_latency() < 0) {
            throw std::invalid_argument("Maximum latency cannot be negative");
        }

        struct DijkstraNode {
            int64_t id;
            int hopCount;
            double cost;
            int64_t parentId;

            bool operator<(const DijkstraNode& other) const {
                return cost > other.cost;
            }
        };

        struct NodeInfo {
            double cost;
            int64_t parentId;
        };

        std::unordered_map<int64_t, NodeInfo> visited;
        std::priority_queue<DijkstraNode> nodeContainer;
        std::vector<int64_t> path;

        double userLat = userData.lat();
        double userLon = userData.lon();

        Boundary boundary = Boundary::fromMeters(userLat, userLon, 30.0);
        std::vector<InternalWifiNode*> nodesInRange;
        serviceClass.quadtree->query(boundary, nodesInRange);

        auto calculateDistance = [](double lat1, double lon1, double lat2, double lon2) -> double {
            double PI = std::acos(-1.0);
            auto toRad = [PI](double degree) { return degree * (PI / 180.0); };

            double phi1 = toRad(lat1);
            double phi2 = toRad(lat2);
            double deltaPhi = toRad(lat2 - lat1);
            double deltaLambda = toRad(lon2 - lon1);

            double a = std::sin(deltaPhi / 2) * std::sin(deltaPhi / 2) +
                std::cos(phi1) * std::cos(phi2) * std::sin(deltaLambda / 2) * std::sin(deltaLambda / 2);

            double c = 2 * std::atan2(std::sqrt(a), std::sqrt(1 - a));
            return 6371000.0 * c;
        };

        auto calculateCost = [](double physicalDistance, double loadRatio, int32_t latency_ms_1, int32_t latency_ms_2) -> double {
            double distanceWeight = 1.0;
            double loadWeight = 50.0;
            double latencyWeight = 2.5;

            double distanceFactor = distanceWeight * physicalDistance;
            double latencyFactor = latencyWeight * (latency_ms_1 + latency_ms_2);
            double loadFactor = loadWeight * loadRatio;

            return distanceFactor + latencyFactor + loadFactor;
        };

        for (auto nearbyNode : nodesInRange) {
            if (nearbyNode == nullptr) {
                continue;
            }
            if (nearbyNode->available_bandwidth < userData.required_bandwidth() ||
                nearbyNode->latency_ms > userData.max_latency()) {
                continue;
            }

            DijkstraNode nearbyNodeObject;
            nearbyNodeObject.id = nearbyNode->id;
            nearbyNodeObject.hopCount = 1;
            nearbyNodeObject.parentId = -1;

            double nearbyNodeDistance = calculateDistance(userLat, userLon, nearbyNode->lat, nearbyNode->lon);
            double loadRatio = static_cast<double>(nearbyNode->total_bandwidth - nearbyNode->available_bandwidth) / (nearbyNode->total_bandwidth);
            nearbyNodeObject.cost = calculateCost(nearbyNodeDistance, loadRatio, nearbyNode->latency_ms, 0);

            auto& nearbyNodeMapping = visited[nearbyNode->id];
            nearbyNodeMapping.cost = nearbyNodeObject.cost;
            nearbyNodeMapping.parentId = -1;

            nodeContainer.push(nearbyNodeObject);
        }

        while (!nodeContainer.empty()) {
            DijkstraNode topNode = nodeContainer.top();
            nodeContainer.pop();

            auto it = serviceClass.id2PtrMap.find(topNode.id);
            if (it == serviceClass.id2PtrMap.end() || it->second == nullptr) {
                ErrorHandling::logWarning("Dijkstra", "Skipping missing node in path search");
                continue;
            }

            InternalWifiNode* nodePointer = it->second.get();
            if (nodePointer->is_gateway) {
                path.push_back(topNode.id);
                nodePointer->updateNode(-(userData.required_bandwidth()));
                int64_t parentId = visited[nodePointer->id].parentId;
                while (parentId != -1) {
                    path.push_back(parentId);
                    auto parentIt = serviceClass.id2PtrMap.find(parentId);
                    if (parentIt == serviceClass.id2PtrMap.end() || parentIt->second == nullptr) {
                        throw std::runtime_error("Path references a missing node");
                    }
                    parentIt->second->updateNode(-(userData.required_bandwidth()));
                    parentId = visited[parentId].parentId;
                }

                std::reverse(path.begin(), path.end());
                break;
            }

            if (topNode.hopCount >= 20) {
                continue;
            }

            std::vector<InternalWifiNode*> adjacencyListNodes = nodePointer->adjacency_list;
            double loadRatio1 = static_cast<double>(nodePointer->total_bandwidth - nodePointer->available_bandwidth) / (nodePointer->total_bandwidth);

            for (auto nodeToInsert : adjacencyListNodes) {
                if (nodeToInsert == nullptr) {
                    continue;
                }
                if (nodeToInsert->available_bandwidth < userData.required_bandwidth() ||
                    nodeToInsert->latency_ms > userData.max_latency()) {
                    continue;
                }

                double internalLat = nodeToInsert->lat;
                double internalLon = nodeToInsert->lon;
                int64_t internalTotalBandwidth = nodeToInsert->total_bandwidth;
                int64_t internalAvailableBandwidth = nodeToInsert->available_bandwidth;
                int32_t internalLatencyMs = nodeToInsert->latency_ms;

                double loadRatio2 = static_cast<double>(internalTotalBandwidth - internalAvailableBandwidth) / (internalTotalBandwidth);
                double loadRatioEq = static_cast<double>(loadRatio1 + loadRatio2) / 2;
                double distanceBtwn = calculateDistance(nodePointer->lat, nodePointer->lon, internalLat, internalLon);
                double costBtwn = calculateCost(distanceBtwn, loadRatioEq, nodePointer->latency_ms, internalLatencyMs);
                double endCost = topNode.cost + costBtwn;

                if (visited.find(nodeToInsert->id) != visited.end() && visited[nodeToInsert->id].cost <= endCost) {
                    continue;
                }

                DijkstraNode nodeToInsertInQueue;
                nodeToInsertInQueue.id = nodeToInsert->id;
                nodeToInsertInQueue.hopCount = topNode.hopCount + 1;
                nodeToInsertInQueue.cost = endCost;
                nodeToInsertInQueue.parentId = topNode.id;

                auto& nearToInsertMapping = visited[nodeToInsert->id];
                nearToInsertMapping.cost = endCost;
                nearToInsertMapping.parentId = topNode.id;

                nodeContainer.push(nodeToInsertInQueue);
            }
        }

        return path;
    }
}