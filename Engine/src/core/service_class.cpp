#include "../../include/core/service_class.hpp"
#include "../../include/core/quadtree.hpp"
#include "../../include/core/wifi_node.hpp"

#include <memory>

void ServiceClass::createQuadtree(const mesh::NodeBatch& batch){
    this->quadtree = std::make_unique<Quadtree>();
    for(auto batchNode: batch.nodes()){
        auto newNode = std::make_unique<InternalWifiNode>();
        newNode->id = batchNode.id();
        newNode->lat = batchNode.lat();
        newNode->lon = batchNode.lon();
        newNode->current_load = batchNode.current_load();
        newNode->total_bandwidth = batchNode.total_bandwidth();
        newNode->available_bandwidth = batchNode.available_bandwidth();
        newNode->is_gateway = batchNode.is_gateway();
        newNode->latency_ms = batchNode.latency_ms();

        this->id2PtrMap[newNode->id] = std::move(newNode);

        quadtree->insert(newNode.get());


    }
}

void ServiceClass::createAdjacencyList(){
    for(auto& [id, nodePtr]: this->id2PtrMap){
        InternalWifiNode* pointer = nodePtr.get();
        nodePtr->createAdjacencyList(pointer, *this);
    }
}

void ServiceClass::removeUser(){
    
}