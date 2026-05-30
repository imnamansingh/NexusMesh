#include "../../include/core/wifi_node.hpp"

#include <algorithm>

void InternalWifiNode::manipulateAdjacencyList(InternalWifiNode* node, InternalWifiNode* nodeToRemove){
    if(node == nullptr) return;
    
    node->adjacency_list.erase(std::remove(node->adjacency_list.begin(), node->adjacency_list.end(), nodeToRemove), node->adjacency_list.end());
}

void InternalWifiNode::updateNode(int64_t usedBandwidth){
    this->available_bandwidth += usedBandwidth;
}