'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet as useCardanoWallet } from '@meshsdk/react'
import {
  useAccount as useEVMWallet,
  useConnect as useEVMConnect,
  useDisconnect as useEVMDisconnect,
  useWriteContract,
  usePublicClient,
} from 'wagmi'
import { injected } from 'wagmi/connectors'
import { parseAbi, parseUnits, decodeEventLog } from 'viem'
import {
  MapPin, ShoppingCart, Wallet, Globe,
  ChevronRight, CheckCircle2, AlertCircle, ExternalLink, Copy,
  CreditCard,
} from 'lucide-react'
import Link from 'next/link'
import {
  PurchaseLegalAcknowledgement,
  LegalMintReminder,
  initialLegalAck,
  allLegalAcknowledged,
} from '@/components/legal/PurchaseLegalAcknowledgement'

// ─── Contract addresses ───────────────────────────────────────────────────────
const GENESIS_CONTRACT = (process.env.NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS ?? '0x2222222222222222222222222222222222222222') as `0x${string}`
const USDC_CONTRACT    = (process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS         ?? '0x1111111111111111111111111111111111111111') as `0x${string}`
const PRICE_USDC       = parseUnits('2000', 6) // $2,000 USDC (6 decimals)

const USDC_ABI = parseAbi([
  'function approve(address spender, uint256 amount) public returns (bool)',
])
const MHNL_ABI = parseAbi([
  'function secureNode(string calldata hexId) external',
  'event NodeSecured(address indexed operator, uint256 indexed tokenId, string hexId)',
])

