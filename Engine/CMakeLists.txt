cmake_minimum_required(VERSION 3.15)
project(EngineService LANGUAGES CXX)

set(VCPKG_APPLOCAL_DEPS ON)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(protobuf CONFIG REQUIRED)
find_package(gRPC CONFIG REQUIRED)

file(GLOB_RECURSE SOURCE_FILES "src/*.cpp" "generated/*.cpp" "generated/*.cc")

include_directories(include generated)

add_executable(EngineService ${SOURCE_FILES})

target_link_libraries(EngineService PRIVATE 
    protobuf::libprotobuf 
    gRPC::grpc++
)

target_include_directories(EngineService PRIVATE include generated)

# Keep the Windows runtime DLLs next to the executable.
if(WIN32)
    add_custom_command(TARGET EngineService POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_directory
        "$<IF:$<CONFIG:Debug>,${CMAKE_CURRENT_SOURCE_DIR}/vcpkg_installed/x64-windows/debug/bin,${CMAKE_CURRENT_SOURCE_DIR}/vcpkg_installed/x64-windows/bin>"
        $<TARGET_FILE_DIR:EngineService>
    )
endif()