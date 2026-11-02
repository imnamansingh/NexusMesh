import conf from "../conf/index.js"
import { ethers } from "ethers";
export class ConnectionService {

    async getConnection( {Latitude, Longitude, Bandwidth, Latency}) {

        if (!window.ethereum) {
            throw new Error("MetaMask extension not found in browser");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const userSigner = await provider.getSigner();

        const token = new ethers.Contract(
            conf.tokenAddress,
            conf.functionABI,
            userSigner
        );

        const walletResponse = await token.approve(
            conf.ledgerAddress,
            ethers.parseUnits("100", 18)
        )

        //wait() waits for the transaction to be included in a block. 
        await walletResponse.wait();

        const connectionResponse = await fetch(`${conf.backendURL}/api/v1/frontend/get_connection`,{
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                lat: Number(Latitude),
                lon: Number(Longitude),
                required_bandwidth: Number(Bandwidth),
                max_latency: Number(Latency)
            })
        })

        const connectionResponseData = await connectionResponse.json()

        if(connectionResponseData.success){
            console.log("User connected successfully")
            return connectionResponseData.data.nodeMapArray

        }else{
            throw new Error(connectionResponseData.message || "Connection Failed");
        }
    }

    async terminateConnection() {

        const endConnectionResponse = await fetch(`${conf.backendURL}/api/v1/frontend/end_connection`,
            {
                credentials: "include"
            }
        )

        const endConnectionResponseData = await endConnectionResponse.json()

        if(endConnectionResponseData.success){

            console.log("Connection terminated successfully")
            return endConnectionResponseData.data

        }else{

            throw new Error(endConnectionResponseData.message || "Connection termination Failed");

        }
    }

    async getUserHistory() {

        const userHistory = await fetch(`${conf.backendURL}/api/v1/frontend/get_session_history`,
            {
                credentials: "include"
            }
        )

        const userHistoryData = await userHistory.json()

        if(userHistoryData.success){

            console.log("User history fetched successfully")
            return userHistoryData.data

        }else{

            throw new Error(userHistoryData.message || "Fetch User history call Failed");

        }

    }

}

const connectionService = new ConnectionService()

export default connectionService

