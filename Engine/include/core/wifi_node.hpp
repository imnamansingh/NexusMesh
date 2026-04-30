
#pragma once

#include <vector>
#include <cstdint>

class ServiceClass;

class InternalWifiNode {

public:

    int64_t id;
    double lat;
    double lon;
    int64_t total_bandwidth;
    int64_t available_bandwidth;
    int32_t latency_ms;
    bool is_gateway;
    std::vector<InternalWifiNode*> adjacency_list;

    void createAdjacencyList(InternalWifiNode* node, ServiceClass& serviceClass);
    void manipulateAdjacencyList(InternalWifiNode* node, InternalWifiNode* nodeToRemove);
    void updateNode(int64_t usedBandwidth);


};
