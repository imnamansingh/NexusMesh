#pragma once

#include "../../generated/mesh.pb.h"

#include <vector>
#include <cstdint>

class ServiceClass;

namespace MeshAlgorithms {
    std::vector<int64_t> getShortestPath(const mesh::User& userData, ServiceClass& serviceClass);
}