// ─── Types ───────────────────────────────────────────────────────────────────
interface SuccessData {
  /** Canonical reservation id — e.g. G200-042 */
  claimId: string
  /** 1–200 (matches claim sequence) */
  editionNumber: number
  /** Base ERC-721 token id (on-chain); Cardano omits */
  evmTokenId?: number
  txHash: string
  chain: 'base' | 'cardano'
  explorerUrl: string
  nftImageUrl: string
  openSeaUrl?: string
  cnftUrl?: string
  tokenName?: string
  /** True when mint env vars were missing and a mock result was returned */
  simulated?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const shortHash = (h: string) => `${h.slice(0, 8)}...${h.slice(-6)}`

function NftCard({ data, hexId }: { data: SuccessData; hexId: string | null }) {
  return (
    <div className="relative w-56 h-80 mx-auto rounded-2xl overflow-hidden border border-malama-accent/30 shadow-[0_0_40px_rgba(196,240,97,0.2)]">
      <img
        src={data.nftImageUrl}
        alt={`Mālama Hex Node License ${data.claimId}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if image fails
          (e.target as HTMLImageElement).src = '/hardware-exploded.png'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-malama-accent font-black text-2xl">{data.claimId}</p>
        <p className="text-gray-300 text-xs font-mono truncate">{hexId}</p>
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function GenesisMint({ hexId }: { hexId: string | null }) {
  const [step, setStep] = useState(1)
  const [preferredChain, setPreferredChain] = useState<'base' | 'cardano'>('base')
  const [loading, setLoading]       = useState(false)
  const [evmTxStatus, setEvmTxStatus] = useState<'' | 'claiming' | 'approving' | 'minting'>('')
  const [error, setError]           = useState('')
  const [successData, setSuccessData] = useState<SuccessData | null>(null)
  const [copied, setCopied]         = useState(false)
  const [legalAck, setLegalAck]     = useState(initialLegalAck)
  const [paymentMode, setPaymentMode] = useState<'crypto' | 'card'>('crypto')
  const [cardEmail, setCardEmail]   = useState('')
  const [mmImportOpen, setMmImportOpen] = useState(false)
  const [mmCopied, setMmCopied]     = useState<'address' | 'tokenId' | null>(null)

  const legalComplete = allLegalAcknowledged(legalAck)

  const cardEmailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cardEmail.trim())

  // ── Wallet hooks ────────────────────────────────────────────────────────
  const { connected: cardanoConnected, wallet: cardanoWallet, name: cardanoWalletName, connect: connectCardano } = useCardanoWallet()
  const [cardanoWallets, setCardanoWallets] = useState<{ name: string; icon: string }[]>([])
  const [showCardanoPicker, setShowCardanoPicker] = useState(false)
  // Raw CIP-30 API object — stored after window.cardano[name].enable() succeeds.
  // Used for signData() calls (triggers Lace signing popup) without going through MeshSDK.
  const [cardanoCip30Api, setCardanoCip30Api] = useState<{
    getChangeAddress: () => Promise<string>
    signData: (address: string, payload: string) => Promise<{ signature: string; key: string }>
  } | null>(null)
  const { address: evmAddress, isConnected: evmConnected } = useEVMWallet()
  const { connect: connectEVM }    = useEVMConnect()
  const { disconnect: disconnectEVM } = useEVMDisconnect()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const activeChain      = evmConnected ? 'base' : cardanoConnected ? 'cardano' : preferredChain
  const cardanoReady     = cardanoConnected || !!cardanoCip30Api
  const isSetupComplete =
    !!hexId &&
    (paymentMode === 'card' ? cardEmailOk : cardanoReady || evmConnected)
  const appBase          = process.env.NEXT_PUBLIC_APP_URL ?? 'https://malamalaunch.vercel.app'

  // ── Sync local purchased map ─────────────────────────────────────────────
  const syncNodeToMap = (id: string | null) => {
    if (!id) return
    const prev = JSON.parse(localStorage.getItem('malamalabs_purchased_nodes') ?? '[]')
    if (!prev.includes(id)) {
      localStorage.setItem('malamalabs_purchased_nodes', JSON.stringify([...prev, id]))
    }
  }

  // ── Copy helper ──────────────────────────────────────────────────────────
  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Direct CIP-30 connect — triggers Lace's "Connect this dApp?" popup ──
  const connectCardanoWallet = async (walletKey: string) => {
    const win = window as typeof window & {
      cardano?: Record<string, { name?: string; icon?: string; enable: () => Promise<any> }>
    }
    const api = await win.cardano![walletKey].enable()
    setCardanoCip30Api(api)
    // Also connect via MeshSDK so cardanoWallet/cardanoConnected state updates
    await connectCardano(walletKey).catch(() => {
      // MeshSDK may warn internally but the raw API is already stored
    })
  }

  // ── Add NFT to MetaMask ──────────────────────────────────────────────────
  const copyMm = (text: string, field: 'address' | 'tokenId') => {
    navigator.clipboard.writeText(text).then(() => {
      setMmCopied(field)
      setTimeout(() => setMmCopied(null), 2000)
    })
  }

  const addToMetaMask = async (evmTokenId: number) => {
    const eth = (window as any).ethereum
    // Always open the manual panel so the user can copy values regardless
    setMmImportOpen(true)

    if (!eth) return // panel is open; user reads contract + tokenId manually

    try {
      // Switch to Base Sepolia first
      const chainId: string = await eth.request({ method: 'eth_chainId' })
      if (chainId !== '0x14a34') {
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x14a34' }],
        }).catch(async (switchErr: any) => {
          if (switchErr.code === 4902) {
            await eth.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x14a34',
                chainName: 'Base Sepolia',
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://sepolia.base.org'],
                blockExplorerUrls: ['https://sepolia.basescan.org'],
              }],
            })
          }
        })
      }
      // wallet_watchAsset pops MetaMask's "Import NFT" dialog
      await eth.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address: GENESIS_CONTRACT,
            tokenId: String(evmTokenId),
          },
        },
      })
    } catch (e) {
      console.warn('wallet_watchAsset failed — manual import panel open', e)
    }
  }

  // ── Base payment flow ────────────────────────────────────────────────────
  const handleBasePayment = async () => {
    if (!publicClient || !evmAddress || !hexId) throw new Error('Wallet or hex not ready')

    // 1. Reserve in global claim registry
    setEvmTxStatus('claiming')
    const claimRes = await fetch('/api/nft/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hexId, chain: 'base', buyerAddress: evmAddress }),
    })
    const claimData = await claimRes.json()
    if (!claimRes.ok) throw new Error(claimData.error ?? 'Hex already claimed on another chain')
    const { claimId, editionNumber } = claimData as { claimId: string; editionNumber: number }

    // 2. USDC approve
    setEvmTxStatus('approving')
    let approveHash: `0x${string}`
    try {
      approveHash = await writeContractAsync({
        address: USDC_CONTRACT,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [GENESIS_CONTRACT, PRICE_USDC],
      })
    } catch (e: any) {
      throw new Error('USDC approval rejected — please approve in your wallet')
    }
    await publicClient.waitForTransactionReceipt({ hash: approveHash })

    // 3. Mint NFT
    setEvmTxStatus('minting')
    let mintHash: `0x${string}`
    try {
      mintHash = await writeContractAsync({
        address: GENESIS_CONTRACT,
        abi: MHNL_ABI,
        functionName: 'secureNode',
        args: [hexId],
      })
    } catch (e: any) {
      throw new Error('Mint transaction rejected or hex already taken on-chain')
    }
    const receipt = await publicClient.waitForTransactionReceipt({ hash: mintHash })

    // 4. Extract tokenId from NodeSecured event
    let evmTokenId = editionNumber
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({ abi: MHNL_ABI, ...log })
        if (decoded.eventName === 'NodeSecured') {
          evmTokenId = Number((decoded.args as any).tokenId)
        }
      } catch {}
    }

    // 5. Bind on-chain token to claimId for metadata / image resolution
    await fetch('/api/nft/claim', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimId, hexId, txHash: mintHash, tokenId: evmTokenId }),
    }).catch(() => {})

    syncNodeToMap(hexId)

    return {
      claimId,
      editionNumber,
      evmTokenId,
      txHash: mintHash,
      chain: 'base' as const,
      explorerUrl: `https://sepolia.basescan.org/tx/${mintHash}`,
      openSeaUrl: `https://testnets.opensea.io/assets/base-sepolia/${GENESIS_CONTRACT}/${evmTokenId}`,
      nftImageUrl: `${appBase}/api/nft/${evmTokenId}/image?hexId=${encodeURIComponent(hexId)}&chain=base&claimId=${encodeURIComponent(claimId)}`,
    }
  }

  // ── Cardano payment flow ─────────────────────────────────────────────────
  const handleCardanoPayment = async () => {
    if (!hexId) throw new Error('No hex selected')
    if (!cardanoWallet && !cardanoCip30Api) throw new Error('Cardano wallet not connected')

    // Prefer MeshSDK wallet for address (handles CBOR decoding), fall back to raw CIP-30
    const cardanoAddress = cardanoWallet
      ? await cardanoWallet.getChangeAddress()
      : await cardanoCip30Api!.getChangeAddress()

    // 1. Reserve in global claim registry (prevents Base from stealing same hex)
    const claimRes = await fetch('/api/nft/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hexId, chain: 'cardano', buyerAddress: cardanoAddress }),
    })
    const claimData = await claimRes.json()
    if (!claimRes.ok) throw new Error(claimData.error ?? 'Hex already claimed on another chain')
    const { claimId, editionNumber } = claimData as { claimId: string; editionNumber: number }

    // 2. CIP-8 message signing — pops Lace's signing dialog so the user
    //    explicitly authorises the mint against their address.
    if (cardanoCip30Api) {
      const message = `Malama Labs: Authorise Genesis Node mint\nHex: ${hexId}\nClaim: ${claimId}`
      const payloadHex = Array.from(new TextEncoder().encode(message))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      try {
        await cardanoCip30Api.signData(cardanoAddress, payloadHex)
      } catch (err: any) {
        // CIP-30 error code 2 = user declined
        if (err?.code === 2 || err?.message?.toLowerCase().includes('declined')) {
          throw new Error('Signing cancelled in Lace — mint aborted')
        }
        // Other errors (e.g. ProofGeneration) — log but allow mint to proceed
        console.warn('[CIP-8 signData]', err)
      }
    }

    // 3. Server-side treasury mint (treasury pays ADA fees, sends NFT to user)
    const mintRes = await fetch('/api/nft/mint-cardano', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hexId, cardanoAddress, claimId }),
    })
    const mintData = await mintRes.json()
    if (!mintRes.ok) throw new Error(mintData.error ?? 'Cardano mint failed')

    syncNodeToMap(hexId)

    return {
      claimId,
      editionNumber,
      txHash: mintData.txHash,
      chain: 'cardano' as const,
      explorerUrl: mintData.explorerUrl,
      cnftUrl: mintData.cnftUrl,
      tokenName: mintData.tokenName,
      nftImageUrl: `${appBase}/api/nft/${editionNumber}/image?hexId=${encodeURIComponent(hexId)}&chain=cardano&claimId=${encodeURIComponent(claimId)}`,
      simulated: mintData.simulated,
    }
  }

  const handleCardCheckout = async () => {
    if (!hexId || !cardEmailOk) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hexId, email: cardEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not start card checkout')
      if (data.url) {
        window.location.href = data.url as string
        return
      }
      throw new Error('No checkout URL returned')
    } catch (err: any) {
      setError(err.message ?? 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Main payment dispatcher ───────────────────────────────────────────────
  const handlePayment = async () => {
    setLoading(true)
    setError('')
    try {
      const result = evmConnected
        ? await handleBasePayment()
        : await handleCardanoPayment()
      setSuccessData(result)
      setStep(5)
    } catch (err: any) {
      setError(err.message ?? 'Payment failed — please try again')
    } finally {
      setLoading(false)
      setEvmTxStatus('')
    }
  }

  const submitLabel = () => {
    if (paymentMode === 'card') {
      if (!loading) return 'Pay $2,000 with card (Stripe)'
      return 'Redirecting to secure checkout…'
    }
    if (!loading) return `Confirm & Mint on ${evmConnected ? 'Base' : 'Cardano'}`
    if (evmTxStatus === 'claiming')  return '1/3 Reserving hex globally…'
    if (evmTxStatus === 'approving') return '2/3 Approving USDC…'
    if (evmTxStatus === 'minting')   return '3/3 Minting your NFT…'
    return 'Processing…'
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-4xl mx-auto bg-malama-card border border-gray-800 rounded-3xl shadow-2xl overflow-hidden my-12">
      {/* Progress: 1 Locate HEX · 2 Crypto/Card · 3 Review · 4 Pay · 5 Done */}
      <div className="flex border-b border-gray-800 bg-gray-900/50">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`flex-1 h-2 transition-colors duration-300 ${s <= step ? 'bg-malama-accent' : 'bg-transparent'}`} />
        ))}
      </div>

      <div className="p-8 md:p-12 min-h-[500px] relative flex flex-col justify-center text-left">
        <AnimatePresence mode="wait">

          {/* ─── Step 1: Locate HEX ────────────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="mb-10 text-center">
                <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-malama-accent">Step 1</p>
                <h2 className="flex flex-wrap items-center justify-center gap-2 text-4xl font-black text-white">
                  <MapPin className="h-10 w-10 shrink-0 text-malama-accent" />
                  Locate your HEX
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-400">
                  Choose one of the 400 Genesis hex territories on the live map — 200 on Base, 200 on Cardano. You need a hex selected before you can
                  pay with crypto or card.
                </p>
              </div>

              <div
                className={`mx-auto grid max-w-xl gap-4 rounded-2xl border p-8 text-center transition-all ${
                  hexId ? 'border-amber-500/40 bg-amber-500/10' : 'border-gray-800 bg-malama-deep'
                }`}
              >
                <div className="flex justify-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full ${hexId ? 'bg-amber-500/20' : 'bg-gray-800'}`}>
                    <MapPin className={`h-8 w-8 ${hexId ? 'text-amber-400' : 'text-gray-500'}`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Selected hex</h3>
                  <p className={`mt-2 break-all font-mono text-sm ${hexId ? 'text-amber-400' : 'text-gray-500'}`}>
                    {hexId ?? 'None yet — open the map to pick a territory'}
                  </p>
                </div>
                <Link
                  href="/map"
                  className={`flex w-full items-center justify-center rounded-xl px-4 py-3 text-xs font-black transition-all ${
                    hexId
                      ? 'border border-amber-500/50 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-amber-500 text-black shadow-lg hover:scale-[1.02]'
                  }`}
                >
                  {hexId ? 'Change hex on map →' : 'Open map to choose hex →'}
                </Link>
              </div>

              <div className="flex flex-col items-center pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!hexId}
                  className={`w-full max-w-lg rounded-2xl py-5 text-xl font-black shadow-xl transition-all ${
                    hexId
                      ? 'bg-malama-accent text-black shadow-malama-accent/30 hover:scale-[1.02]'
                      : 'cursor-not-allowed bg-gray-800 text-gray-600 opacity-50'
                  }`}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── Step 2: Pay with crypto or card ─────────────────────────── */}
          {step === 2 && (
            <motion.div key="step2-setup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="mb-10 text-center">
                <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-malama-accent">Step 2</p>
                <h2 className="flex flex-wrap items-center justify-center gap-2 text-4xl font-black text-white">
                  <CreditCard className="h-9 w-9 shrink-0 text-malama-accent" />
                  Pay with crypto or card
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-400">
                  Crypto: connect Cardano (Lace) and/or Base (MetaMask). Card: pay with Stripe, then open Launch App and
                  sign in with Magic using the same email — your NFT mints to your embedded wallet on Base Sepolia.
                  Entry is $2,000 USDC or card checkout.
                </p>
                {hexId && (
                  <p className="text-malama-accent/90 mt-2 font-mono text-sm">
                    Hex: <span className="text-malama-accent">{hexId}</span>
                  </p>
                )}
              </div>

              <div className="mx-auto mb-8 flex max-w-2xl flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setPaymentMode('crypto')}
                  className={`flex-1 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all ${
                    paymentMode === 'crypto'
                      ? 'bg-malama-accent/10 border-malama-accent text-malama-accent shadow-[0_0_20px_rgba(196,240,97,0.15)]'
                      : 'bg-gray-900/80 border-gray-800 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  Crypto wallet
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('card')}
                  className={`flex-1 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all inline-flex items-center justify-center gap-2 ${
                    paymentMode === 'card'
                      ? 'bg-malama-accent/10 border-malama-accent text-malama-accent shadow-[0_0_20px_rgba(196,240,97,0.15)]'
                      : 'bg-gray-900/80 border-gray-800 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Card (Magic wallet)
                </button>
              </div>

              {paymentMode === 'card' ? (
                <div className="mx-auto max-w-xl space-y-6">
                  <p className="text-center text-sm leading-relaxed text-gray-500">
                    After checkout, your Genesis NFT is minted on Base to a new wallet we generate for you.
                    You&apos;ll receive a private transfer link — treat it like a password — to send the NFT to
                    MetaMask or another address when you want.
                  </p>
                  <label className="block text-left">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                      Email (receipt and wallet access)
                    </span>
                    <input
                      type="email"
                      autoComplete="email"
                      value={cardEmail}
                      onChange={(e) => setCardEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-xl border border-gray-800 bg-black/40 px-4 py-3 text-white placeholder:text-gray-600 focus:border-malama-accent focus:outline-none"
                    />
                  </label>
                </div>
              ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Cardano wallet */}
                <div className={`p-6 border rounded-2xl flex flex-col items-center text-center space-y-4 transition-all ${cardanoReady ? 'bg-malama-accent/10 border-malama-accent/40 shadow-[0_0_20px_rgba(196,240,97,0.1)]' : evmConnected ? 'bg-gray-900 border-gray-800 opacity-50' : 'bg-malama-deep border-gray-800 hover:border-gray-700'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cardanoReady ? 'bg-malama-accent/20' : 'bg-gray-800'}`}>
                    <Wallet className={`w-7 h-7 ${cardanoReady ? 'text-malama-accent' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">Cardano NFT</h3>
                    <p className={`text-sm mt-1 font-mono ${cardanoReady ? 'text-malama-accent' : 'text-gray-500'}`}>
                      {cardanoReady ? (cardanoWalletName?.toUpperCase() ?? 'LACE CONNECTED') : 'DISCONNECTED'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">CIP-25 Token · Lace signs</p>
                  </div>
                  {cardanoReady ? (
                    <div className="w-full py-2 bg-malama-accent/20 border border-malama-accent/50 text-malama-accent rounded-lg font-bold text-xs text-center">
                      ✓ READY TO MINT
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <button
                        onClick={async () => {
                          const win = window as typeof window & {
                            cardano?: Record<string, { name?: string; icon?: string; enable: () => Promise<any> }>
                          }
                          const detected = Object.entries(win.cardano ?? {}).map(([key, w]) => ({
                            name: key,
                            icon: w.icon ?? '',
                          }))
                          if (detected.length === 0) {
                            setCardanoWallets([])
                            setShowCardanoPicker(true)
                          } else if (detected.length === 1) {
                            await connectCardanoWallet(detected[0].name)
                          } else {
                            setCardanoWallets(detected)
                            setShowCardanoPicker(true)
                          }
                        }}
                        className="w-full py-2 bg-malama-accent/10 border border-malama-accent/40 text-malama-accent rounded-lg font-bold text-xs hover:bg-malama-accent/20 transition-colors"
                      >
                        Connect Lace / Cardano
                      </button>
                      {showCardanoPicker && cardanoWallets.length > 0 && (
                        <div className="absolute bottom-full mb-2 left-0 w-full bg-gray-900 border border-gray-700 rounded-xl overflow-hidden z-50 shadow-xl">
                          {cardanoWallets.map((w) => (
                            <button
                              key={w.name}
                              onClick={async () => {
                                setShowCardanoPicker(false)
                                await connectCardanoWallet(w.name)
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-800 transition-colors text-left"
                            >
                              {w.icon && <img src={w.icon} alt={w.name} className="w-5 h-5 rounded" />}
                              <span className="text-white text-xs font-bold uppercase tracking-wider">{w.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {showCardanoPicker && cardanoWallets.length === 0 && (
                        <div className="absolute bottom-full mb-2 left-0 w-full bg-gray-900 border border-gray-700 rounded-xl p-4 z-50 shadow-xl text-center">
                          <p className="text-gray-400 text-xs">No Cardano wallet detected.<br />Install Lace or Eternl.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Base wallet */}
                <div className={`p-6 border rounded-2xl flex flex-col items-center text-center space-y-4 transition-all ${evmConnected ? 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : cardanoConnected ? 'bg-gray-900 border-gray-800 opacity-50' : 'bg-malama-deep border-gray-800 hover:border-gray-700'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${evmConnected ? 'bg-blue-500/20' : 'bg-gray-800'}`}>
                    <Globe className={`w-7 h-7 ${evmConnected ? 'text-blue-400' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">Base L2 NFT</h3>
                    <p className={`text-sm mt-1 font-mono ${evmConnected ? 'text-blue-400' : 'text-gray-500'}`}>
                      {evmConnected ? `${evmAddress?.slice(0, 6)}…${evmAddress?.slice(-4)}` : 'DISCONNECTED'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">ERC-721 Token</p>
                  </div>
                  {evmConnected ? (
                    <button onClick={() => disconnectEVM()} className="w-full py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg font-bold text-xs hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40 transition-colors">
                      {evmAddress?.slice(0, 6)}…{evmAddress?.slice(-4)}
                    </button>
                  ) : (
                    <button
                      disabled={cardanoConnected}
                      onClick={() => connectEVM({ connector: injected() })}
                      className={`px-4 py-3 rounded-xl text-xs font-black transition-all shadow-lg w-full ${cardanoConnected ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                      {cardanoConnected ? 'Cardano Active' : 'Connect MetaMask / CB'}
                    </button>
                  )}
                </div>
              </div>
              )}

              <div className="flex flex-col items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-bold text-gray-500 hover:text-gray-300"
                >
                  ← Back to locate HEX
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!isSetupComplete}
                  className={`w-full max-w-lg rounded-2xl py-5 text-xl font-black shadow-xl transition-all ${
                    isSetupComplete
                      ? 'bg-malama-accent text-black shadow-malama-accent/30 hover:scale-[1.02]'
                      : 'cursor-not-allowed bg-gray-800 text-gray-600 opacity-50'
                  }`}
                >
                  Complete setup to continue
                </button>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                  Mālama Genesis · 400 Total · 200 Base / 200 Cardano · One mint per hex
                </p>
              </div>
            </motion.div>
          )}

          {/* ─── Step 3: Review ────────────────────────────────────────────── */}
          {step === 3 && (
            <motion.div key="step3-review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-3xl font-black text-white flex items-center">
                  <ShoppingCart className="mr-3 text-malama-accent w-8 h-8" /> Order Review
                </h2>
                <span
                  className={`px-3 py-1.5 font-bold text-xs rounded-full border ${
                    paymentMode === 'card'
                      ? 'bg-violet-500/10 text-violet-300 border-violet-500/30'
                      : evmConnected
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-malama-accent/10 text-malama-accent border-malama-accent/30'
                  }`}
                >
                  {paymentMode === 'card'
                    ? 'CARD → CUSTODIAL BASE NFT'
                    : evmConnected
                      ? '⬡ BASE L2  ERC-721'
                      : '₳ CARDANO  CIP-25'}
                </span>
              </div>

              <div className="bg-malama-deep rounded-2xl border border-gray-800 overflow-hidden shadow-inner">
                <div className="p-6 border-b border-gray-800 flex justify-between items-start gap-4">
                  <div>
                    <div className="font-bold text-white text-lg">Mālama Hex Node License NFT</div>
                    <p className="text-sm text-gray-500 mt-1">Hardware + exclusive geographic license + 62,500 MLMA allocation + 12mo support</p>
                    <p className="text-xs text-gray-600 mt-2 font-mono">Hex: {hexId}</p>
                    {paymentMode === 'card' && (
                      <p className="text-xs text-violet-400/90 mt-2 font-mono">Email: {cardEmail.trim()}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono text-white font-bold text-lg">$2,000</div>
                    <div className="text-xs text-gray-500 mt-1">{paymentMode === 'card' ? 'USD' : 'USDC'}</div>
                  </div>
                </div>
                <div className="p-6 bg-gray-900/60 flex justify-between items-center">
                  <span className="font-black text-white text-xl">Total Due</span>
                  <span className="font-mono font-black text-malama-accent text-3xl drop-shadow-[0_0_10px_rgba(196,240,97,0.3)]">
                    {paymentMode === 'card' ? '$2,000 USD (Stripe)' : '$2,000 USDC'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'MLMA Allocation', value: '62.5K', sub: '25% at boot · 75% vested' },
                  {
                    label: 'Chain',
                    value: paymentMode === 'card' ? 'Base L2' : evmConnected ? 'Base L2' : 'Cardano',
                    sub:
                      paymentMode === 'card'
                        ? 'Custodial ERC-721 → you transfer'
                        : evmConnected
                          ? 'ERC-721 NFT'
                          : 'CIP-25 Token',
                  },
                  { label: 'Revenue Start', value: 'Oct 2026', sub: 'Hardware ships Sept' },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="p-4 border border-gray-800 rounded-2xl bg-malama-deep">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{label}</p>
                    <p className="text-xl font-black text-malama-accent mt-1">{value}</p>
                    <p className="text-xs text-gray-600 mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              <PurchaseLegalAcknowledgement value={legalAck} onChange={setLegalAck} />

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-5 bg-gray-900 border border-gray-800 text-gray-400 rounded-2xl font-black text-lg hover:bg-gray-800 transition-colors">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!legalComplete}
                  className={`flex-[2] py-5 rounded-2xl font-black text-xl transition-transform shadow-2xl ${
                    legalComplete
                      ? `${
                          paymentMode === 'card'
                            ? 'bg-violet-600 text-white hover:scale-[1.02] shadow-violet-500/20'
                            : evmConnected
                              ? 'bg-blue-600 text-white hover:scale-[1.02] shadow-blue-500/20'
                              : 'bg-malama-accent text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(196,240,97,0.15)]'
                        }`
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                  }`}
                >
                  Confirm Order <ChevronRight className="inline w-6 h-6 ml-1" />
                </button>
              </div>
              {!legalComplete && (
                <p className="text-center text-xs text-amber-500/90">Accept all legal documents above to continue.</p>
              )}
            </motion.div>
          )}

          {/* ─── Step 4: Payment ────────────────────────────────────────────── */}
          {step === 4 && (
            <motion.div key="step4-pay" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex flex-col items-center justify-center text-center">
              {/* Chain visual */}
              <div
                className={`w-28 h-28 rounded-full flex items-center justify-center border-2 shadow-2xl ${
                  paymentMode === 'card'
                    ? 'bg-violet-500/10 border-violet-500/40 shadow-violet-500/20'
                    : evmConnected
                      ? 'bg-blue-500/10 border-blue-500/40 shadow-blue-500/20'
                      : 'bg-malama-accent/10 border-malama-accent/40 shadow-[0_0_20px_rgba(196,240,97,0.15)]'
                }`}
              >
                {paymentMode === 'card' ? (
                  <CreditCard className="w-14 h-14 text-violet-300" />
                ) : evmConnected ? (
                  <Globe className="w-14 h-14 text-blue-400" />
                ) : (
                  <Wallet className="w-14 h-14 text-malama-accent" />
                )}
              </div>

              <div>
                <h2 className="text-4xl font-black text-white">
                  {paymentMode === 'card' ? 'Pay with card' : 'Mint Your NFT'}
                </h2>
                <p className="text-gray-400 mt-3 max-w-md mx-auto leading-relaxed">
                  {paymentMode === 'card'
                    ? 'You will be redirected to Stripe Checkout. After payment clears, open Launch App, sign in with Magic (same email), and we mint your Genesis NFT to your embedded wallet on Base Sepolia.'
                    : evmConnected
                      ? 'Your wallet will prompt you to approve $2,000 USDC and then sign the mint transaction on Base.'
                      : 'The server will mint your Cardano CIP-25 NFT directly to your wallet. No gas required from you.'}
                </p>
              </div>

              {/* Progress indicators when loading */}
              {loading && paymentMode !== 'card' && (
                <div className="flex items-center gap-3 text-sm">
                  {(['claiming', 'approving', 'minting'] as const).map((s, i) => (
                    <React.Fragment key={s}>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${evmTxStatus === s ? 'bg-malama-accent/20 border-malama-accent/50 text-malama-accent animate-pulse' : ['claiming', 'approving', 'minting'].indexOf(evmTxStatus as any) > i ? 'bg-malama-accent/15 border-malama-accent/40 text-malama-accent-dim' : 'bg-gray-900 border-gray-800 text-gray-600'}`}>
                        {['claiming', 'approving', 'minting'].indexOf(evmTxStatus as any) > i ? '✓' : i + 1}
                        {' '}{s === 'claiming' ? 'Reserve' : s === 'approving' ? 'Approve' : 'Mint'}
                      </div>
                      {i < 2 && <span className="text-gray-700">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-xl text-red-400 flex items-start gap-3 w-full max-w-lg text-sm text-left">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <LegalMintReminder />

              <div className="flex flex-col w-full max-w-lg gap-3">
                <button
                  onClick={paymentMode === 'card' ? handleCardCheckout : handlePayment}
                  disabled={loading || !legalComplete || (paymentMode === 'card' && !cardEmailOk)}
                  className={`w-full py-5 text-white rounded-2xl font-black text-xl transition-all shadow-2xl ${
                    loading || !legalComplete || (paymentMode === 'card' && !cardEmailOk)
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      : paymentMode === 'card'
                        ? 'bg-violet-600 hover:bg-violet-500 shadow-violet-500/25 hover:scale-[1.02]'
                        : evmConnected
                          ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 hover:scale-[1.02]'
                          : 'bg-malama-accent text-black hover:bg-malama-accent-dim shadow-[0_0_20px_rgba(196,240,97,0.15)] hover:scale-[1.02]'
                  }`}
                >
                  {loading && <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 align-middle" />}
                  {submitLabel()}
                </button>
                <button
                  disabled={loading}
                  onClick={() => { setError(''); setStep(3) }}
                  className="w-full py-3 text-gray-500 hover:text-gray-300 transition-colors font-bold text-sm"
                >
                  ← Back to Review
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── Step 4: Success ────────────────────────────────────────────── */}
          {step === 5 && successData && (
            <motion.div key="step5-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 flex flex-col items-center text-center pt-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring' }}>
                <CheckCircle2 className="w-20 h-20 text-malama-accent drop-shadow-[0_0_30px_rgba(196,240,97,0.5)]" />
              </motion.div>

              <div>
                <p className="text-malama-accent font-black uppercase tracking-widest text-sm mb-2">Node Secured</p>
                <h2 className="text-5xl font-black text-white tracking-tight">
                  <span className="text-malama-accent">{successData.claimId}</span>
                </h2>
                <p className="text-gray-500 text-sm font-mono mt-1">
                  Edition {String(successData.editionNumber).padStart(3, '0')} / 400
                  {successData.evmTokenId != null && (
                    <span className="text-gray-600"> · Token #{successData.evmTokenId}</span>
                  )}
                </p>
                <p className="text-gray-400 mt-2 text-sm">
                  Minted on <span className="text-white font-bold">{successData.chain === 'base' ? 'Base L2' : 'Cardano'}</span>
                </p>
                {successData.simulated && (
                  <p className="mt-2 text-xs text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5 inline-block">
                    ⚠️ Dev simulation — set env vars for real on-chain mint
                  </p>
                )}
              </div>

              {/* NFT Card */}
              <NftCard data={successData} hexId={hexId} />

              {/* Tx Hash */}
              <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 max-w-sm w-full">
                <span className="text-gray-500 text-xs font-mono flex-1 truncate">{shortHash(successData.txHash)}</span>
                <button onClick={() => copyHash(successData.txHash)} className="text-gray-500 hover:text-malama-accent transition-colors flex-shrink-0">
                  <Copy className="w-4 h-4" />
                </button>
                {copied && <span className="text-malama-accent text-xs">Copied!</span>}
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                <a
                  href={successData.explorerUrl}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-4 bg-gray-900 border border-gray-800 text-gray-300 rounded-xl font-bold hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> View Transaction
                </a>

                {successData.openSeaUrl && (
                  <a
                    href={successData.openSeaUrl}
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-4 bg-blue-950 border border-blue-800 text-blue-300 rounded-xl font-bold hover:bg-blue-900 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> View on OpenSea
                  </a>
                )}

                {successData.cnftUrl && (
                  <a
                    href={successData.cnftUrl}
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-4 bg-blue-950 border border-blue-800 text-blue-300 rounded-xl font-bold hover:bg-blue-900 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> View on Cardanoscan
                  </a>
                )}

                {successData.chain === 'base' && successData.evmTokenId != null && (
                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <button
                      onClick={() => addToMetaMask(successData.evmTokenId!)}
                      className="flex items-center justify-center gap-2 py-4 bg-orange-950 border border-orange-800 text-orange-300 rounded-xl font-bold hover:bg-orange-900 transition-colors w-full"
                    >
                      🦊 Add to MetaMask
                    </button>
                    {/* Manual import panel — always shown after clicking Add to MetaMask */}
                    {mmImportOpen && (
                      <div className="bg-gray-900 border border-orange-800/40 rounded-xl p-4 text-left space-y-3">
                        <p className="text-xs font-black uppercase tracking-wider text-orange-300">
                          Import NFT manually in MetaMask
                        </p>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          MetaMask → NFTs tab → Import NFT → paste the values below.
                        </p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Network</p>
                            <p className="text-xs text-orange-200 font-mono">Base Sepolia (chain 84532)</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Contract Address</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white font-mono break-all flex-1">{GENESIS_CONTRACT}</span>
                              <button
                                onClick={() => copyMm(GENESIS_CONTRACT, 'address')}
                                className="flex-shrink-0 text-gray-500 hover:text-orange-300 transition-colors"
                                title="Copy"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              {mmCopied === 'address' && <span className="text-orange-300 text-[10px]">Copied!</span>}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Token ID</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white font-mono flex-1">{successData.evmTokenId}</span>
                              <button
                                onClick={() => copyMm(String(successData.evmTokenId), 'tokenId')}
                                className="flex-shrink-0 text-gray-500 hover:text-orange-300 transition-colors"
                                title="Copy"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              {mmCopied === 'tokenId' && <span className="text-orange-300 text-[10px]">Copied!</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <a
                  href="https://discord.gg/PcKRRUcJ"
                  target="_blank" rel="noreferrer"
                  className="sm:col-span-2 flex items-center justify-center gap-2 py-4 bg-[#5865F2] text-white rounded-xl font-bold hover:bg-[#4752C4] transition-colors shadow-[0_0_20px_rgba(88,101,242,0.3)]"
                >
                  <span className="text-lg">💬</span> Join Operator Discord
                </a>

                <Link
                  href="/"
                  className="sm:col-span-2 py-4 bg-malama-accent text-black rounded-xl font-black text-lg hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(196,240,97,0.2)] text-center"
                >
                  Return to Mālama Labs →
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
