'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { isAddress } from 'viem'

function TransferInner() {
  const searchParams = useSearchParams()
  const claimId = searchParams.get('claimId') ?? ''
  const token = searchParams.get('token') ?? ''
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [txHash, setTxHash] = useState('')
  const [explorerUrl, setExplorerUrl] = useState('')

  const submit = async () => {
    setError('')
    if (!destination.trim()) {
      setError('Enter the wallet address that should receive the NFT.')
      return
    }
    if (!isAddress(destination.trim() as `0x${string}`)) {
      setError('Enter a valid Ethereum address (0x…).')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/custodial/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimId,
          transferToken: token,
          destination: destination.trim(),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Transfer failed')
      setTxHash(json.txHash)
      setExplorerUrl(json.explorerUrl ?? '')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  if (!claimId || !token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-amber-400 mb-4" />
        <p className="text-gray-400 max-w-md">
          Missing claim or token. Open the transfer link from your purchase confirmation email or card-complete
          page.
        </p>
        <Link href="/presale" className="mt-6 text-malama-accent font-bold">
          Presale
        </Link>
      </div>
    )
  }

  if (txHash) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 max-w-md mx-auto text-center">
        <CheckCircle2 className="w-16 h-16 text-malama-accent mb-6" />
        <h1 className="text-2xl font-black text-white mb-2">Transfer submitted</h1>
        <p className="text-gray-400 text-sm mb-6">
          Your Genesis NFT was sent to the wallet you specified.
        </p>
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-malama-accent font-bold hover:underline break-all"
          >
            View on BaseScan
          </a>
        )}
        <Link href="/" className="mt-10 text-gray-500 hover:text-white">
          ← Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center px-4 py-16 max-w-md mx-auto">
      <h1 className="text-3xl font-black text-white mb-2 text-center">Transfer your NFT</h1>
      <p className="text-gray-400 text-sm text-center mb-8">
        Enter the MetaMask or other Ethereum wallet address where you want your Genesis Hex Node license NFT.
        Gas on Base Sepolia is paid from the custodial wallet.
      </p>

      <label className="w-full text-left text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
        Destination address (Base)
      </label>
      <input
        type="text"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        placeholder="0x…"
        className="w-full rounded-xl border border-gray-800 bg-black/40 px-4 py-3 font-mono text-sm text-white placeholder:text-gray-600 focus:border-malama-accent focus:outline-none mb-4"
        autoComplete="off"
        spellCheck={false}
      />

      {error && (
        <div className="w-full mb-4 flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={() => void submit()}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-malama-accent text-black font-black text-lg hover:scale-[1.01] transition-transform disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
        Send NFT
      </button>

      <p className="text-xs text-gray-600 mt-6 text-center leading-relaxed">
        This page is authenticated by the secret token in your URL. Do not share it publicly. For production,
        replace this flow with email OTP or a signed-in account.
      </p>

      <Link href="/presale" className="mt-8 text-sm text-gray-500 hover:text-malama-accent">
        ← Presale
      </Link>
    </div>
  )
}

export default function CustodialTransferPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-malama-accent animate-spin" />
        </div>
      }
    >
      <TransferInner />
    </Suspense>
  )
}
