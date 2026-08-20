
import hre from "hardhat";
import fs from "fs";
import os from "os";
import path from "path";


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

    const key = "LEDGER_CONTRACT_ADDRESS";
    const newValue = String(ledgerAddress);

    const envPath = path.resolve(process.cwd(), '.env');

  
    if (!fs.existsSync(envPath)) {
        throw new Error('.env file not found');
    }

  
    const fileContent = fs.readFileSync(envPath, 'utf8');
    const lines = fileContent.split(os.EOL);

    let keyFound = false;
    
    const updatedLines = lines.map(line => {
    
        const regex = new RegExp(`^\\s*${key}\\s*=`);
        if (regex.test(line)) {
            keyFound = true;
            return `${key}=${newValue}`;
        }
        return line;
    });

  
    if (!keyFound) {
        updatedLines.push(`${key}=${newValue}`);
    }

  
    fs.writeFileSync(envPath, updatedLines.join(os.EOL), 'utf8');
    console.log(`Successfully updated ${key} in .env`);
        
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });