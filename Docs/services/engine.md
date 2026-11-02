# C++ Engine

## Responsibility

The Engine is a C++20 gRPC server for mesh graph management and path selection. It uses a quadtree to find geographically nearby nodes, adjacency lists for local links, and a Dijkstra-style priority queue to select a route to a gateway.

## Interface

- Bind address: `0.0.0.0:50051`
- Service and message definitions: [`packages/proto/mesh.proto`](../../packages/proto/mesh.proto)
- RPCs: initial node batch, shortest path, add/remove node, and release user reservation.

## Runtime behavior

`InitialReboot` initializes the quadtree and adjacency lists. `GetShortestPath` reserves bandwidth along its returned path; `RemoveUserMethod` releases that reservation.

The Engine checks node coordinates and bandwidth when loading or adding nodes. The current path algorithm filters nodes by available bandwidth and latency, limits path expansion to 20 hops, and uses distance, node load, and latency in its cost calculation.

## Build

Dependencies are declared in `vcpkg.json` (`grpc`, `protobuf`). The CMake project expects generated protobuf/gRPC C++ sources under `Engine/generated`.

### Generate C++ protobuf and gRPC sources

Run these commands in **PowerShell** from the repository's `packages/proto` directory. Ensure `Engine/generated` exists first.

```powershell
D:\PROJECTS\NexusMesh\Engine\vcpkg_installed\x64-windows\tools\protobuf\protoc.exe --proto_path . --cpp_out=../../Engine/generated mesh.proto

D:\PROJECTS\NexusMesh\Engine\vcpkg_installed\x64-windows\tools\protobuf\protoc.exe --proto_path . --grpc_out=../../Engine/generated --plugin=protoc-gen-grpc=D:\PROJECTS\NexusMesh\Engine\vcpkg_installed\x64-windows\tools\grpc\grpc_cpp_plugin.exe mesh.proto
```

The first command generates `mesh.pb.h` and `mesh.pb.cc`. The second generates `mesh.grpc.pb.h` and `mesh.grpc.pb.cc`. These files are included by the Engine sources and are generated from `packages/proto/mesh.proto`.

Example configure/build from `Engine` using a local vcpkg installation. Run these commands in PowerShell, following the Engine build notes:

```powershell
# Run from the Engine directory.
cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE="<path-to-vcpkg>/scripts/buildsystems/vcpkg.cmake"
cmake --build build --config Release --parallel
```

Start the built executable from Git Bash opened in `Engine`, for example:

```bash
./build/Release/EngineService.exe
```

## Observability and tests

The server logs startup/shutdown and periodic uptime metrics to stdout.
