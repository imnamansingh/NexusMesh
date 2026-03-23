
#pragma once

#include <vector>
#include <cstdint>

struct InternalWifiNode {
    int64_t id;
    double lat;
    double lon;
    int64_t current_load;
    int64_t total_bandwidth;
    int64_t available_bandwidth;
    int32_t latency_ms;
    bool is_gateway;
    std::vector<int64_t> adjacency_list;

};
