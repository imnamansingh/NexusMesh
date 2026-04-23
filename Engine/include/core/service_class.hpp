#pragma once
#include <unordered_map>
#include "wifi_node.hpp"

class ServiceClass {
public:
    std::unordered_map<int64_t, InternalWifiNode*> Id2PtrMap;

    void createQuadtree();
};