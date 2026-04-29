#pragma once

#include "../../generated/mesh.pb.h"

#include <vector>

class ServiceClass;
class InternalWifiNode;

namespace MeshAlgorithms {
    std::vector<InternalWifiNode*> getShortestPath(const mesh::User& userData, ServiceClass& serviceClass);
}