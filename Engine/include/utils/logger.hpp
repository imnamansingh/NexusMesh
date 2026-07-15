#pragma once

#include <iostream>
#include <string>

namespace ErrorHandling {
inline void logError(const std::string& component, const std::string& message) {
    std::cerr << "[ERROR][" << component << "] " << message << std::endl;
}

inline void logWarning(const std::string& component, const std::string& message) {
    std::clog << "[WARN][" << component << "] " << message << std::endl;
}
}