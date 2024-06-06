async function main() {
  const Healthcare = await ethers.getContractFactory("Healthcare");
  const healthcare = await Healthcare.deploy();

  await healthcare.deployed();
  console.log("Healthcare contract deployed to:", healthcare.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
