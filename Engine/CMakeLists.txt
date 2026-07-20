cmake_minimum_required(VERSION 3.15)
project(EngineService LANGUAGES CXX)

set(VCPKG_APPLOCAL_DEPS ON)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 1. Locate the Protobuf and gRPC packages installed by vcpkg
find_package(protobuf CONFIG REQUIRED)
find_package(gRPC CONFIG REQUIRED)

# 2. Grab your source code files
file(GLOB_RECURSE SOURCE_FILES "src/*.cpp" "generated/*.cpp" "generated/*.cc")

# 3. Include generated directory so compiler can see proto headers
include_directories(include generated)

# 4. Define the executable
add_executable(EngineService ${SOURCE_FILES})

# 5. Link the libraries to your application
# This explicitly provides 'google/protobuf/...' and 'grpcpp/...' headers and code
target_link_libraries(EngineService PRIVATE 
    protobuf::libprotobuf 
    gRPC::grpc++
)

target_include_directories(EngineService PRIVATE include generated)

# Force Windows to copy all required DLLs next to the executable after building
add_custom_command(TARGET EngineService POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    "D:/PROJECTS/NexusMesh/Engine/vcpkg_installed/x64-windows/bin"
    $<TARGET_FILE_DIR:EngineService>
)