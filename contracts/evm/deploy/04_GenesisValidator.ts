import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, get } = deployments
  const { deployer } = await getNamedAccounts()

  console.log(`\n🚀 Deploying GenesisValidator on ${network.name}`)
  console.log(`   Deployer: ${deployer}`)

  // On testnet use MockUSDC, on mainnet use real USDC
  let usdcAddress: string
  if (network.name === 'baseSepolia') {
    const mockUsdc = await get('MockUSDC')
    usdcAddress = mockUsdc.address
    console.log(`   MockUSDC: ${usdcAddress}`)
  } else {
    // Base Mainnet USDC
    usdcAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
  }

  const treasury = process.env.TREASURY_ADDRESS || deployer
  // $2,000 USDC — 6 decimals → 2_000_000_000
  const mintPrice = 2_000_000_000n

  const baseURI = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/nft/`
    : 'https://malamalaunch.vercel.app/api/nft/'

  console.log(`   Treasury:  ${treasury}`)
  console.log(`   MintPrice: ${mintPrice} (= $2,000 USDC)`)
  console.log(`   BaseURI:   ${baseURI}`)

  const result = await deploy('GenesisValidator', {
    from: deployer,
    args: [usdcAddress, treasury, mintPrice, baseURI],
    log: true,
    waitConfirmations: network.name === 'baseSepolia' ? 2 : 5,
  })

  console.log(`\n✅ GenesisValidator deployed: ${result.address}`)
  console.log(`\nAdd to .env.local:`)
  console.log(`NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS=${result.address}`)
  console.log(`NEXT_PUBLIC_MOCK_USDC_ADDRESS=${usdcAddress}`)

  // Verify on Basescan if API key present
  if (process.env.BASESCAN_API_KEY && result.newlyDeployed) {
    try {
      await hre.run('verify:verify', {
        address: result.address,
        constructorArguments: [usdcAddress, treasury, mintPrice, baseURI],
      })
      console.log('✅ Contract verified on Basescan')
    } catch (e: any) {
      console.warn('⚠️  Verification failed (may already be verified):', e.message)
    }
  }
}

func.tags = ['GenesisValidator']
func.dependencies = ['MockUSDC']
export default func
