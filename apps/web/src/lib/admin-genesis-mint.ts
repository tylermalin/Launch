import {
  createPublicClient,
  createWalletClient,
  decodeEventLog,
  http,
  parseAbi,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

const MHNL_ABI = parseAbi([
  'function adminSecureNode(address to, string calldata hexId) external',
  'event NodeSecured(address indexed operator, uint256 indexed tokenId, string hexId)',
])

const GENESIS_CONTRACT = (process.env.NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS ??
  '0x2222222222222222222222222222222222222222') as `0x${string}`

function getRpc() {
  return process.env.BASE_SEPOLIA_RPC_URL || process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
}

export async function adminMintToAddress(opts: {
  hexId: string
  recipient: `0x${string}`
}): Promise<{ txHash: `0x${string}`; tokenId: number | null }> {
  const ownerKey = process.env.GENESIS_OWNER_PRIVATE_KEY?.trim()
  const rpc = getRpc()
  const isPlaceholderContract = GENESIS_CONTRACT === '0x2222222222222222222222222222222222222222'

  if (process.env.NODE_ENV === 'production') {
    if (!ownerKey || !rpc || isPlaceholderContract) {
      const missing = [
        !ownerKey && 'GENESIS_OWNER_PRIVATE_KEY',
        !rpc && 'BASE_SEPOLIA_RPC_URL',
        isPlaceholderContract && 'NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS',
      ].filter(Boolean).join(', ')
      throw new Error(`CRITICAL: Production minting requires valid configuration but env is missing: ${missing}. Simulation is strictly forbidden.`)
    }
  }

  if (!ownerKey || !rpc || isPlaceholderContract) {
    if (process.env.MINT_SIMULATION !== 'true') {
      const missing = [
        !ownerKey && 'GENESIS_OWNER_PRIVATE_KEY',
        !rpc && 'BASE_SEPOLIA_RPC_URL',
        isPlaceholderContract && 'NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS',
      ].filter(Boolean).join(', ')
      throw new Error(`Mint misconfigured (missing: ${missing}). Set MINT_SIMULATION=true to simulate.`)
    }
    console.warn('MINT SIMULATED (MINT_SIMULATION=true).')
    await new Promise(r => setTimeout(r, 500))
    return {
      txHash: `0xmock_${opts.hexId}_${Date.now()}` as `0x${string}`,
      tokenId: Math.floor(Math.random() * 300) + 1,
    }
  }

  const account = privateKeyToAccount(ownerKey as `0x${string}`)
  console.log('[admin-mint] signer', account.address)
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(rpc),
  })

  const hash = await walletClient.writeContract({
    address: GENESIS_CONTRACT,
    abi: MHNL_ABI,
    functionName: 'adminSecureNode',
    args: [opts.recipient, opts.hexId],
  })

  return { txHash: hash, tokenId: null }
}

export async function resolveTokenIdFromTx(
  hash: `0x${string}`,
): Promise<number | null> {
  const rpc = getRpc()
  if (!rpc || hash.startsWith('0xmock_')) return null
  const publicClient = createPublicClient({ chain: baseSepolia, transport: http(rpc) })
  try {
    const receipt = await publicClient.waitForTransactionReceipt({ hash, timeout: 30_000 })
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({ abi: MHNL_ABI, ...log })
        if (decoded.eventName === 'NodeSecured') {
          return Number((decoded.args as { tokenId: bigint }).tokenId)
        }
      } catch { /* not our event */ }
    }
  } catch {
    return null
  }
  return null
}
