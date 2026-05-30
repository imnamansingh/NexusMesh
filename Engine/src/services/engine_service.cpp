
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
        return ::grpc::Status(::grpc::StatusCode::INVALID_ARGUMENT, "User request is null");
    }

    try{

        auto path = MeshAlgorithms::getShortestPath(*request, serviceClass_);
        if(path.empty()) throw std::runtime_error("User is far away from a mesh");
        for(int64_t nodeId: path){
            response->add_path_list(nodeId);
        }
        response->set_gateway_id(path.back());
        response->set_no_of_hops(static_cast<int32_t>(path.size()));
    
    }catch(const std::runtime_error& e){
        response->set_status(mesh::Status::OUT_OF_RANGE);
        response->set_status_message(std::string("Unable to find a path: ") + e.what());
        return ::grpc::Status(::grpc::StatusCode::INTERNAL, "Unable to find a path as user is far away from a mesh");
        

    }catch(const std::exception& e){
        response->set_status(mesh::Status::FAILED);
        response->set_status_message(std::string("Algorithm failed to find a path: ") + e.what());
        return ::grpc::Status(::grpc::StatusCode::INTERNAL, "failed to find a path");
    }

    response->set_status(mesh::Status::SUCCESS);
    response->set_status_message("The shortest path was found successfully");

    return ::grpc::Status::OK;
    
}

::grpc::Status EngineServiceClass :: AddNodeMethod(::grpc::ServerContext* context, const mesh::AddNode* request, mesh::AddNodeResponse* response){

    if(request == nullptr){
        response->set_status(mesh::Status::FAILED);
        response->set_status_message("Request is null");
        return ::grpc::Status(::grpc::StatusCode::INVALID_ARGUMENT, "AddNode request is null");
    }

    try{

        auto list = serviceClass_.createNode(*request);
        for(auto node: list){
            response->add_adjacency_list(node);
        }
        
    }catch(const std::exception& e){

        response->set_status(mesh::Status::FAILED);
        response->set_status_message(std::string("Unable to create a new node: ") + e.what());
        return ::grpc::Status(::grpc::StatusCode::INTERNAL, "Creation of new node failed");
    }

    response->set_status(mesh::Status::SUCCESS);
    response->set_status_message("New node created successfully");

    return ::grpc::Status::OK;

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






