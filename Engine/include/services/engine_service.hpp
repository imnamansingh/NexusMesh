#pragma once

#include "../../generated/mesh.grpc.pb.h"
#include "../../generated/mesh.pb.h"
#include "../core/service_class.hpp"

class EngineServiceClass final : public mesh::MeshService::Service{
private:
ServiceClass& serviceClass_;

public:

EngineServiceClass(ServiceClass& serviceClass);

::grpc::Status InitialReboot(::grpc::ServerContext* context, const mesh::NodeBatch* request, mesh::InitialRebootResponse* response) override;

::grpc::Status GetShortestPath(::grpc::ServerContext* context, const mesh::User* request, mesh::PathResponse* response) override;

::grpc::Status AddNodeMethod(::grpc::ServerContext* context, const mesh::AddNode* request, mesh::AddNodeResponse* response) override;

::grpc::Status RemoveNodeMethod(::grpc::ServerContext* context, const mesh::RemoveNode* request, mesh::RemoveNodeResponse* response) override;

::grpc::Status RemoveUserMethod(::grpc::ServerContext* context, const mesh::RemoveUser* request, mesh::RemoveUserResponse* response) override;

};