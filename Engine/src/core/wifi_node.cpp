#include "../../include/core/wifi_node.hpp"
#include "../../include/core/boundary.hpp"
#include "../../include/core/service_class.hpp"
#include "../../include/core/quadtree.hpp"

void InternalWifiNode::createAdjacencyList(InternalWifiNode* node, ServiceClass& serviceClass){
    Boundary boundary;
    boundary.x = (*node).lon, boundary.y = (*node).lat;
    boundary.halfWidth = 30, boundary.halfHeight = 30;
    serviceClass.quadtree->query(boundary, (*node).adjacency_list);
    
}

void InternalWifiNode::manipulateAdjacencyList(InternalWifiNode* node, InternalWifiNode* nodeToRemove){
    int count = 0;
    for(auto nodePtr : (*node).adjacency_list){
        if(nodePtr == nodeToRemove){
            (*node).adjacency_list.erase((*node).adjacency_list.begin()+count);
            break;
        }
        count++;
    }
}

void InternalWifiNode::updateNode(int64_t newCurrentLoad, int64_t newAvailableBandwidth){
    this->available_bandwidth += newAvailableBandwidth;
    this->current_load += newCurrentLoad;
}