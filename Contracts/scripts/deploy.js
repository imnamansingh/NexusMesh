
import hre from "hardhat";

async function main() {

    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const ledgerServiceAddress = deployer.address;
    console.log("Assigned Ledger Service Address:", ledgerServiceAddress);

    console.log("\nDeploying MeshToken...");
    const initialSupply = 10000;

    const MeshToken = await hre.ethers.getContractFactory("MeshToken");

    const meshToken = await MeshToken.deploy(initialSupply);

    await meshToken.waitForDeployment();

    const meshTokenAddress = await meshToken.getAddress();

    console.log(`MeshToken deployed to: ${meshTokenAddress}`);

    console.log("\nDeploying NexusMeshLedger...");

    const NexusMeshLedger = await hre.ethers.getContractFactory("NexusMeshLedger");
    const nexusMeshLedger = await NexusMeshLedger.deploy(meshTokenAddress, ledgerServiceAddress);

    await nexusMeshLedger.waitForDeployment();
    const ledgerAddress = await nexusMeshLedger.getAddress();

    console.log(`NexusMeshLedger deployed to: ${ledgerAddress}`);

    console.log("Deployment Completed Successfully!");

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });
