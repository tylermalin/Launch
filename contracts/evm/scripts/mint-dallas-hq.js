const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  const genesis = await ethers.getContractAt(
    "GenesisValidator",
    "0x6056cE7FA7D4cDD0Ae70E1798764D6E345f902be"
  );

  const hexId = "8726cb912ffffff"; // Dallas HQ: 32.7767, -96.797 (res 7)

  // Check if already claimed
  const claimed = await genesis.isHexClaimed(hexId);
  if (claimed) {
    console.log("Dallas HQ hex already claimed:", hexId);
    return;
  }

  console.log("Minting Dallas HQ node to:", signer.address);
  const tx = await genesis.adminSecureNode(signer.address, hexId);
  const receipt = await tx.wait();
  console.log("✅ Dallas HQ minted!");
  console.log("  Hex:     ", hexId);
  console.log("  Tx:      ", receipt.hash);
  const nowClaimed = await genesis.isHexClaimed(hexId);
  console.log("  Claimed: ", nowClaimed);
}

main().catch(e => { console.error(e); process.exit(1); });
