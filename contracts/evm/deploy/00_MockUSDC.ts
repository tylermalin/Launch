import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  if (network.name === 'baseMainnet') {
    log('Skipping MockUSDC on mainnet — real USDC is used instead')
    return
  }

  log('Deploying MockUSDC...')

  const result = await deploy('MockUSDC', {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  })

  log(`MockUSDC deployed at: ${result.address}`)
  log(`Deployer receives 1,000,000 mock USDC for testing`)
}

export default func
func.tags = ['MockUSDC']
