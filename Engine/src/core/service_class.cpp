#include "../../include/core/service_class.hpp"
#include "../../include/core/quadtree.hpp"
#include "../../include/core/wifi_node.hpp"
#include "../../include/core/boundary.hpp"

#include <memory>

void ServiceClass::createQuadtree(const mesh::NodeBatch& batch){
    Boundary bound{};
    this->quadtree = std::make_unique<Quadtree>(bound);
    for(auto batchNode: batch.nodes()){
        auto newNode = std::make_unique<InternalWifiNode>();
        newNode->id = batchNode.id();
        newNode->lat = batchNode.lat();
        newNode->lon = batchNode.lon();
        newNode->total_bandwidth = batchNode.total_bandwidth();
        newNode->available_bandwidth = batchNode.available_bandwidth();
        newNode->is_gateway = batchNode.is_gateway();
        newNode->latency_ms = batchNode.latency_ms();

        quadtree->insert(newNode.get());

        this->id2PtrMap[newNode->id] = std::move(newNode);

    }
}

std::vector<int64_t> ServiceClass::createNode(const mesh::AddNode& nodeToInsert){

    auto newNode = std::make_unique<InternalWifiNode>();
    newNode->id = nodeToInsert.node().id();
    newNode->lat = nodeToInsert.node().lat();
    newNode->lon = nodeToInsert.node().lon();
    newNode->total_bandwidth = nodeToInsert.node().total_bandwidth();
    newNode->available_bandwidth = nodeToInsert.node().available_bandwidth();
    newNode->is_gateway = nodeToInsert.node().is_gateway();
    newNode->latency_ms = nodeToInsert.node().latency_ms();

    InternalWifiNode* pointer = newNode.get();

    quadtree->insert(pointer);

    Boundary boundary = Boundary::fromMeters(newNode->lat, newNode->lon, 30.0);
    quadtree->query(boundary, newNode->adjacency_list);

    std::vector<int64_t> listToReturn;
    for(auto node: newNode->adjacency_list){
        listToReturn.push_back(node->id);
    }

    int64_t newNodeId = newNode->id;

    this->id2PtrMap[newNodeId] = std::move(newNode);

    return listToReturn;

}

void ServiceClass::createAdjacencyList(){
    for(auto& [id, nodePtr]: this->id2PtrMap){

        Boundary boundary = Boundary::fromMeters(nodePtr->lat, nodePtr->lon, 30.0);
        quadtree->query(boundary, nodePtr->adjacency_list);

    }
}

void ServiceClass::removeUser(const mesh::RemoveUser& userToBeRemoved){
    for(auto nodeToUpdate : userToBeRemoved.path_occupied()){
        InternalWifiNode* nodePointer = id2PtrMap[nodeToUpdate].get();
        nodePointer->updateNode(userToBeRemoved.bandwidth_occupied());
    }
}