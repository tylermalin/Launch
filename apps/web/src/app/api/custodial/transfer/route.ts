import { NextResponse } from 'next/server'
import { isAddress } from 'viem'
import { createWalletClient, http, parseAbi } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { getCustodialByClaimId } from '@/lib/custodial-store'
import { decryptPrivateKeyHex } from '@/lib/wallet-crypto'

export const runtime = 'nodejs'

const GENESIS_CONTRACT = (process.env.NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS ??
  '0x2222222222222222222222222222222222222222') as `0x${string}`

const ERC721_ABI = parseAbi([
  'function transferFrom(address from, address to, uint256 tokenId) external',
])

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      claimId?: string
      transferToken?: string
      destination?: string
    }
    const { claimId, transferToken, destination } = body
    if (!claimId || !transferToken || !destination) {
      return NextResponse.json(
        { error: 'claimId, transferToken, and destination are required' },
        { status: 400 }
      )
    }
    if (!isAddress(destination)) {
      return NextResponse.json({ error: 'Invalid destination address' }, { status: 400 })
    }

    const rec = getCustodialByClaimId(claimId)
    if (!rec || rec.transferToken !== transferToken) {
      return NextResponse.json({ error: 'Invalid claim or transfer link' }, { status: 403 })
    }

    const pk = decryptPrivateKeyHex(rec.encryptedPrivateKey)
    const account = privateKeyToAccount(pk)
    if (account.address.toLowerCase() !== rec.address.toLowerCase()) {
      return NextResponse.json({ error: 'Wallet mismatch' }, { status: 500 })
    }

    const rpc = process.env.BASE_SEPOLIA_RPC_URL || process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
    if (!rpc) {
      return NextResponse.json({ error: 'RPC not configured' }, { status: 503 })
    }

    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(rpc),
    })

    const hash = await walletClient.writeContract({
      address: GENESIS_CONTRACT,
      abi: ERC721_ABI,
      functionName: 'transferFrom',
      args: [rec.address, destination as `0x${string}`, BigInt(rec.evmTokenId)],
    })

    return NextResponse.json({
      success: true,
      txHash: hash,
      explorerUrl: `https://sepolia.basescan.org/tx/${hash}`,
    })
  } catch (e) {
    console.error('[custodial/transfer]', e)
    const msg = e instanceof Error ? e.message : 'Transfer failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
