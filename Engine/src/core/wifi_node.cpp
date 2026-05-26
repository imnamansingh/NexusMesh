#include "../../include/core/wifi_node.hpp"
#include "../../include/core/boundary.hpp"
#include "../../include/core/service_class.hpp"
#include "../../include/core/quadtree.hpp"

#include <algorithm>

void InternalWifiNode::createAdjacencyList(InternalWifiNode* node, ServiceClass& serviceClass){
    Boundary boundary = Boundary::fromMeters(node->lat, node->lon, 30.0);
    serviceClass.quadtree->query(boundary, node->adjacency_list);
    
}

void InternalWifiNode::manipulateAdjacencyList(InternalWifiNode* node, InternalWifiNode* nodeToRemove){
    if(node == nullptr) return;
    
    node->adjacency_list.erase(std::remove(node->adjacency_list.begin(),
                               node->adjacency_list.end(), nodeToRemove), node->adjacency_list.end());
}

void InternalWifiNode::updateNode(int64_t usedBandwidth){
    this->available_bandwidth += usedBandwidth;
}