#include "../../include/core/wifi_node.hpp"
#include "../../include/core/boundary.hpp"

void InternalWifiNode::createAdjacencyList(InternalWifiNode* node){
    Boundary boundary;
    boundary.x = (*node).lon, boundary.y = (*node).lat;
    boundary.halfWidth = 30, boundary.halfHeight = 30;
    quadtree.query(boundary, (*node).adjacency_list);
    
}

void InternalWifiNode::manipulateAdjacencyList(InternalWifiNode* node,InternalWifiNode* nodeToRemove){
    int count = 0;
    for(auto nodes : (*node).adjacency_list){
        if(nodes == nodeToRemove){
            (*node).adjacency_list.erase((*node).adjacency_list.begin()+count);
            break;
        }
        count++;
    }
}

void InternalWifiNode::updateNode(int64_t newCurrent_load, int64_t newAvailable_bandwidth){
    this->available_bandwidth += newAvailable_bandwidth;
    this->current_load += newCurrent_load;
}