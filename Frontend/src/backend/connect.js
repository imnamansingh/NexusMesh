import conf from "../conf/index.js"

// message User {
//     int64 id = 1;
//     double lat = 2;
//     double lon = 3;
//     int64 required_bandwidth = 4;
//     int32 max_latency = 5;
// }

// where lat should be in range +90 to -90 and lon should be in range +180 to -180;

// generate user lat and lon around this location ie delhi

// const baseLat = 28.6139;
// const baseLon = 77.2090;

// const latOffset = (Math.random() - 0.5)*0.3;
// const lonOffset = (Math.random() - 0.5)*0.3;

// where required bandwidth should be below 300 and max latency should be below 50

// for getHistory, the data will be coming in response.data.history which will be an array

// implement a functionality so that no connection should exceed 1 hour time limit

export class ConnectionService {

    async getConnection( lat, lon, required_bandwidth, max_latency) {
        const connectionResponse = await fetch(`${conf.backendURL}/api/v1/frontend/get_connection`,{
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                lat,
                lon,
                required_bandwidth,
                max_latency
            })
        })

        const connectionResponseData = connectionResponse.json()

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

        const endConnectionResponseData = endConnectionResponse.json()

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

        const userHistoryData = userHistory.json()

        if(userHistoryData.success){

            console.log("Connection terminated successfully")
            return userHistoryData.data

            //you will get array of history in history field of the returned object where each element will be an object which will contain following fields.
            // {
            //     "sessionId": "uuid",
            //     "sessionStartTime": "ISO date string or null",
            //     "sessionEndTime": "ISO date string or null",
            //     "totalSessionTime": 120,
            //     "totalCost": 12.5,
            //     "totalBandwidthUsed": 1024,
            //     "userLat": 40.7,
            //     "userLon": -74.0,
            //     "nodeLat": 40.8,
            //     "nodeLon": -73.9,
            //     "userWalletAddress": "0x...",
            //     "nodeWalletAddress": "0x...",
            //     "createdAt": "ISO date string"
            // }

        }else{

            throw new Error(userHistoryData.message || "Fetch User history call Failed");

        }

    }

}

const connectionService = new ConnectionService()

export default connectionService

