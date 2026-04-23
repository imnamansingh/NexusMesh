#pragma once   

#include <vector>
#include <unordered_map>
#include <memory> 
#include "wifi_node.hpp"
#include "boundary.hpp"

class Quadtree {
private:
    static const int CAPACITY = 4;
    Boundary boundary;
    std::vector<InternalWifiNode*> nodes;
    bool divided = false;

    
    std::unique_ptr<Quadtree> nw, ne, sw, se;

    void subdivide();

public:
    Quadtree(Boundary b) : boundary(b) {}
    bool insert(InternalWifiNode* node);
    void query(const Boundary& range, std::vector<InternalWifiNode*>& found) const;
    void remove(InternalWifiNode& node);
};
