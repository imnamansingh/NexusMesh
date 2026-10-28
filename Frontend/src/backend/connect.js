import conf from "../conf/index.js"
export class ConnectionService {

    async getConnection( {Latitude, Longitude, Bandwidth, Latency}) {
        const connectionResponse = await fetch(`${conf.backendURL}/api/v1/frontend/get_connection`,{
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                lat: Latitude,
                lon: Longitude,
                required_bandwidth: Bandwidth,
                max_latency: Latency
            })
        })

        const connectionResponseData = await connectionResponse.json()

        if(connectionResponseData.success){
            console.log("User connected successfully")
            return connectionResponseData.data

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

            console.log("Connection terminated successfully")
            return userHistoryData.data

        }else{

            throw new Error(userHistoryData.message || "Fetch User history call Failed");

        }

    }

}

const connectionService = new ConnectionService()

export default connectionService

