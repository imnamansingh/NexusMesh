#include "../../include/core/dijkstra.hpp"
#include "../../include/core/boundary.hpp"
#include "../../include/core/service_class.hpp"
#include "../../include/core/wifi_node.hpp"
#include "../../generated/mesh.pb.h"

#include <cstdint>
#include <vector>
#include <unordered_map>
#include <queue>
#include <cmath>
#include <algorithm>


namespace MeshAlgorithms {

    std::vector<int64_t> getShortestPath(
        const mesh::User& userData, 
        ServiceClass& serviceClass
    ){
        struct DijkstraNode {
            int64_t id;
            int hopCount;
            double cost;
            int64_t parentId;

            bool operator<(const DijkstraNode& other) const{
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

        Boundary boundary;
        boundary.x = userLon, boundary.y = userLat;
        boundary.halfWidth = 30, boundary.halfHeight = 30;
        std::vector<InternalWifiNode*> nodesInRange;
        serviceClass.quadtree->query(boundary, nodesInRange);

    

        auto calculateDistance = [](double lat1, double lon1, double lat2, double lon2) 
        -> double {
            
            double PI = std::acos(-1.0);
            auto toRad = [PI](double degree) { return degree * (PI / 180.0); };

            double phi1 = toRad(lat1);
            double phi2 = toRad(lat2);
            double deltaPhi = toRad(lat2 - lat1);
            double deltaLambda = toRad(lon2 - lon1);

            
            double a = 
                std::sin(deltaPhi / 2) * std::sin(deltaPhi / 2) +
                std::cos(phi1) * std::cos(phi2) *
                std::sin(deltaLambda / 2) * std::sin(deltaLambda / 2);

            
            double c = 2 * std::atan2(std::sqrt(a), std::sqrt(1 - a));

            
            return 6371000.0 * c;

        };

        auto calculateCost = [](
            double physicalDistance,
            double loadRatio,
            int32_t latency_ms_1, 
            int32_t latency_ms_2
        ) -> double {
            double 
                distanceWeight = 1.0,
                loadWeight = 50.0,
                latencyWeight = 2.5;
            
            double 
                distanceFactor = distanceWeight * physicalDistance,
                latencyFactor = latencyWeight * (latency_ms_1 + latency_ms_2),
                loadFactor = loadWeight * loadRatio;

            return distanceFactor + latencyFactor + loadFactor;
            
        };

        for(auto nearbyNode : nodesInRange){
            if(
                nearbyNode->available_bandwidth < userData.required_bandwidth() ||
                nearbyNode->latency_ms > userData.max_latency()
            ) continue;

            DijkstraNode nearbyNodeObject;
            nearbyNodeObject.id = nearbyNode->id;
            nearbyNodeObject.hopCount = 1;
            nearbyNodeObject.parentId = -1;

            double nearbyNodeDistance = calculateDistance(userLat, userLon, nearbyNode->lat, nearbyNode->lon);

            double loadRatio = 
                static_cast<double>(nearbyNode -> total_bandwidth - nearbyNode -> available_bandwidth) / (nearbyNode -> total_bandwidth);

            nearbyNodeObject.cost = calculateCost(nearbyNodeDistance, loadRatio, nearbyNode->latency_ms, 0);


            auto& nearbyNodeMapping = visited[nearbyNode->id];
            nearbyNodeMapping.cost = nearbyNodeObject.cost;
            nearbyNodeMapping.parentId = -1;

            nodeContainer.push(nearbyNodeObject);
        }
        while(!nodeContainer.empty()){
            DijkstraNode topNode = nodeContainer.top();
            nodeContainer.pop();

    

            int64_t nodeId = topNode.id;
            InternalWifiNode* nodePointer = serviceClass.id2PtrMap[nodeId].get();

            if(nodePointer->is_gateway){

                path.push_back(topNode.id);
                nodePointer->updateNode(-(userData.required_bandwidth()));
                int64_t parent_id = visited[nodePointer->id].parentId;
                while(parent_id != -1){
                    
                    path.push_back(parent_id);

                    InternalWifiNode* nodeToUpdateBandwidth = serviceClass.id2PtrMap[parent_id].get();
                    nodeToUpdateBandwidth->updateNode(-(userData.required_bandwidth()));

                    parent_id = visited[parent_id].parentId;

                }

                std::reverse(path.begin(),path.end());
                break;
            } else {

                if(topNode.hopCount >= 20) continue;

                std::vector<InternalWifiNode*> adjacencyListNodes = nodePointer->adjacency_list;

                double load_Ratio_1 = static_cast<double>(nodePointer->total_bandwidth - nodePointer->available_bandwidth) / (nodePointer->total_bandwidth);


                for(auto nodeToInsert : adjacencyListNodes){

                    if(
                        nodeToInsert->available_bandwidth < userData.required_bandwidth() ||
                        nodeToInsert->latency_ms > userData.max_latency()
                    ) continue;

                    double internal_lat = nodeToInsert->lat;
                    double internal_lon = nodeToInsert->lon;
                    int64_t internal_total_bandwidth = nodeToInsert->total_bandwidth; 
                    int64_t internal_available_bandwidth = nodeToInsert->available_bandwidth;
                    int32_t internal_latency_ms = nodeToInsert->latency_ms;

                    double load_Ratio_2 = static_cast<double>(internal_total_bandwidth - internal_available_bandwidth) / (internal_total_bandwidth);

                    double load_Ratio_eq = static_cast<double>(load_Ratio_1 + load_Ratio_2) / 2;

                    double distance_btw = calculateDistance(nodePointer->lat, nodePointer->lon, internal_lat, internal_lon);

                    double cost_btw = calculateCost(distance_btw, load_Ratio_eq, nodePointer->latency_ms, internal_latency_ms);

                    double end_cost = topNode.cost + cost_btw;

                    if(visited.find(nodeToInsert->id) != visited.end() &&
                       visited[nodeToInsert->id].cost <= end_cost) continue;
                        

                    DijkstraNode nodeToInsertInQueue;
                    nodeToInsertInQueue.id = nodeToInsert->id;
                    nodeToInsertInQueue.hopCount = topNode.hopCount + 1;
                    nodeToInsertInQueue.cost = end_cost;
                    nodeToInsertInQueue.parentId = topNode.id;

                    auto& nearToInsertMapping = visited[nodeToInsert->id];
                    nearToInsertMapping.cost = end_cost;
                    nearToInsertMapping.parentId =  topNode.id;

                    nodeContainer.push(nodeToInsertInQueue);

                }

            }
        }


        return path;

    }
}