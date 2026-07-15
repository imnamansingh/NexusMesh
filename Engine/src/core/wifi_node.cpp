#include "../../include/core/wifi_node.hpp"

#include <algorithm>
#include <stdexcept>

void InternalWifiNode::manipulateAdjacencyList(InternalWifiNode* node, InternalWifiNode* nodeToRemove) {
    if (node == nullptr) {
        return;
    }

    node->adjacency_list.erase(
        std::remove(node->adjacency_list.begin(), node->adjacency_list.end(), nodeToRemove),
        node->adjacency_list.end());
}

void InternalWifiNode::updateNode(int64_t usedBandwidth) {
    if (available_bandwidth + usedBandwidth < 0) {
        throw std::runtime_error("Bandwidth would become negative");
    }
    this->available_bandwidth += usedBandwidth;
}