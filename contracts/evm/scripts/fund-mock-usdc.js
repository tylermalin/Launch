/**
 * Fund a wallet with test MockUSDC on Base Sepolia (permissionless faucet mint).
 *
 * The Sepolia Genesis (0x6056…) takes payment in MockUSDC
 * (0x7a681DfA847A62ECd3BEe5061fF05f1fE812FbdB), whose mint(to,amount) is open.
 *
 * Usage (needs DEPLOYER_PRIVATE_KEY in env + a little Sepolia ETH for gas):
 *   FUND_TO=0xBuyer FUND_AMOUNT=2000 \
 *     npx hardhat run scripts/fund-mock-usdc.js --network baseSepolia
 */
const hre = require('hardhat')

const MOCK_USDC = '0x7a681DfA847A62ECd3BEe5061fF05f1fE812FbdB'
const ABI = [
  'function mint(address to, uint256 amount) public',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
]

async function main() {
  const to = process.env.FUND_TO
  if (!to || !hre.ethers.isAddress(to)) {
    throw new Error('Set FUND_TO=0x… (recipient wallet)')
  }
  const amount = process.env.FUND_AMOUNT || '2000'

  const [signer] = await hre.ethers.getSigners()
  console.log(`Funding from ${signer.address} on ${hre.network.name}`)

  const usdc = new hre.ethers.Contract(MOCK_USDC, ABI, signer)
  const decimals = await usdc.decimals().catch(() => 6)
  const value = hre.ethers.parseUnits(amount, decimals)

  console.log(`Minting ${amount} MockUSDC → ${to} …`)
  const tx = await usdc.mint(to, value)
  console.log('tx:', tx.hash)
  await tx.wait()

  const bal = await usdc.balanceOf(to)
  console.log(`✅ ${to} balance: ${hre.ethers.formatUnits(bal, decimals)} MockUSDC`)
}

main().catch((e) => { console.error(e); process.exit(1) })
