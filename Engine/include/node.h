#ifndef NODE_H
#define NODE_H

struct WiFiNode {
    int id;
    double x, y;
    double transmitPower;
    bool isActive;
};

#endif