/**
 * Base USDC payout engine (server-only).
 *
 * Sends partner referral commissions in USDC on Base. Built for the
 * "admin-approved, system-sends" model: the admin approves a batch, this module
 * executes the on-chain transfers from a dedicated hot wallet.
 *
 * SAFETY DEFAULTS — nothing real moves until you opt in:
 *   - Dry-run is ON by default (PAYOUT_DRY_RUN must be explicitly "false").
 *   - Network defaults to Base Sepolia testnet (PAYOUT_NETWORK="base" for mainnet).
 *   - Per-batch USD ceiling enforced by the caller via getPayoutConfig().maxBatchUsd.
 *
 * Env:
 *   PAYOUT_WALLET_PRIVATE_KEY   0x-key of a DEDICATED hot wallet (operating float only,
 *                               NOT a treasury/multisig). Server env only — never commit.
 *   PAYOUT_NETWORK              "base-sepolia" (default) | "base"
 *   BASE_RPC_URL                Base mainnet RPC (default https://mainnet.base.org)
 *   BASE_SEPOLIA_RPC_URL        Base Sepolia RPC (default https://sepolia.base.org)
 *   PAYOUT_DRY_RUN              "false" to send for real; anything else = dry run
 *   PAYOUT_MAX_BATCH_USD        hard ceiling per batch (default 5000)
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  isAddress,
  getAddress,
  parseUnits,
  formatUnits,
  erc20Abi,
  type Hex,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base, baseSepolia } from 'viem/chains'

export type PayoutNetwork = 'base' | 'base-sepolia'

// Canonical USDC token contracts (6 decimals on both).
const USDC_ADDRESS: Record<PayoutNetwork, Hex> = {
  base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  'base-sepolia': '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
}
const USDC_DECIMALS = 6
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export type PayoutConfig = {
  network: PayoutNetwork
  dryRun: boolean
  maxBatchUsd: number
  /** Whether a payout wallet key is configured (does not expose the key). */
  hasWallet: boolean
  usdcAddress: Hex
}

function parseBool(v: string | undefined, dflt: boolean): boolean {
  if (v === undefined) return dflt
  return v.trim().toLowerCase() === 'true'
}

function normalizeKey(raw: string | undefined): Hex | null {
  if (!raw) return null
  const k = raw.trim().replace(/^["']|["']$/g, '')
  if (!k) return null
  return (k.startsWith('0x') ? k : `0x${k}`) as Hex
}

export function getPayoutConfig(): PayoutConfig {
  const network: PayoutNetwork = process.env.PAYOUT_NETWORK?.trim() === 'base' ? 'base' : 'base-sepolia'
  // Dry run defaults TRUE — must be explicitly disabled.
  const dryRun = parseBool(process.env.PAYOUT_DRY_RUN, true)
  const maxBatchUsd = Number.parseFloat(process.env.PAYOUT_MAX_BATCH_USD ?? '5000') || 5000
  return {
    network,
    dryRun,
    maxBatchUsd,
    hasWallet: normalizeKey(process.env.PAYOUT_WALLET_PRIVATE_KEY) !== null,
    usdcAddress: USDC_ADDRESS[network],
  }
}

/** Validate a partner payout address. Rejects malformed and zero addresses. */
export function validatePayoutAddress(
  address: string | undefined | null
): { ok: boolean; checksum?: Hex; reason?: string } {
  if (!address) return { ok: false, reason: 'No wallet address on file' }
  const a = address.trim()
  if (!isAddress(a)) return { ok: false, reason: 'Not a valid EVM address' }
  if (a.toLowerCase() === ZERO_ADDRESS) return { ok: false, reason: 'Zero/placeholder address' }
  return { ok: true, checksum: getAddress(a) }
}

function chainFor(network: PayoutNetwork) {
  return network === 'base' ? base : baseSepolia
}

function rpcFor(network: PayoutNetwork): string {
  if (network === 'base') return process.env.BASE_RPC_URL?.trim() || 'https://mainnet.base.org'
  return process.env.BASE_SEPOLIA_RPC_URL?.trim() || 'https://sepolia.base.org'
}

/** Hot wallet status: address + USDC/ETH balances. null if no key configured. */
export async function getHotWalletStatus(): Promise<
  { address: Hex; network: PayoutNetwork; usdc: number; eth: string } | null
> {
  const key = normalizeKey(process.env.PAYOUT_WALLET_PRIVATE_KEY)
  if (!key) return null
  const { network, usdcAddress } = getPayoutConfig()
  const account = privateKeyToAccount(key)
  const publicClient = createPublicClient({ chain: chainFor(network), transport: http(rpcFor(network)) })

  const [usdcRaw, ethRaw] = await Promise.all([
    publicClient.readContract({
      address: usdcAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account.address],
    }) as Promise<bigint>,
    publicClient.getBalance({ address: account.address }),
  ])

  return {
    address: account.address,
    network,
    usdc: Number.parseFloat(formatUnits(usdcRaw, USDC_DECIMALS)),
    eth: formatUnits(ethRaw, 18),
  }
}

export type SendResult = { txHash: string; dryRun: boolean }

/**
 * Send a single USDC payout. In dry-run mode returns a synthetic marker without
 * touching the chain. Real mode waits for the receipt and throws if it reverts.
 */
export async function sendUsdc(to: string, amountUsd: number): Promise<SendResult> {
  const { network, dryRun, usdcAddress } = getPayoutConfig()

  const v = validatePayoutAddress(to)
  if (!v.ok || !v.checksum) throw new Error(`Invalid payout address: ${v.reason}`)
  if (!(amountUsd > 0)) throw new Error('Payout amount must be > 0')

  if (dryRun) {
    return { txHash: `DRYRUN:${network}:${v.checksum}:${amountUsd}`, dryRun: true }
  }

  const key = normalizeKey(process.env.PAYOUT_WALLET_PRIVATE_KEY)
  if (!key) throw new Error('PAYOUT_WALLET_PRIVATE_KEY not configured (cannot send live)')

  const account = privateKeyToAccount(key)
  const chain = chainFor(network)
  const rpc = rpcFor(network)
  const walletClient = createWalletClient({ account, chain, transport: http(rpc) })
  const publicClient = createPublicClient({ chain, transport: http(rpc) })

  // USDC has 6 decimals; commission amounts are rounded to cents upstream.
  const value = parseUnits(amountUsd.toFixed(USDC_DECIMALS), USDC_DECIMALS)

  const hash = await walletClient.writeContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [v.checksum, value],
  })

  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  if (receipt.status !== 'success') throw new Error(`USDC transfer reverted (tx ${hash})`)

  return { txHash: hash, dryRun: false }
}
