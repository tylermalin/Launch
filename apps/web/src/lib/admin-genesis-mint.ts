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

/**
 * Owner-only mint for card / off-chain settlement (matches GenesisValidator.adminSecureNode).
 */
export async function adminMintToAddress(opts: {
  hexId: string
  recipient: `0x${string}`
}): Promise<{ txHash: `0x${string}`; tokenId: number }> {
  const pk = process.env.GENESIS_ADMIN_PRIVATE_KEY
  if (!pk || !pk.startsWith('0x')) {
    throw new Error('GENESIS_ADMIN_PRIVATE_KEY not configured (contract owner key for adminSecureNode)')
  }
  const rpc = process.env.BASE_SEPOLIA_RPC_URL || process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
  if (!rpc) {
    throw new Error('BASE_SEPOLIA_RPC_URL not configured')
  }

  const account = privateKeyToAccount(pk as `0x${string}`)
  const publicClient = createPublicClient({ chain: baseSepolia, transport: http(rpc) })
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

  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  let tokenId = 1
  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({ abi: MHNL_ABI, ...log })
      if (decoded.eventName === 'NodeSecured') {
        tokenId = Number((decoded.args as { tokenId: bigint }).tokenId)
      }
    } catch {
      /* ignore */
    }
  }

  return { txHash: hash, tokenId }
}
