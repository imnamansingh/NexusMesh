#pragma once

#include <cmath>
struct Boundary {
    double centerLat = 0.0;
    double centerLon = 0.0;
    double halfLat = 90.0;
    double halfLon = 180.0;

    Boundary(double center_lat, double center_lon, double half_lat, double half_lon): 
    centerLat(center_lat), centerLon(center_lon), halfLat(half_lat / (111111.0 * std::cos(center_lat * M_PI / 180.0))), halfLon(half_lon/111111.0){

    }

    bool contains(double lat, double lon) const {
        return (lat >= centerLat - halfLat && lat <= centerLat + halfLat &&
                lon >= centerLon - halfLon && lon <= centerLon + halfLon);
    }
};