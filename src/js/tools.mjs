import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contractArtifact = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../contracts/Healthcare.json"), "utf8")
);
const contractAddress = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../contracts/contract-address.json"), "utf8")
).Healthcare;

export async function constructSmartContract() {
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractArtifact.abi, signer);
    return contract;
}
