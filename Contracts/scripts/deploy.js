
import hre from "hardhat";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const updateENV = (pathToEnv, ledgerAddress) => {

    if(!fs.existsSync(pathToEnv)){
        throw new Error('.env file not found');
    }

    const key = "LEDGER_CONTRACT_ADDRESS";

    const fileContent = fs.readFileSync(pathToEnv, "utf8");
    const lines = fileContent.split(os.EOL);

    let keyFound = false;
    const updatedLines = lines.map( line => {
        const regex = new RegExp(`^\\s*${key}\\s*=`);

        if(regex.test(line)){
            keyFound = true;
            return `${key}=${ledgerAddress}`;
        }

        return line;
    })

    if(!keyFound){
        updatedLines.push(`${key}=${ledgerAddress}`);
    }

    fs.writeFileSync(pathToEnv, updatedLines.join(os.EOL), 'utf8');
}

async function main() {
    
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const ledgerServiceAddress = deployer.address;
    console.log("Assigned Ledger Service Address:", ledgerServiceAddress);

    
    console.log("\nDeploying MeshToken...");
    const initialSupply = 10000;
    

    //This tells Hardhat to look for your Solidity file named MeshToken, compile it, and create a contract factory. Think of a factory as a blueprint or template in JavaScript that knows how to build your specific smart contract.
    const MeshToken = await hre.ethers.getContractFactory("MeshToken");

    //This takes the blueprint (MeshToken) and sends a transaction to the blockchain telling it to create a brand-new instance of your smart contract. Once this line runs, meshToken becomes a JavaScript contract object. You can use this object later in your script to call functions on your deployed contract.
    const meshToken = await MeshToken.deploy(initialSupply);
    

    //await MeshToken.deploy(...) only waits for the transaction to be signed and broadcasted (sent to the network's mempool). await meshToken.waitForDeployment() waits for the transaction to be mined into a block by the network.
    await meshToken.waitForDeployment();

    //Now that the contract is live, this method queries the blockchain to fetch the unique smart contract address
    const meshTokenAddress = await meshToken.getAddress();
    
    console.log(`MeshToken deployed to: ${meshTokenAddress}`);

    
    console.log("\nDeploying NexusMeshLedger...");
    
    const NexusMeshLedger = await hre.ethers.getContractFactory("NexusMeshLedger");
    const nexusMeshLedger = await NexusMeshLedger.deploy(meshTokenAddress, ledgerServiceAddress);
    
    await nexusMeshLedger.waitForDeployment();
    const ledgerAddress = await nexusMeshLedger.getAddress();
    
    console.log(`NexusMeshLedger deployed to: ${ledgerAddress}`);

    console.log("Deployment Completed Successfully!");

    const newValue = String(ledgerAddress);
    const key = "LEDGER_CONTRACT_ADDRESS";

    const ContractEnvPath = path.resolve(process.cwd(), '.env');

    updateENV(ContractEnvPath, newValue);
    console.log(`Successfully updated ${key} in contract .env`);

    const ledgerEnvPath = path.resolve(process.cwd(), "../Ledger/.env");

    updateENV(ledgerEnvPath, newValue);
    console.log(`successfully updated ${key} in ledger .env`);
        
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });