import { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('Starting deployment...');

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  // Deploy BlockDealToken
  console.log('Deploying BlockDealToken...');
  const BlockDealToken = await ethers.getContractFactory('BlockDealToken');
  const token = await BlockDealToken.deploy();
  await token.deployed();
  console.log('BlockDealToken deployed to:', token.address);

  // Deploy Marketplace
  console.log('Deploying Marketplace...');
  const Marketplace = await ethers.getContractFactory('Marketplace');
  const marketplace = await Marketplace.deploy(token.address);
  await marketplace.deployed();
  console.log('Marketplace deployed to:', marketplace.address);

  // Update environment variables
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent = envContent.replace(
    /NEXT_PUBLIC_TOKEN_ADDRESS=.*/,
    `NEXT_PUBLIC_TOKEN_ADDRESS=${token.address}`
  );
  envContent = envContent.replace(
    /NEXT_PUBLIC_MARKETPLACE_ADDRESS=.*/,
    `NEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplace.address}`
  );

  fs.writeFileSync(envPath, envContent);

  // Write deployment info to a JSON file
  const deploymentInfo = {
    token: {
      address: token.address,
      abi: JSON.parse(token.interface.format('json') as string),
    },
    marketplace: {
      address: marketplace.address,
      abi: JSON.parse(marketplace.interface.format('json') as string),
    },
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  const deploymentPath = path.join(__dirname, '..', 'src', 'contracts', 'deployment.json');
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

  console.log('Deployment completed!');
  console.log('Deployment info written to:', deploymentPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 