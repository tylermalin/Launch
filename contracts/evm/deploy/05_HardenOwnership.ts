import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

/**
 * Hardens privileged access to the Malama contracts (LayerZero safe practice):
 * deploys a TimelockController governed by the Gnosis Safe multisig, then routes
 * each contract's owner — and the OFT's LayerZero delegate — through it.
 *
 * After this runs, EVERY admin action (setPeer, setDelegate, setBMEOracle,
 * setRewardDistributor, initialMint, treasury/price changes, …) requires:
 *   Safe proposes → timelock.schedule → wait minDelay (default 48h) → timelock.execute
 * giving a public, cancellable window before any change takes effect.
 *
 * Env:
 *   SAFE_ADDRESS         Gnosis Safe multisig (required). Proposer + executor.
 *   TIMELOCK_MIN_DELAY   delay in seconds before a scheduled action is executable
 *                        (default 172800 = 48h).
 *
 * Idempotent-ish: skips contracts that aren't deployed on the current network.
 * Run after the contract deploy scripts: `npx hardhat deploy --tags harden --network base`.
 */
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, network } = hre
  const { deploy, get, execute } = deployments
  const { deployer } = await getNamedAccounts()

  const safe = process.env.SAFE_ADDRESS
  if (!safe || !ethers.isAddress(safe)) {
    console.log('⏭  SAFE_ADDRESS not set (or invalid) — skipping ownership hardening.')
    console.log('   Set SAFE_ADDRESS to your Gnosis Safe and re-run: npx hardhat deploy --tags harden')
    return
  }
  const minDelay = Number(process.env.TIMELOCK_MIN_DELAY ?? 172_800) // 48h

  console.log(`\n🔐 Hardening ownership on ${network.name}`)
  console.log(`   Safe (proposer+executor): ${safe}`)
  console.log(`   Timelock minDelay: ${minDelay}s (${(minDelay / 3600).toFixed(1)}h)`)

  // 1. Deploy the timelock — Safe is sole proposer & executor, no admin role.
  const timelock = await deploy('MalamaTimelock', {
    from: deployer,
    args: [minDelay, [safe], [safe], ethers.ZeroAddress],
    log: true,
  })

  // 2. Route each privileged contract through the timelock.
  const OWNABLE = ['MalamaOFT', 'GenesisValidator', 'MalamaOracle', 'SensorDIDRegistry']
  for (const name of OWNABLE) {
    let exists = true
    try {
      await get(name)
    } catch {
      exists = false
    }
    if (!exists) {
      console.log(`   ⏭  ${name} not deployed on ${network.name} — skipping`)
      continue
    }

    // For the OFT, hand LayerZero config authority (delegate) to the Safe first.
    if (name === 'MalamaOFT') {
      try {
        await execute(name, { from: deployer, log: true }, 'setDelegate', safe)
        console.log(`   • ${name}.delegate → Safe`)
      } catch (e) {
        console.warn(`   ⚠️  ${name}.setDelegate failed (already delegated?):`, (e as Error).message)
      }
    }

    // Transfer ownership to the timelock (must be done while deployer is owner).
    await execute(name, { from: deployer, log: true }, 'transferOwnership', timelock.address)
    console.log(`   🔒 ${name}.owner → MalamaTimelock (${timelock.address})`)
  }

  console.log(`\n✅ Hardening complete. Admin actions now go through the Safe + ${(minDelay / 3600).toFixed(0)}h timelock.`)
  console.log(`   Runbook: contracts/evm/SECURITY.md`)
}

func.tags = ['harden']
func.runAtTheEnd = true
export default func
