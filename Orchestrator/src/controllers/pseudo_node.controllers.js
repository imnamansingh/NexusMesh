import { ethers } from "ethers";
import { WifiNode } from "../models/wifi_node.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { meshClient } from "../utils/GrpcClient.js"


const provider = new ethers.JsonRpcProvider(process.env.HARDHAT_NODE_URL || "http://127.0.0.1:8545");

const contractAddress = process.env.LEDGER_CONTRACT_ADDRESS;

//you can also import abi of NexusMesh Ledger contract from contracts directory because Hardhat create artifacts of the contract while compiling it and store it in parent directory. Those artifacts also include the abi of the contract.
//abi is only used by ethers to identify the function signature and encode the arguements into evm calldata bytes.
const abi = [
    "function nodes(address) view returns (address walletAddress, string ipAddress, uint256 registeredAt, bool isRegistered)"
];

const ledgerContract = new ethers.Contract(contractAddress, abi, provider);


const checkNodeOnChain = async (nodeAddress) => {

    try {
        
        const nodeInfo = await ledgerContract.nodes(nodeAddress);
        return nodeInfo.isRegistered;

    } catch (error) {
        console.error("Error querying blockchain:", error);
        return false;
    }
}

const registerNodes = asyncHandler ( async (req, res) => {

    const nodeArray = req.body;

    if(!nodeArray || !(nodeArray.length)){
        throw new ApiError(400, "Bad Request: Payload array not found!")
    }

    const createdNodes = [];

    for (const node of nodeArray) {

        const isNodeRegistered = await checkNodeOnChain(node.walletAddress)

        if(!isNodeRegistered){
            continue;
        }

        const createdNode = await WifiNode.create({
            id: node.id,
            walletAddress: node.walletAddress,
            ipAddress: node.ipAddress,
            lat: node.latitude,
            lon: node.longitude,
            totalBandwidth: node.maxBandwidth,
            availableBandwidth: node.maxBandwidth,
            isGateway: node.isGateway,
            maxLatency: node.maxLatency,
            registeredAt: node.registeredAt
        });

        createdNodes.push(createdNode);
    }

    const initialRebootArray = [];

    for (const node of createdNodes){

        const nodeObject = {
            id: BigInt(node.id),
            lat: node.lat,
            lon: node.lon,
            total_bandwidth: node.totalBandwidth,
            available_bandwidth: node.availableBandwidth,
            is_gateway: node.isGateway,
            latency_ms: node.maxLatency
        }

        initialRebootArray.push(nodeObject);

    }

    const initialRebootResponse = await meshClient.initialReboot({
        nodes: initialRebootArray
    })

    if(initialRebootResponse.status !== 0){
        throw new ApiError(500, `Internal Server Error: ${initialRebootResponse.status_message}`)
    }

    return res.status(200).json(
        new ApiResponse(200, "Nodes registered successfully")
    )

})

const addNode = asyncHandler ( async (req, res) => {

    const node = req.body;

    if(!node){
        throw new ApiError(400, "Bad Request: Node object not found")
    }

    const isNodeRegistered = await checkNodeOnChain(node.walletAddress);

    if(!isNodeRegistered){

        throw new ApiError(400, "Node is not registered on chain")
    }

    const createdNode = await WifiNode.create({
        id: node.id,
        walletAddress: node.walletAddress,
        ipAddress: node.ipAddress,
        lat: node.latitude,
        lon: node.longitude,
        totalBandwidth: node.maxBandwidth,
        availableBandwidth: node.maxBandwidth,
        isGateway: node.isGateway,
        maxLatency: node.maxLatency,
        registeredAt: node.registeredAt
    })

    if(!createdNode){

        throw new ApiError(500, "Internal Server Error: DB write operation failed!")
    }

    const nodeObject = {
        id: BigInt(createdNode.id),
        lat: createdNode.lat,
        lon: createdNode.lon,
        total_bandwidth: createdNode.totalBandwidth,
        available_bandwidth: createdNode.availableBandwidth,
        is_gateway: createdNode.isGateway,
        latency_ms: createdNode.maxLatency
    }

    const addNodeResponse = await meshClient.addNodeMethod({
        node: nodeObject
    })

    if(addNodeResponse.status !== 0){
        throw new ApiError(500, `Internal Server Error: ${addNodeResponse.status_message}`)
    }

    return res.status(200).json( new ApiResponse(200, "Node added successfully", createdNode))

})

const removeNode = asyncHandler ( async (req, res) => {

})

export {
    registerNodes,
    addNode,
    removeNode
}