#pragma once

#include <cmath>
#include <stdexcept>

struct Boundary {
    double centerLat = 0.0;
    double centerLon = 0.0;
    double halfLat = 90.0;
    double halfLon = 180.0;

    Boundary() = default;

    Boundary(double clat, double clon, double hlat, double hlon)
        : centerLat(clat), centerLon(clon), halfLat(hlat), halfLon(hlon) {}

    static Boundary fromMeters(double cLat, double cLon, double rangeInMeters) {
        if (std::isnan(cLat) || std::isnan(cLon) || std::isinf(cLat) || std::isinf(cLon)) {
            throw std::invalid_argument("Coordinates must be finite values");
        }
        if (cLat < -90.0 || cLat > 90.0) {
            throw std::out_of_range("Latitude is outside the valid range");
        }
        if (cLon < -180.0 || cLon > 180.0) {
            throw std::out_of_range("Longitude is outside the valid range");
        }
        if (std::isnan(rangeInMeters) || std::isinf(rangeInMeters) || rangeInMeters <= 0.0) {
            throw std::invalid_argument("Search range must be a positive finite value");
        }

        double halfLatInDegrees = rangeInMeters / 111111.0;
        double latRad = cLat * (std::acos(-1.0) / 180.0);
        double halfLonInDegrees = rangeInMeters / (111111.0 * std::cos(latRad));

        return {cLat, cLon, halfLatInDegrees, halfLonInDegrees};
    }

    bool contains(double lat, double lon) const {
        if (std::isnan(lat) || std::isnan(lon) || std::isinf(lat) || std::isinf(lon)) {
            return false;
        }
        return (lat >= centerLat - halfLat && lat <= centerLat + halfLat &&
                lon >= centerLon - halfLon && lon <= centerLon + halfLon);
    }
};