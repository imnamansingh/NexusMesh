#include <cmath>
#include <stdexcept>
#include "../../include/core/quadtree.hpp"
#include "../../include/core/boundary.hpp"

//this function simply initialise the children of the qaudtree and mark the divided property as true
void Quadtree::subdivide() {
    double centerLat = boundary.centerLat;
    double centerLon = boundary.centerLon;
    double halfLat = boundary.halfLat / 2;
    double halfLon = boundary.halfLon / 2;

    //make_unique is used to initialise a unique pointer.
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

//this function finds all the nodes lying within the boundary provided to it. It simply checks if the boundary provided and the boundary of the quadtree overlaps or not by checking if the distance between the lats of these boundaries is less than the addition of their halflats and same goes for lons. If both the conditions are true, then boundaries overlaps. It checks for all the nodes in quadtree nodes vector one by one with the help of boundary.contains() fn and then it calls for the children of that quadtree.
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

//this fn simply removes the node.
bool Quadtree::remove(InternalWifiNode* node) {
    if (node == nullptr || !(boundary.contains(node->lat, node->lon))) {
        return false;
    }

    for (int i = 0; i < static_cast<int>(nodes.size()); ++i) {
        if (nodes[i] == node) {

            //if you pass a single iterator to erase(), it will only erase the element at that iterator.The vector shifts the later elements left to fill the gap.
            nodes.erase(nodes.begin() + i);
            return true;
        }
    }

    if (divided) {
        return (nw->remove(node) || ne->remove(node) || sw->remove(node) || se->remove(node));
    }

    return false;
}