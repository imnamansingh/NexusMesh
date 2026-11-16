# syntax=docker/dockerfile:1.7

FROM ubuntu:24.04 AS build

ENV DEBIAN_FRONTEND=noninteractive \
    VCPKG_ROOT=/opt/vcpkg \
    VCPKG_DISABLE_METRICS=1 \
    VCPKG_MAX_CONCURRENCY=2

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        ca-certificates \
        cmake \
        curl \
        git \
        ninja-build \
        pkg-config \
        tar \
        unzip \
        zip \
    && rm -rf /var/lib/apt/lists/*

RUN git clone --depth 1 https://github.com/microsoft/vcpkg.git "$VCPKG_ROOT" \
    && "$VCPKG_ROOT/bootstrap-vcpkg.sh" -disableMetrics

RUN mkdir -p "$VCPKG_ROOT/overlay-triplets" \
    && printf '%s\n' \
        'include("${CMAKE_CURRENT_LIST_DIR}/../triplets/x64-linux.cmake")' \
        'set(VCPKG_BUILD_TYPE release)' \
        > "$VCPKG_ROOT/overlay-triplets/x64-linux-engine.cmake"

WORKDIR /src
COPY Engine/vcpkg.json /src/Engine/vcpkg.json
RUN --mount=type=cache,target=/root/.cache/vcpkg/archives,sharing=locked \
    --mount=type=cache,target=/opt/vcpkg/downloads,sharing=locked \
    git -C "$VCPKG_ROOT" fetch --depth=1 origin \
        "$(sed -n 's/.*"builtin-baseline"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' /src/Engine/vcpkg.json)" \
    && VCPKG_BINARY_SOURCES="clear;files,/root/.cache/vcpkg/archives,readwrite" \
        "$VCPKG_ROOT/vcpkg" install \
            --triplet x64-linux-engine \
            --host-triplet x64-linux-engine \
            --overlay-triplets="$VCPKG_ROOT/overlay-triplets" \
            --x-manifest-root=/src/Engine

COPY Engine/ /src/Engine/
COPY packages/proto/mesh.proto /src/packages/proto/mesh.proto

RUN mkdir -p /src/Engine/generated \
    && /src/Engine/vcpkg_installed/x64-linux-engine/tools/protobuf/protoc \
        --proto_path=/src/packages/proto \
        --cpp_out=/src/Engine/generated \
        --grpc_out=/src/Engine/generated \
        --plugin=protoc-gen-grpc=/src/Engine/vcpkg_installed/x64-linux-engine/tools/grpc/grpc_cpp_plugin \
        /src/packages/proto/mesh.proto

RUN cmake -S /src/Engine -B /src/Engine/build \
        -G Ninja \
        -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_TOOLCHAIN_FILE="$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake" \
        -DVCPKG_MANIFEST_MODE=OFF \
        -DVCPKG_INSTALLED_DIR=/src/Engine/vcpkg_installed \
        -DVCPKG_TARGET_TRIPLET=x64-linux-engine \
        -DVCPKG_HOST_TRIPLET=x64-linux-engine \
    && cmake --build /src/Engine/build --parallel 2

FROM ubuntu:24.04 AS runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        libgcc-s1 \
        libstdc++6 \
        zlib1g \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /src/Engine/build/EngineService /usr/local/bin/EngineService
COPY --from=build /src/Engine/vcpkg_installed/x64-linux-engine/lib/ /usr/local/lib/
RUN ldconfig \
    && useradd --system --no-create-home --uid 10001 engine

USER engine
EXPOSE 50051
ENTRYPOINT ["/usr/local/bin/EngineService"]
