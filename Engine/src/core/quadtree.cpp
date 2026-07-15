#include <cmath>
#include <stdexcept>
#include "../../include/core/quadtree.hpp"
#include "../../include/core/boundary.hpp"

void Quadtree::subdivide() {
    double centerLat = boundary.centerLat;
    double centerLon = boundary.centerLon;
    double halfLat = boundary.halfLat / 2;
    double halfLon = boundary.halfLon / 2;

    nw = std::make_unique<Quadtree>(Boundary{centerLat + halfLat, centerLon - halfLon, halfLat, halfLon});
    ne = std::make_unique<Quadtree>(Boundary{centerLat + halfLat, centerLon + halfLon, halfLat, halfLon});
    sw = std::make_unique<Quadtree>(Boundary{centerLat - halfLat, centerLon - halfLon, halfLat, halfLon});
    se = std::make_unique<Quadtree>(Boundary{centerLat - halfLat, centerLon + halfLon, halfLat, halfLon});

    divided = true;
}

bool Quadtree::insert(InternalWifiNode* node) {
    if (node == nullptr) {
        return false;
    }
    if (!boundary.contains(node->lat, node->lon)) {
        return false;
    }

    if (nodes.size() < CAPACITY) {
        nodes.push_back(node);
        return true;
    }

    if (!divided) {
        subdivide();
    }

    return (nw->insert(node) || ne->insert(node) || sw->insert(node) || se->insert(node));
}

void Quadtree::query(const Boundary& range, std::vector<InternalWifiNode*>& found) const {
    if (!(abs(range.centerLat - boundary.centerLat) <= (range.halfLat + boundary.halfLat) &&
          abs(range.centerLon - boundary.centerLon) <= (range.halfLon + boundary.halfLon))) {
        return;
    }

    for (const auto nodePtr : nodes) {
        if (nodePtr != nullptr && range.contains(nodePtr->lat, nodePtr->lon)) {
            found.push_back(nodePtr);
        }
    }

    if (divided) {
        nw->query(range, found);
        ne->query(range, found);
        sw->query(range, found);
        se->query(range, found);
    }
}

bool Quadtree::remove(InternalWifiNode* node) {
    if (node == nullptr || !(boundary.contains(node->lat, node->lon))) {
        return false;
    }

    for (int i = 0; i < static_cast<int>(nodes.size()); ++i) {
        if (nodes[i] == node) {
            nodes.erase(nodes.begin() + i);
            return true;
        }
    }

    if (divided) {
        return (nw->remove(node) || ne->remove(node) || sw->remove(node) || se->remove(node));
    }

    return false;
}