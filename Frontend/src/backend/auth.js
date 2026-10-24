import { ethers } from "ethers";
import conf from "../conf/index.js"

export class AuthService {

    async login() {

        if (!window.ethereum) {
            throw new Error("MetaMask extension not found in browser");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", [])

        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        console.log("Connected account:", userAddress);

        const nonceResponse = await fetch(
            `${conf.backendURL}/api/v1/frontend/get_nonce?walletAddress=${encodeURIComponent(userAddress)}`,
            {
                credentials: "include"
                //this is browser related property of fetch API, and it makes sense because only browser sends cookies along with a request.
                //Backend can send cookies in response of a request but it never sends cookie in a request that's why fetch API of nodejs dont provide this property.
                //If you still need to send cookies with a request from backend, you backend code must handle it explicitly.
            }
        );

        const nonceResponseData = await nonceResponse.json();

        if (!nonceResponse.ok) {

            throw new Error(nonceResponseData.message || "Could not get login challenge");
        }

        const { message } = nonceResponseData.data

        const signature = await signer.signMessage(message);

        const verifyResponse = await fetch(`${conf.backendURL}/api/v1/frontend/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message,
                signature 
            })
        });

        const authData = await verifyResponse.json();

        if (authData.success) {
            console.log("User successfully logged in");
            return userAddress;
        } else {
            throw new Error(authData.message || "Authentication failed");
        }

    }
    

    async logout() {

        const logoutResponce = await fetch(`${conf.backendURL}/api/v1/frontend/logout`,
            {
                credentials: "include"
            }
        )

        const logoutResponceData = logoutResponce.json()

        if(logoutResponceData.success){
            console.log("User successfully logged out");
            return logoutResponceData.data;
        }else{
            throw new Error(logoutResponceData.message || "Logout failed");
        }
    }

    async getCurrentUser() {

        const currentUser = await fetch(`${conf.backendURL}/api/v1/frontend/get_user`,
            {
                credentials: "include"
            }
        )

        const currentUserData = currentUser.json()

        if(currentUserData.success){
            console.log("User details fetched successfully");
            return currentUserData.data;
            //you will get a user field in this returned object which will contain the wallet address of the current user.
        }else{
            throw new Error(currentUserData.message || "Fetch User details call failed");
        }
    }
}

const authService = new AuthService();

export default authService;


  
