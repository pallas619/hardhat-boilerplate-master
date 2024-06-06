const path = require("path");
const fs = require("fs");

async function main() {
    // ethers dan artifacts tersedia dalam global scope oleh hardhat
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying the contracts with the account:", await deployer.getAddress());

    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();

    console.log("Voting smart contract address:", voting.address);

    // Simpan artifacts dan alamat kontrak di frontend directory
    saveFrontendFiles(voting);
}

function saveFrontendFiles(voting) {
    const contractsDir = path.join(__dirname, "..", "src", "contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        path.join(contractsDir, "contract-address.json"),
        JSON.stringify({ Voting: voting.address }, undefined, 2)
    );

    const VotingArtifact = artifacts.readArtifactSync("Voting");

    fs.writeFileSync(
        path.join(contractsDir, "Voting.json"),
        JSON.stringify(VotingArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
