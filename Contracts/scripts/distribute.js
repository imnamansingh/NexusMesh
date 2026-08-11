import { ethers } from "ethers";
import hre from "hardhat";

// Helper function to generate realistic coordinates (e.g., centered around India/NCR region)
function generateRealisticLocation() {
    // Example center point (New Delhi, India approx: 28.6139, 77.2090)
    const baseLat = 28.6139;
    const baseLon = 77.2090;

    // Add a small random offset (~within a 20-30km radius)
    const latOffset = (Math.random() - 0.5) * 0.3;
    const lonOffset = (Math.random() - 0.5) * 0.3;

    return {
        lat: Number((baseLat + latOffset).toFixed(6)),
        lon: Number((baseLon + lonOffset).toFixed(6))
    };
}

// Helper function to generate a random local/public IP address
function generateRandomIP() {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

async function spawnMockDaemon(ledgerContractAddress, orchestratorApiUrl) {
    const [deployer] = await hre.ethers.getSigners();
    const provider = hre.ethers.provider;

    // 1. Generate a brand-new wallet for the daemon
    const daemonWallet = ethers.Wallet.createRandom().connect(provider);

    // 2. Fund the daemon with tiny ETH for gas (Required so it can sign its own on-chain registration)
    const fundEthTx = await deployer.sendTransaction({
        to: daemonWallet.address,
        value: ethers.parseEther("0.05") 
    });
    await fundEthTx.wait();

    // 3. Generate fake location and IP data
    const location = generateRealisticLocation();
    const ipAddress = generateRandomIP();

    console.log(`\n[Spawn] Daemon Address: ${daemonWallet.address}`);
    console.log(`[Data] Location: Lat ${location.lat}, Lon ${location.lon} | IP: ${ipAddress}`);

    // 4. Register on-chain with the smart contract
    // (Note: If your ledger contract expects location strings alongside IP, you can pass them or format them)
    const ledger = await hre.ethers.getContractAt("NexusMeshLedger", ledgerContractAddress, daemonWallet);
    
    console.log("Registering node on-chain...");
    const registerTx = await ledger.registerNode(ipAddress);
    await registerTx.wait();
    console.log("On-chain registration successful!");

    // 5. Send an API request to your Orchestrator with all metadata
    const daemonPayload = {
        walletAddress: daemonWallet.address,
        ipAddress: ipAddress,
        latitude: location.lat,
        longitude: location.lon,
        registeredAt: Math.floor(Date.now() / 1000)
    };

    try {
        /*
        // Uncomment this once your orchestrator backend endpoint is running
        const response = await fetch(orchestratorApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(daemonPayload)
        });
        const result = await response.json();
        console.log("Orchestrator sync success:", result);
        */
       console.log("Simulated Orchestrator API Payload sent:", daemonPayload);
    } catch (apiError) {
        console.error("Failed to sync with Orchestrator API:", apiError.message);
    }
}

async function main() {
    const ledgerAddress = "YOUR_DEPLOYED_LEDGER_ADDRESS";
    const orchestratorUrl = "http://localhost:4000/api/nodes/register"; // Your backend endpoint

    // Spawn 5 mock daemons simultaneously (or scale up to thousands using a loop)
    const totalDaemonsToSpawn = 5;
    console.log(`Spawning ${totalDaemonsToSpawn} mock daemons...`);

    for (let i = 0; i < totalDaemonsToSpawn; i++) {
        await spawnMockDaemon(ledgerAddress, orchestratorUrl);
    }

    console.log("\nAll mock daemons spawned and registered successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error spawning daemons:", error);
        process.exit(1);
    });
    