const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
    // Check if ethers is available
    if (typeof hre.ethers === "undefined") {
        throw new Error("ethers is not defined. Make sure you are running this script with Hardhat.");
    }

    // This is just a convenience check
    if (hre.network.name === "hardhat") {
        console.warn(
            "You are trying to deploy a contract to the Hardhat Network, which" +
            " gets automatically created and destroyed every time. Use the Hardhat" +
            " option '--network localhost'"
        );
    }

    // Get the deployer
    const [deployer] = await hre.ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    console.log("Deploying the contracts with the account:", deployerAddress);

    // Get the contract factory and deploy
    const Healthcare = await hre.ethers.getContractFactory("Healthcare");
    const healthcare = await Healthcare.deploy();

    console.log("Healthcare smart contract address:", healthcare.target);

    // Save the contract's artifacts and address in the frontend directory
    saveFrontendFiles(healthcare);
}

function saveFrontendFiles(healthcare) {
    const contractsDir = path.join(__dirname, "..", "src", "contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        path.join(contractsDir, "contract-address.json"),
        JSON.stringify({ Healthcare: healthcare.address }, undefined, 2)
    );

    const HealthcareArtifact = hre.artifacts.readArtifactSync("Healthcare");

    fs.writeFileSync(
        path.join(contractsDir, "Healthcare.json"),
        JSON.stringify(HealthcareArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });
