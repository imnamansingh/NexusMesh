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

        const logoutResponceData = await logoutResponce.json()

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

        const currentUserData = await currentUser.json()

        if(currentUserData.success){
            console.log("User details fetched successfully");
            return currentUserData.data.user;
        }else{
            throw new Error(currentUserData.message || "Fetch User details call failed");
        }
    }
}

const authService = new AuthService();

export default authService;


  
