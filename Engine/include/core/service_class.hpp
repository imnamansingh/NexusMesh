#pragma once

#include <memory>
#include <unordered_map>
#include "wifi_node.hpp"
#include "quadtree.hpp"
#include "../../generated/mesh.pb.h"

class ServiceClass {
public:
    std::unordered_map<int64_t, std::unique_ptr<InternalWifiNode>> id2PtrMap;
    std::unique_ptr<Quadtree> quadtree;

    void createQuadtree(const mesh::NodeBatch& batch);
    void createAdjacencyList();
    void removeUser(const mesh::RemoveUser& userToBeRemoved);


};