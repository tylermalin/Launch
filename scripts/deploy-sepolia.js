const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  const bal = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(bal), "ETH");
  if (bal === 0n) { console.error("Need Base Sepolia ETH!"); process.exit(1); }

  const addr = {};

  console.log("\n[1/5] MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await (await MockUSDC.deploy()).waitForDeployment();
  addr.MockUSDC = await usdc.getAddress();
  console.log("  MockUSDC:", addr.MockUSDC);

  console.log("\n[2/5] SensorDIDRegistry...");
  const Registry = await ethers.getContractFactory("SensorDIDRegistry");
  const reg = await (await Registry.deploy(deployer.address, deployer.address)).waitForDeployment();
  addr.SensorDIDRegistry = await reg.getAddress();
  console.log("  SensorDIDRegistry:", addr.SensorDIDRegistry);

  console.log("\n[3/5] MalamaOFT...");
  const OFT = await ethers.getContractFactory("MalamaOFT");
  const oft = await (await OFT.deploy("0x6EDCE6540c4aC9B1c0ddb19Ebbd725C2CBF3bE04", deployer.address)).waitForDeployment();
  addr.MalamaOFT = await oft.getAddress();
  console.log("  MalamaOFT:", addr.MalamaOFT);

  console.log("\n[4/5] MalamaOracle...");
  const Oracle = await ethers.getContractFactory("MalamaOracle");
  const oracle = await (await Oracle.deploy(addr.SensorDIDRegistry, deployer.address, addr.MalamaOFT)).waitForDeployment();
  addr.MalamaOracle = await oracle.getAddress();
  console.log("  MalamaOracle:", addr.MalamaOracle);

  console.log("\n[5/5] GenesisValidator...");
  const treasury = process.env.TREASURY_ADDRESS || deployer.address;
  const Genesis = await ethers.getContractFactory("GenesisValidator");
  const genesis = await (await Genesis.deploy(addr.MockUSDC, treasury, 2000000000n, "https://malamalabs.com/api/nft/")).waitForDeployment();
  addr.GenesisValidator = await genesis.getAddress();
  console.log("  GenesisValidator:", addr.GenesisValidator);

  const out = Object.entries(addr).map(([k,v])=>`${k}=${v}`).join("\n");
  fs.writeFileSync("deployments-sepolia.env", out);
  console.log("\n✅ Done!\n" + out);
}

main().catch(e => { console.error(e); process.exit(1); });
