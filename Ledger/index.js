// Rate: 1 MESH token per 100 MB (104,857,600 bytes)
const TOKEN_PER_BYTE = 1 / 104857600; 
const PLATFORM_COMMISSION_RATE = 0.15; // 15% Platform Take-Rate

export async function calculateAndSettleSession(sessionId, bytesUsed, userAddress, nodeAddress) {
    // 1. Calculate Gross Cost in MESH tokens
    const grossCostTokens = bytesUsed * TOKEN_PER_BYTE;

    // 2. Calculate Profit & Node Split
    const platformFee = grossCostTokens * PLATFORM_COMMISSION_RATE;
    const nodePayout = grossCostTokens - platformFee;

    // Convert to token wei (18 decimals)
    const nodePayoutWei = ethers.parseEther(nodePayout.toFixed(18));
    const platformFeeWei = ethers.parseEther(platformFee.toFixed(18));

    // 3. Submit to Blockchain
    console.log(`Settling Session ${sessionId}:`);
    console.log(` -> Router Payout: ${nodePayout} MESH`);
    console.log(` -> Platform Revenue: ${platformFee} MESH`);

    const tx = await ledgerContract.settleSession(
        sessionId,
        bytesUsed,
        nodePayoutWei,
        platformFeeWei
    );
    await tx.wait();
}

// ledgerService.js
import { ethers } from "ethers";
import ledgerArtifact from "../../contracts/artifacts/contracts/NexusMeshLedger.sol/NexusMeshLedger.json" assert { type: "json" };

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");

// Dedicated private key for the Ledger Service wallet
const ledgerWallet = new ethers.Wallet(process.env.LEDGER_SERVICE_PRIVATE_KEY, provider);

const ledgerContract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    ledgerArtifact.abi,
    ledgerWallet
);

/**
 * Triggered by Orchestrator event when a Wi-Fi session terminates.
 */
export async function settleSessionFunds(sessionId, userAddress, nodeAddress, bytesUsed) {
    // 1. Convert Bytes to Token Cost (e.g., 1 MESH = 100 MB)
    const RATE_PER_BYTE = 1 / 104857600; 
    const tokenCostTokens = bytesUsed * RATE_PER_BYTE;
    const tokenCostWei = ethers.parseEther(tokenCostTokens.toFixed(18));

    console.log(`[LEDGER SERVICE] Transferring ${tokenCostTokens} MESH from ${userAddress} to ${nodeAddress}`);

    // 2. Call Smart Contract
    const tx = await ledgerContract.transferFunds(
        sessionId,
        userAddress,
        nodeAddress,
        tokenCostWei
    );

    // 3. Wait for transaction block confirmation
    const receipt = await tx.wait();
    console.log(`[LEDGER SERVICE] Settlement Confirmed! Tx Hash: ${receipt.hash}`);
}