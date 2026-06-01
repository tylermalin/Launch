import {
  createPublicClient,
  createWalletClient,
  decodeEventLog,
  http,
  parseAbi,
} from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
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
  const mnemonic = process.env.TREASURY_MNEMONIC
  const rpc = process.env.BASE_SEPOLIA_RPC_URL || process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
  const isPlaceholderContract = GENESIS_CONTRACT === '0x2222222222222222222222222222222222222222'

  // Dev simulation: if mnemonic, RPC, or real contract address are missing, return a
  // mock result so the full custodial claim flow can be exercised locally.
  if (!mnemonic || !rpc || isPlaceholderContract) {
    const missing = [
      !mnemonic && 'TREASURY_MNEMONIC',
      !rpc && 'BASE_SEPOLIA_RPC_URL',
      isPlaceholderContract && 'NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS',
    ].filter(Boolean).join(', ')
    console.warn(`⚠️  MINT SIMULATED (missing: ${missing}). Set env vars for real minting.`)
    await new Promise(r => setTimeout(r, 1500))
    return {
      txHash: `0xmock_${opts.hexId}_${Date.now()}` as `0x${string}`,
      tokenId: Math.floor(Math.random() * 300) + 1,
    }
  }

  const account = mnemonicToAccount(mnemonic)
  console.log('[admin-mint] signer', account.address)
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
