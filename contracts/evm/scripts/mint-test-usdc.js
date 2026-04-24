const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  const usdc = await ethers.getContractAt("MockUSDC", "0x7a681DfA847A62ECd3BEe5061fF05f1fE812FbdB");
  const amount = 10000n * 1_000_000n; // 10,000 USDC
  const tx = await usdc.mint(signer.address, amount);
  await tx.wait();
  const bal = await usdc.balanceOf(signer.address);
  console.log("Minted 10,000 MockUSDC to", signer.address);
  console.log("New balance:", (bal / 1_000_000n).toString(), "USDC");
  console.log("Tx:", tx.hash);
}

main().catch(e => { console.error(e); process.exit(1); });
