import { ethers, run } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  // Deploy BlockDealToken
  console.log("Deploying BlockDealToken...");
  const BlockDealToken = await ethers.getContractFactory("BlockDealToken");
  const token = await BlockDealToken.deploy();
  await token.deployed();
  console.log("BlockDealToken deployed to:", token.address);

  // Deploy Marketplace
  console.log("Deploying Marketplace...");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address);

  // Verify contracts on Etherscan
  console.log("Waiting for block confirmations...");
  await token.deployTransaction.wait(5);
  await marketplace.deployTransaction.wait(5);

  console.log("Verifying contracts...");
  try {
    await run("verify:verify", {
      address: token.address,
      constructorArguments: [],
    });
    console.log("BlockDealToken verified");

    await run("verify:verify", {
      address: marketplace.address,
      constructorArguments: [],
    });
    console.log("Marketplace verified");
  } catch (error) {
    console.error("Error verifying contracts:", error);
  }

  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 