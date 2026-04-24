import * as dotenv from 'dotenv'
import { ethers } from 'hardhat'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config()

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deployer:', deployer.address)

  const bal = await ethers.provider.getBalance(deployer.address)
  console.log('Balance:', ethers.formatEther(bal), 'ETH')

  if (bal === 0n) {
    console.error('ERROR: deployer has 0 ETH. Get Base Sepolia ETH from https://www.coinbase.com/faucets/base-ethereum-goerli-faucet')
    process.exit(1)
  }

  const addresses: Record<string, string> = {}

  // 1 — MockUSDC
  console.log('\n[1/5] Deploying MockUSDC...')
  const MockUSDC = await ethers.getContractFactory('MockUSDC')
  const mockUSDC = await MockUSDC.deploy()
  await mockUSDC.waitForDeployment()
  addresses.MockUSDC = await mockUSDC.getAddress()
  console.log('  MockUSDC:', addresses.MockUSDC)

  // 2 — SensorDIDRegistry
  console.log('\n[2/5] Deploying SensorDIDRegistry...')
  const SensorDIDRegistry = await ethers.getContractFactory('SensorDIDRegistry')
  const registry = await SensorDIDRegistry.deploy(deployer.address, deployer.address)
  await registry.waitForDeployment()
  addresses.SensorDIDRegistry = await registry.getAddress()
  console.log('  SensorDIDRegistry:', addresses.SensorDIDRegistry)

  // 3 — MalamaOFT
  console.log('\n[3/5] Deploying MalamaOFT...')
  const lzEndpointSepolia = '0x6EDCE65403992e310A62460808c4b910D972f10f' // LZ V2 EndpointV2 on Base Sepolia
  const MalamaOFT = await ethers.getContractFactory('MalamaOFT')
  const oft = await MalamaOFT.deploy(lzEndpointSepolia, deployer.address)
  await oft.waitForDeployment()
  addresses.MalamaOFT = await oft.getAddress()
  console.log('  MalamaOFT:', addresses.MalamaOFT)

  // 4 — MalamaOracle
  console.log('\n[4/5] Deploying MalamaOracle...')
  const MalamaOracle = await ethers.getContractFactory('MalamaOracle')
  const oracle = await MalamaOracle.deploy(
    addresses.SensorDIDRegistry,
    deployer.address,
    addresses.MalamaOFT,
  )
  await oracle.waitForDeployment()
  addresses.MalamaOracle = await oracle.getAddress()
  console.log('  MalamaOracle:', addresses.MalamaOracle)

  // 5 — GenesisValidator
  console.log('\n[5/5] Deploying GenesisValidator...')
  const treasury = process.env.TREASURY_ADDRESS || deployer.address
  const mintPrice = 2_000_000_000n // $2,000 USDC (6 decimals)
  const baseURI = `${process.env.NEXT_PUBLIC_APP_URL || 'https://malamalabs.com'}/api/nft/`
  const GenesisValidator = await ethers.getContractFactory('GenesisValidator')
  const genesis = await GenesisValidator.deploy(
    addresses.MockUSDC,
    treasury,
    mintPrice,
    baseURI,
  )
  await genesis.waitForDeployment()
  addresses.GenesisValidator = await genesis.getAddress()
  console.log('  GenesisValidator:', addresses.GenesisValidator)

  // Write results
  const out = [
    '# Base Sepolia deployed addresses — ' + new Date().toISOString(),
    `NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS=${addresses.GenesisValidator}`,
    `NEXT_PUBLIC_MOCK_USDC_ADDRESS=${addresses.MockUSDC}`,
    `NEXT_PUBLIC_SENSOR_REGISTRY_ADDRESS=${addresses.SensorDIDRegistry}`,
    `NEXT_PUBLIC_MALAMA_OFT_ADDRESS=${addresses.MalamaOFT}`,
    `NEXT_PUBLIC_ORACLE_ADDRESS=${addresses.MalamaOracle}`,
  ].join('\n')

  const outPath = path.join(__dirname, '..', 'deployments-sepolia.env')
  fs.writeFileSync(outPath, out)

  console.log('\n✅ All contracts deployed!')
  console.log('\nAdd to apps/web/.env.local:')
  console.log(out)
  console.log(`\n(Also saved to: ${outPath})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
