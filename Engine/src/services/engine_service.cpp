
#include "../../generated/mesh.grpc.pb.h"
#include "../../generated/mesh.pb.h"

#include "../../include/services/engine_service.hpp"

#include "../../include/core/dijkstra.hpp"
#include "../../include/core/service_class.hpp"

EngineServiceClass :: EngineServiceClass(ServiceClass& serviceClass): serviceClass_(serviceClass){}

::grpc::Status EngineServiceClass :: InitialReboot(::grpc::ServerContext* context, const mesh::NodeBatch* request, mesh::InitialRebootResponse* response){

    if(request == nullptr){
        response->set_status(mesh::Status::FAILED);
        response->set_status_message("Request is null");
        return ::grpc::Status(::grpc::StatusCode::INVALID_ARGUMENT, "NodeBatch request is null");
    }

    if(request->nodes().size() == 0){
        response->set_status(mesh::Status::FAILED);
        response->set_status_message("Empty node batch");
        return ::grpc::Status(::grpc::StatusCode::INVALID_ARGUMENT, "NodeBatch is empty");
    }

    try{
        this->serviceClass_.createQuadtree(*request);
    }catch(const std::exception& e){
        response->set_status(mesh::Status::FAILED);
        response->set_status_message(std::string("Quadtree creation failed: ") + e.what());
        return ::grpc::Status(::grpc::StatusCode::INTERNAL, "Failed to create quadtree");
    }

    try{
        this->serviceClass_.createAdjacencyList();
    }catch(const std::exception& e){
        response->set_status(mesh::Status::FAILED);
        response->set_status_message(std::string("Adjacency creation failed: ") + e.what());
        return ::grpc::Status(::grpc::StatusCode::INTERNAL, "Failed to create adjacency lists");
    }

    response->set_status(mesh::Status::SUCCESS);
    response->set_status_message("Initial reboot completed successfully");

    return ::grpc::Status::OK;
    
}

::grpc::Status EngineServiceClass :: GetShortestPath(::grpc::ServerContext* context, const mesh::User* request, mesh::PathResponse* response){

    if(request == nullptr){
        response->set_status(mesh::Status::FAILED);
        response->set_status_message("Request is null");
        return ::grpc::Status(::grpc::StatusCode::INVALID_ARGUMENT, "NodeBatch request is null");
    }

    // try{
    //     MeshAlgorithms::getShortestPath(*request, serviceClass_); 
    // }catch(const std::exception& e){

    // }
    


}

::grpc::Status EngineServiceClass :: AddNodeMethod(::grpc::ServerContext* context, const mesh::AddNode* request, mesh::AddNodeResponse* response){

    if(request == nullptr){
        response->set_status(mesh::Status::FAILED);
        response->set_status_message("Request is null");
        return ::grpc::Status(::grpc::StatusCode::INVALID_ARGUMENT, "NodeBatch request is null");
    }

}

::grpc::Status EngineServiceClass :: RemoveNodeMethod(::grpc::ServerContext* context, const mesh::RemoveNode* request, mesh::RemoveNodeResponse* response){

    if(request == nullptr){
        response->set_status(mesh::Status::FAILED);
        response->set_status_message("Request is null");
        return ::grpc::Status(::grpc::StatusCode::INVALID_ARGUMENT, "NodeBatch request is null");
    }

}

::grpc::Status EngineServiceClass :: RemoveUserMethod(::grpc::ServerContext* context, const mesh::RemoveUser* request, mesh::RemoveUserResponse* response){

    if(request == nullptr){
        response->set_status(mesh::Status::FAILED);
        response->set_status_message("Request is null");
        return ::grpc::Status(::grpc::StatusCode::INVALID_ARGUMENT, "NodeBatch request is null");
    }

}






