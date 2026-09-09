'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Loader2, Wallet, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'
import { useMagic } from '@/components/magic/MagicProvider'
import { getExplorerTxUrl, getOpenSeaAssetUrl } from '@/lib/evm-network'

const GENESIS_CONTRACT = process.env.NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS ?? ''

export default function LaunchClient({ hasMagicPublishableKey }: { hasMagicPublishableKey: boolean }) {
  const { magic } = useMagic()
  const searchParams = useSearchParams()
  const tokenFromUrl = searchParams.get('token')?.trim() ?? ''
  const sessionIdFromUrl = searchParams.get('session_id')?.trim() ?? ''

  const [token, setToken] = useState(tokenFromUrl)
  const [stripeSessionId, setStripeSessionId] = useState(sessionIdFromUrl)
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [claimResult, setClaimResult] = useState<{
    claimId: string
    address: string
    evmTokenId: number
    txHash: string
  } | null>(null)

  useEffect(() => {
    setToken(tokenFromUrl)
    setStripeSessionId(sessionIdFromUrl)
  }, [tokenFromUrl, sessionIdFromUrl])

  const runClaim = useCallback(
    async (didToken: string, transferToken: string, checkoutSessionId: string) => {
      const res = await fetch('/api/custodial/magic-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          didToken,
          transferToken,
          ...(checkoutSessionId ? { stripeSessionId: checkoutSessionId } : {}),
        }),
      })
      const data = (await res.json()) as Record<string, unknown>
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Claim failed')
      }
      setClaimResult({
        claimId: String(data.claimId ?? ''),
        address: String(data.address ?? ''),
        evmTokenId: Number(data.evmTokenId),
        txHash: String(data.txHash ?? ''),
      })
    },
    []
  )

  const loginWithOtp = async () => {
    setErr('')
    if (!magic) {
      setErr('Magic is not configured (set NEXT_PUBLIC_MAGIC_API_KEY).')
      return
    }
    const transferToken = token.trim()
    if (!transferToken) {
      setErr('Add the purchase token from your checkout success link.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErr('Enter the same email you used when paying with card.')
      return
    }
    setBusy(true)
    try {
      await magic.auth.loginWithEmailOTP({ email: email.trim() })
      const didToken = await magic.user.getIdToken()
      if (!didToken) throw new Error('Could not read Magic session')
      await runClaim(didToken, transferToken, stripeSessionId.trim())
      setEmail('')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  if (!hasMagicPublishableKey) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-400" />
        <h1 className="text-2xl font-black text-white">Magic not configured</h1>
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">
          Set the variables below in <code className="text-malama-teal">apps/web/.env.local</code> or in the{' '}
          <strong className="text-gray-300">monorepo root</strong> <code className="text-gray-500">.env.local</code>, then
          restart <code className="text-gray-500">npm run dev</code> from <code className="text-gray-500">apps/web</code>.
        </p>
        <ul className="mt-6 text-left text-sm text-gray-500 space-y-2 max-w-md mx-auto font-mono">
          <li>NEXT_PUBLIC_MAGIC_API_KEY=pk_test_…</li>
          <li>MAGIC_SECRET_KEY=…</li>
          <li>NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org</li>
        </ul>
        <p className="mt-6 text-xs text-gray-600">
          Copy <code className="text-gray-500">apps/web/.env.example</code> as a starting point. Keys are in the{' '}
          <a href="https://dashboard.magic.link" className="text-malama-teal underline" target="_blank" rel="noreferrer">
            Magic dashboard
          </a>
          .
        </p>
        <Link href="/" className="mt-8 inline-block text-malama-teal font-bold">
          ← Home
        </Link>
      </div>
    )
  }

  if (claimResult) {
    const openSea =
      GENESIS_CONTRACT && getOpenSeaAssetUrl(GENESIS_CONTRACT, claimResult.evmTokenId)
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-malama-teal" />
        <h1 className="text-3xl font-black text-white mb-2">{claimResult.claimId}</h1>
        <p className="text-gray-400 mb-8">
          Your Genesis NFT is in your Magic wallet on Base. You can connect this app or any wallet UI that
          supports Magic to manage it.
        </p>
        <div className="rounded-2xl border border-gray-800 bg-malama-card p-6 text-left space-y-3 mb-8">
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">Magic wallet</p>
            <p className="font-mono text-sm text-white break-all">{claimResult.address}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">Token ID</p>
            <p className="font-mono text-sm text-malama-teal">{claimResult.evmTokenId}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={getExplorerTxUrl(claimResult.txHash)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-6 py-3 font-bold text-white hover:bg-gray-900"
          >
            <ExternalLink className="h-4 w-4" /> Transaction
          </a>
          {openSea && (
            <a
              href={openSea}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-800 bg-blue-950/50 px-6 py-3 font-bold text-blue-200 hover:bg-blue-900/50"
            >
              <ExternalLink className="h-4 w-4" /> OpenSea
            </a>
          )}
        </div>
        <Link href="/dashboard" className="mt-10 inline-block text-malama-teal font-bold">
          Open dashboard →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="mb-10 text-center">
        <Wallet className="mx-auto mb-4 h-14 w-14 text-malama-teal" />
        <h1 className="text-3xl font-black text-white">Launch app. Magic wallet</h1>
        <p className="mt-2 text-gray-400 text-sm leading-relaxed">
          After paying with card, sign in with the <strong className="text-gray-200">same email</strong> you used at
          checkout. Magic will email you a one-time code (or magic link). Then we mint your Genesis NFT to your
          embedded wallet.
        </p>
      </div>

      <label className="block mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Purchase token</span>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste from card-complete link"
          className="mt-1 w-full rounded-xl border border-gray-800 bg-black/50 px-4 py-3 font-mono text-sm text-white placeholder:text-gray-600"
          autoComplete="off"
          spellCheck={false}
        />
      </label>

      <label className="block mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Stripe checkout session <span className="text-gray-600 font-normal">(optional. Paste if claim fails)</span>
        </span>
        <input
          type="text"
          value={stripeSessionId}
          onChange={(e) => setStripeSessionId(e.target.value)}
          placeholder="cs_test_…. From card-complete URL ?session_id=… (needed after server restart)"
          className="mt-1 w-full rounded-xl border border-gray-800 bg-black/50 px-4 py-3 font-mono text-sm text-white placeholder:text-gray-600"
          autoComplete="off"
          spellCheck={false}
        />
      </label>

      <label className="block mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Email (checkout)</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-xl border border-gray-800 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600"
          autoComplete="email"
        />
      </label>

      {err && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {err}
        </div>
      )}

      <button
        type="button"
        disabled={busy || !magic}
        onClick={() => void loginWithOtp()}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-malama-teal/60 bg-malama-teal/15 py-4 font-black text-malama-teal hover:bg-malama-teal/25 disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {busy ? 'Confirming…' : 'Send code & claim NFT'}
      </button>

      <p className="mt-6 text-center text-xs text-gray-600">
        Opens Magic Email OTP. Enter the code from email to finish sign-in, then we claim your mint automatically.
      </p>

      <Link href="/presale" className="mt-10 block text-center text-gray-500 hover:text-white text-sm">
        ← Presale
      </Link>
    </div>
  )
}
