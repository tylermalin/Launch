const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // Already deployed — paste from previous run
  const MOCK_USDC       = "0x7a681DfA847A62ECd3BEe5061fF05f1fE812FbdB";
  const SENSOR_REGISTRY = "0xCF29A650A9ca03Bb2B9e440f81dcDdB4c3791734";

  console.log("\n[3/5] MalamaOFT...");
  const OFT = await ethers.getContractFactory("MalamaOFT");
  const lzEndpoint = "0x6EDCE65403992e310A62460808c4b910D972f10f"; // LZ V2 EndpointV2 on Base Sepolia
  const oft = await (await OFT.deploy(lzEndpoint, deployer.address)).waitForDeployment();
  const MALAMA_OFT = await oft.getAddress();
  console.log("  MalamaOFT:", MALAMA_OFT);

  console.log("\n[4/5] MalamaOracle...");
  const Oracle = await ethers.getContractFactory("MalamaOracle");
  const oracle = await (await Oracle.deploy(SENSOR_REGISTRY, deployer.address, MALAMA_OFT)).waitForDeployment();
  const ORACLE = await oracle.getAddress();
  console.log("  MalamaOracle:", ORACLE);

  console.log("\n[5/5] GenesisValidator...");
  const treasury = process.env.TREASURY_ADDRESS || deployer.address;
  const Genesis = await ethers.getContractFactory("GenesisValidator");
  const genesis = await (await Genesis.deploy(MOCK_USDC, treasury, 2000000000n, "https://malamalabs.com/api/nft/")).waitForDeployment();
  const GENESIS = await genesis.getAddress();
  console.log("  GenesisValidator:", GENESIS);

  const out = [
    `NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS=${GENESIS}`,
    `NEXT_PUBLIC_MOCK_USDC_ADDRESS=${MOCK_USDC}`,
    `NEXT_PUBLIC_SENSOR_REGISTRY_ADDRESS=${SENSOR_REGISTRY}`,
    `NEXT_PUBLIC_MALAMA_OFT_ADDRESS=${MALAMA_OFT}`,
    `NEXT_PUBLIC_ORACLE_ADDRESS=${ORACLE}`,
  ].join("\n");

  fs.writeFileSync("deployments-sepolia.env", out);
  console.log("\n✅ All done!\n\n" + out);
}

main().catch(e => { console.error(e); process.exit(1); });
