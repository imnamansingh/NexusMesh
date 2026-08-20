import "dotenv/config"

import hre from "hardhat";

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

function generateRandomIP() {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function generateMaxBandwidth() {
    return Math.floor(Math.random()*281) + 20;
}

function generateMaxLatency() {
    return Math.floor(Math.random()*49) + 2;
}

function tellIsGateway() {
    return (Math.random() >= 0.7)
}
async function spawnMockDaemon(ledgerContractAddress, orchestratorApiUrl) {
    const [deployer] = await hre.ethers.getSigners();
    const provider = hre.ethers.provider;

    const daemonWallet = hre.ethers.Wallet.createRandom().connect(provider);

   
    const fundEthTx = await deployer.sendTransaction({
        to: daemonWallet.address,
        value: hre.ethers.parseEther("0.05") 
    });
    await fundEthTx.wait();

    const location = generateRealisticLocation();
    const ipAddress = generateRandomIP();
    const maxBandwidth = generateMaxBandwidth();
    const maxLatency = generateMaxLatency();
    const isGateway = tellIsGateway();

    console.log(`\n[Spawn] Daemon Address: ${daemonWallet.address}`);
    console.log(`[Data] Location: Lat ${location.lat}, Lon ${location.lon} | IP: ${ipAddress}`);

    
    const ledger = await hre.ethers.getContractAt("NexusMeshLedger", ledgerContractAddress, daemonWallet);
    
    console.log("Registering node on-chain...");
    const registerTx = await ledger.registerNode(ipAddress);
    await registerTx.wait();
    console.log("On-chain registration successful!");

    const daemonPayload = {
        walletAddress: daemonWallet.address,
        ipAddress: ipAddress,
        latitude: location.lat,
        longitude: location.lon,
        maxBandwidth: maxBandwidth,
        maxLatency: maxLatency,
        isGateway: isGateway,
        registeredAt: Math.floor(Date.now() / 1000)
    };

    try {
        
        const response = await fetch(orchestratorApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(daemonPayload)
        });
        const result = await response.json();
        console.log("Orchestrator sync success:", result);
        
       console.log("Simulated Orchestrator API Payload sent:", daemonPayload);
    } catch (apiError) {
        console.error("Failed to sync with Orchestrator API:", apiError.message);
    }
}

async function main() {
    const ledgerAddress = process.env.LEDGER_CONTRACT_ADDRESS;
    const orchestratorUrl = process.env.ORCHESTRATOR_URL || "http://localhost:3000/api/nodes/register";

    const totalDaemonsToSpawn = Number(process.env.MOCK_DAEMON_COUNT || 1000);
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
    