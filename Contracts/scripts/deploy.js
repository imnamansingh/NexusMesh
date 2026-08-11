import hre from "hardhat";

async function main() {
    // 1. Get the accounts using hre.ethers
    const [deployer, ledgerServiceAccount] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const ledgerServiceAddress = ledgerServiceAccount.address;
    console.log("Assigned Ledger Service Address:", ledgerServiceAddress);

    // -------------------------------------------------------------------------
    // 2. Deploy MeshToken
    // -------------------------------------------------------------------------
    console.log("\nDeploying MeshToken...");
    const initialSupply = 10000; // Mint 10,000 whole tokens initially
    
    const MeshToken = await hre.ethers.getContractFactory("MeshToken");
    const meshToken = await MeshToken.deploy(initialSupply);
    
    await meshToken.waitForDeployment();
    const meshTokenAddress = await meshToken.getAddress();
    
    console.log(`MeshToken deployed to: ${meshTokenAddress}`);

    // -------------------------------------------------------------------------
    // 3. Deploy NexusMeshLedger
    // -------------------------------------------------------------------------
    console.log("\nDeploying NexusMeshLedger...");
    
    const NexusMeshLedger = await hre.ethers.getContractFactory("NexusMeshLedger");
    const nexusMeshLedger = await NexusMeshLedger.deploy(meshTokenAddress, ledgerServiceAddress);
    
    await nexusMeshLedger.waitForDeployment();
    const ledgerAddress = await nexusMeshLedger.getAddress();
    
    console.log(`NexusMeshLedger deployed to: ${ledgerAddress}`);

    // -------------------------------------------------------------------------
    // 4. Summary / Verification Output
    // -------------------------------------------------------------------------
    console.log("\n---------------------------------------------------------");
    console.log("Deployment Completed Successfully!");
    console.log("---------------------------------------------------------");
    console.log(`MeshToken Address       : ${meshTokenAddress}`);
    console.log(`NexusMeshLedger Address : ${ledgerAddress}`);
    console.log(`Ledger Service Address  : ${ledgerServiceAddress}`);
    console.log("---------------------------------------------------------");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });