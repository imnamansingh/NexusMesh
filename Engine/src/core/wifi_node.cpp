#include "../../include/core/wifi_node.hpp"

#include <algorithm>
#include <stdexcept>

//This function updates the adjacency list of the node. If a node requests to end its services, we go through all the nodes in its adjacency list and call this function on those nodes passing the node that wants to end its services as nodeToRemove.
void InternalWifiNode::manipulateAdjacencyList(InternalWifiNode* node, InternalWifiNode* nodeToRemove) {
    if (node == nullptr) {
        return;
    }
    
    //remove fn moves all the matching node to the end and then it returns a pointer to the very first element of the matching ones.
    // erase fn erases all the nodes in the range passed to it ie if you pass the vec.begin(), vec.end() to it then it will erase the whole vector.
    node->adjacency_list.erase(
        std::remove(node->adjacency_list.begin(), node->adjacency_list.end(), nodeToRemove),
        node->adjacency_list.end());
}

//this function is used to update the available bandwidth property of the node. When node gets involved in a connection, we can simply pass the usedBandwidth arguement with negative sign and when the node gets released then we pass the usedBandwidth arguement with a positive sign.
void InternalWifiNode::updateNode(int64_t usedBandwidth) {
    if (available_bandwidth + usedBandwidth < 0) {
        throw std::runtime_error("Bandwidth would become negative");
    }
    this->available_bandwidth += usedBandwidth;
}