#include <cmath>
#include "../../include/core/quadtree.hpp"

void Quadtree::subdivide() {
    double x = boundary.x;
    double y = boundary.y;
    double w = boundary.halfWidth / 2;
    double h = boundary.halfHeight / 2;

    nw = std::make_unique<Quadtree>(Boundary{x - w, y + h, w, h});
    ne = std::make_unique<Quadtree>(Boundary{x + w, y + h, w, h});
    sw = std::make_unique<Quadtree>(Boundary{x - w, y - h, w, h});
    se = std::make_unique<Quadtree>(Boundary{x + w, y - h, w, h});

    divided = true;
}

bool Quadtree::insert(const InternalWifiNode& node) {
    if (!boundary.contains(node.lat, node.lon)) {
        return false;
    }

    if (nodes.size() < CAPACITY && !divided) {
        nodes.push_back(node);
        return true;
    }

    if (!divided) {
        subdivide();
        
    }

    return (nw->insert(node) || ne->insert(node) || 
            sw->insert(node) || se->insert(node));
}

void Quadtree::query(const Boundary& range, std::vector<InternalWifiNode>& found) const {
    if (!(abs(range.x - boundary.x) <= (range.halfWidth + boundary.halfWidth) && 
    abs(range.y - boundary.y) <= (range.halfHeight + boundary.halfHeight))) {
        return;
    }
    for (const auto& node : nodes) {
        if (range.contains(node.lat, node.lon)) {
            found.push_back(node);
        }
    }

    if (divided) {
        nw->query(range, found);
        ne->query(range, found);
        sw->query(range, found);
        se->query(range, found);
    }
}