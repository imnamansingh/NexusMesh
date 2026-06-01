#pragma once

// implement error handling in this file

#include <cmath>
struct Boundary {
    double centerLat = 0.0;
    double centerLon = 0.0;
    double halfLat = 90.0;
    double halfLon = 180.0;

    Boundary() = default;

    Boundary(double clat, double clon, double hlat, double hlon): 
    centerLat(clat), centerLon(clon), halfLat(hlat), halfLon(hlon){}

    static Boundary fromMeters(double cLat, double cLon, double rangeInMeters){
        double halfLatInDegrees = rangeInMeters / 111111.0;
        double latRad = cLat * (std::acos(-1.0) / 180.0);
        double halfLonInDegrees = rangeInMeters / (111111.0 * std::cos(latRad));

        return {cLat, cLon, halfLatInDegrees, halfLonInDegrees};
    }

    bool contains(double lat, double lon) const {
        return (lat >= centerLat - halfLat && lat <= centerLat + halfLat &&
                lon >= centerLon - halfLon && lon <= centerLon + halfLon);
    }
};