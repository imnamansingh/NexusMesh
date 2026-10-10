import "dotenv/config"

import hre from "hardhat";

function generateRealisticLocation() {
    // Example center point (New Delhi, India approx: 28.6139, 77.2090)
    const baseLat = 28.6139;
    const baseLon = 77.2090;

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
async function spawnMockDaemon(id, ledgerContractAddress) {
    const [deployer] = await hre.ethers.getSigners();

    //provider is a read-only window or communication line talking to an Ethereum node
    const provider = hre.ethers.provider;

    //by connecting the newly generated wallet to provider you have connected it to the blockchain net
    const daemonWallet = hre.ethers.Wallet.createRandom().connect(provider);

    //this .sendTransaction fn is provided by ether to all the generated accounts and through this fn they can transfer the eth funded in their accounts to other walllets.
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

    //here third arg is optional like it is only required for a transaction and not for read only operations. When performing a transaction, you have to specify a wallet or signer so that blockchain gets to know who is signing this transaction.
    const ledger = await hre.ethers.getContractAt("NexusMeshLedger", ledgerContractAddress, daemonWallet);
    
    console.log("Registering node on-chain...");

    //when you call this fn, ether.js is making a JSON rpc call to you local blockchain net behind the scenes at localhost:8545 (which is automatically detected by ether.js with the help of the hardhat config file).
    const registerTx = await ledger.registerNode(ipAddress);
    await registerTx.wait();
    console.log("On-chain registration successful!");

    return {
        id,
        walletAddress: daemonWallet.address,
        ipAddress,
        latitude: location.lat,
        longitude: location.lon,
        maxBandwidth,
        maxLatency,
        isGateway,
        registeredAt: Math.floor(Date.now() / 1000)
    };
    
}

async function main() {
    const ledgerAddress = process.env.LEDGER_CONTRACT_ADDRESS;
    const orchestratorUrl = process.env.ORCHESTRATOR_URL || "http://localhost:3000/api/v1/pseudo_node/register";

    let nodePayloadArray = [];

    const totalDaemonsToSpawn = Number(process.env.MOCK_DAEMON_COUNT || 1000);
    console.log(`Spawning ${totalDaemonsToSpawn} mock daemons...`);

    for (let i = 1; i <= totalDaemonsToSpawn; i++) {
        const nodePayload = await spawnMockDaemon(i, ledgerAddress);
        nodePayloadArray.push(nodePayload);
    }
        
    const response = await fetch(orchestratorUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nodePayloadArray)
    });

    const result = await response.json();

    if(response.ok) {

        console.log("Orchestrator sync success:", result);

        console.log("\nAll mock daemons spawned and registered successfully!");
        
    }
    else {

        console.log("Orchestrator sync failed:", result.message)

    }   

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error spawning daemons:", error);
        process.exit(1);
    });
    