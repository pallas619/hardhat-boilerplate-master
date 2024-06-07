const path = require("path");

async function main() {
    // This is just a convenience check
    if (network.name === "hardhat") {
        console.warn(
            "You are trying to deploy a contract to the Hardhat Network, which" +
            "gets automatically created and destroyed every time. Use the Hardhat" +
            " option '--network localhost'"
        );
    }

    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    const Healthcare = await ethers.getContractFactory("Healthcare");
    const healthcare = await Healthcare.deploy();

    console.log("Healthcare smart contract address:", healthcare.address);

    // We also save the contract's artifacts and address in the frontend directory
    saveFrontendFiles(healthcare);
}

function saveFrontendFiles(healthcare) {
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "src", "contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        path.join(contractsDir, "contract-address.json"),
        JSON.stringify({ Healthcare: healthcare.address }, undefined, 2)
    );

    const HealthcareArtifact = artifacts.readArtifactSync("Healthcare");

    fs.writeFileSync(
        path.join(contractsDir, "Healthcare.json"),
        JSON.stringify(HealthcareArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
