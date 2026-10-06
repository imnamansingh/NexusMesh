#pragma once

#include <cmath>
#include <stdexcept>

struct Boundary {
    //these are the default values for center of the earth covering whole earth
    double centerLat = 0.0;
    double centerLon = 0.0;
    double halfLat = 90.0;
    double halfLon = 180.0;

    //this is because when you declare your custom constructor the default constructor dies so you have to preserve that using the syntax below so that when no value has been passed the boundary should get initialised using default values 
    Boundary() = default;

    Boundary(double clat, double clon, double hlat, double hlon)
        : centerLat(clat), centerLon(clon), halfLat(hlat), halfLon(hlon) {}

    //static keyword is used to make a function the class level function that means you can call it with scope resolution operator like Boundary::fromMeters wihtout even needing a instance of that class or struct so that you can call that function on it.
    //to access the member property or methods of a cpp class instance you can use the dot notation. "->" is used only for pointers.
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

        // About 111,111 meters correspond to one degree of latitude, so convert the requested radius into half the rectangle's latitude span.
        double halfLatInDegrees = rangeInMeters / 111111.0;

        //Cos() function along with other trignometric functions are implemented in cpp in such a way that they take value in radians and return vlaue ranging from -1 to 1 and acos ie cosInverse does the opposite.

        //the line of code just below converts lat in degress to radians. This is done with the help of three steps
        //1. acos(_1.0) gives the value of pi with strong precision in radians.
        //2.Then value of pi is divided by 180.0 to get the value of radians in 1 degree because pi accounts for 180 degrees.
        //3.Then that value is multiplied by lat degree to get lat in radians.
        double latRad = cLat * (std::acos(-1.0) / 180.0);

        //now, we multiply the total degree of lon(which is calculated the same as lat) by cos(lat) to account for the fact that longitude degress get physically shorter towards the pole.
        double halfLonInDegrees = rangeInMeters / (111111.0 * std::cos(latRad));

        return {cLat, cLon, halfLatInDegrees, halfLonInDegrees};
    }

    //logic of this function is simple, if the lat of the location is in between (including the edge) the lower and upper limit of the boundary and lon of the location is in between (including the edge) the left and right limit of the boundary then the location lies within the boundary.
    bool contains(double lat, double lon) const {
        if (std::isnan(lat) || std::isnan(lon) || std::isinf(lat) || std::isinf(lon)) {
            return false;
        }
        return (lat >= centerLat - halfLat && lat <= centerLat + halfLat &&
                lon >= centerLon - halfLon && lon <= centerLon + halfLon);
    }
};