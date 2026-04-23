#pragma once
struct Boundary {
    double x, y;
    double halfWidth, halfHeight;

    bool contains(double lat, double lon) const {
        return (lat >= x - halfWidth && lat <= x + halfWidth &&
                lon >= y - halfHeight && lon <= y + halfHeight);
    }
};