import {ethers} from "ethers";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

async function settleSessiononContract(totalCost, userWalletAddress, nodeWalletAddress) {
  
  const provider = new ethers.JsonRpcProvider(process.env.HARDHAT_NODE_URL || 'http://127.0.0.1:8545');

  
  const deployerSigner = await provider.getSigner(0);
  
  
  console.log("Executing tx using address:", await deployerSigner.getAddress());

  
  const abi = [
    "function transferFunds(address _user, address _node, uint256 _tokenCost)"
  ];
  
  const contractAddress = process.env.LEDGER_CONTRACT_ADDRESS;

  
  const contract = new ethers.Contract(contractAddress, abi, deployerSigner);

  
  const tx = await contract.transferFunds(
    userWalletAddress,
    nodeWalletAddress,
    totalCost
  );
  await tx.wait();
  
  console.log("Transaction successfully executed!");
}

function calculateTotalTime (startDateString, endDateString) {
    const startDate = new Date (startDateString);
    const endDate = new Date (endDateString);
    const totalTimeInMS = endDate - startDate;
    const totalTime = totalTimeInMS / 1000;
    return Math.round(totalTime);
}

function calculateTotalCost (totalBandwidthUsed, totalTimeTaken){
    const totalCost = ((totalBandwidthUsed * 7) + (totalTimeTaken * 3)) / 10;
    return totalCost;
}

const settleSession = async (req, res) => {

    const {
        sessionStartTime,
        sessionEndTime,
        totalBandwidthUsed,
        userLat,
        userLon,
        nodeLat,
        nodeLon,
        userWalletAddress,
        nodeWalletAddress
    } = req.body;

    if((!sessionStartTime) || (!sessionEndTime) || (!totalBandwidthUsed) || (!userWalletAddress) || (!nodeWalletAddress)){
        return res.status(400).json({
            error: "Invalid Arguements: Required fields are not provided"
        })
    }

    const totalSessionTime = calculateTotalTime(sessionStartTime, sessionEndTime);

    const totalCost = calculateTotalCost(totalBandwidthUsed, totalSessionTime);

    const totalCostInSmallestMeshUnits = ethers.parseUnits(`${totalCost}`, 18);

    try {
        await settleSessiononContract(totalCostInSmallestMeshUnits, userWalletAddress, nodeWalletAddress);

    } catch (error) {
        console.log(`error while updating wallet balances of user and node on net: ${error}`);
        return res.status(500).json({
            error: "INTERNAL SERVER ERROR: error while updating balance of user and node on net"
        })  
    }

    
    try {
        const newRow = await prisma.session.create({
            data: {
                sessionStartTime: sessionStartTime? new Date(sessionStartTime) : null,
                sessionEndTime: sessionEndTime? new Date(sessionEndTime) : null,
                totalSessionTime,
                totalCost,
                totalBandwidthUsed: totalBandwidthUsed === null ? BigInt(totalBandwidthUsed) : null,
                userLat: userLat === null ? Number(userLat) : null,
                userLon: userLon === null ? Number(userLon) : null,
                nodeLat: nodeLat === null ? Number(nodeLat) : null,
                nodeLon: nodeLon === null ? Number(nodeLon) : null,
                userWalletAddress,
                nodeWalletAddress
            }
        })

        return res.status(200).json({
            statusCode: 200,
            status: "session has been settled successfully"
        })
    } catch (error) {
        console.log(`error while updating session info at DB: ${error}`);
        return res.status(500).json({
            error: "INTERNAL SERVER ERROR: error while persisting session information on DB"
        })
    }
}

const getUserHistory = async (req, res) => {

    const { userWalletAddress } = req.query;

    if(!userWalletAddress){
        return res.status(400).json({
            error: "userWalletAddress is required"
        })
    }

    try {
        const sessionHistory = await prisma.session.findMany({
            where: { userWalletAddress }
        });

        const response = sessionHistory.map((session) => ({
            ...session,
            totalBandwidthUsed: session.totalBandwidthUsed ? Number(session.totalBandwidthUsed) : null,
            totalCost: session.totalCost? Number(session.totalCost) : null

        }))

        return res.status(200).json(response);
        
    } catch (error) {
        console.log(`error while fetching user history from DB: ${error}`);

        return res.status(500).json({
            error: "unable to fetch user history"
        });
    }

}

export {
    settleSession,
    getUserHistory
}