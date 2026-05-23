'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2, AlertCircle, ExternalLink } from 'lucide-react'

type Status =
  | { state: 'loading' }
  | { state: 'complete'; data: Record<string, unknown> }
  | { state: 'awaiting_magic'; data: Record<string, unknown> }
  | { state: 'processing' }
  | { state: 'error'; message: string }

function CardCompleteInner() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<Status>({ state: 'loading' })

  useEffect(() => {
    if (!sessionId) {
      setStatus({ state: 'error', message: 'Missing session. Return to presale and try again.' })
      return
    }

    let cancelled = false
    let attempts = 0
    /** ~4 min at 2.5s — session-status now re-runs fulfillment server-side each poll */
    const maxAttempts = 96

    const syncSession = async (): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/checkout/sync-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
        const data = (await res.json()) as { error?: string }
        if (!res.ok) {
          return { ok: false, error: data.error ?? res.statusText }
        }
        return { ok: true }
      } catch {
        return { ok: false, error: 'Network error calling sync' }
      }
    }

    const poll = async () => {
      try {
        // Backup for rare races; session-status also reconciles paid sessions on every GET.
        if (attempts > 0 && attempts % 6 === 0) {
          await syncSession()
        }

        const res = await fetch(`/api/checkout/session-status?session_id=${encodeURIComponent(sessionId)}`)
        const json = (await res.json()) as Record<string, unknown>
        if (cancelled) return
        if (json.state === 'complete') {
          setStatus({ state: 'complete', data: json })
          return
        }
        if (json.state === 'awaiting_magic') {
          setStatus({ state: 'awaiting_magic', data: json })
          return
        }
        if (json.state === 'error') {
          setStatus({ state: 'error', message: String(json.error ?? 'Something went wrong') })
          return
        }
        attempts++
        if (attempts >= maxAttempts) {
          setStatus({
            state: 'error',
            message:
              'Still waiting on server confirmation. If Stripe shows paid, open Launch app from your email link or go to /launch with your purchase token. You can also retry this page.',
          })
          return
        }
        setStatus({ state: 'processing' })
        setTimeout(poll, 2500)
      } catch {
        if (!cancelled) setStatus({ state: 'error', message: 'Could not load status' })
      }
    }

    void (async () => {
      const first = await syncSession()
      if (cancelled) return
      if (!first.ok) {
        setStatus({
          state: 'error',
          message:
            first.error ??
            'Could not sync your checkout. Check STRIPE_SECRET_KEY and that the session exists, then refresh this page.',
        })
        return
      }
      void poll()
    })()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  if (status.state === 'awaiting_magic') {
    const d = status.data
    const launchUrl = typeof d.launchUrl === 'string' ? d.launchUrl : ''
    const msg = typeof d.message === 'string' ? d.message : ''
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-24 text-center max-w-lg mx-auto">
        <CheckCircle2 className="w-16 h-16 text-malama-accent mb-6" />
        <h1 className="text-2xl font-black text-white mb-2">Payment received</h1>
        <p className="text-gray-400 max-w-md mb-8">{msg}</p>
        {launchUrl && (
          <a
            href={launchUrl}
            className="inline-flex items-center justify-center rounded-xl bg-malama-teal px-8 py-4 font-black text-black hover:opacity-90"
          >
            Launch app. Magic wallet
          </a>
        )}
        <p className="mt-6 text-xs text-gray-600 max-w-sm">
          Use the <strong className="text-gray-400">same email</strong> you entered at checkout. Magic will send a
          one-time code to sign in; then your NFT mints to your embedded wallet.
        </p>
        <Link href="/presale" className="mt-10 text-malama-accent font-bold hover:underline">
          ← Presale
        </Link>
      </div>
    )
  }

  if (status.state === 'loading' || status.state === 'processing') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-24 text-center">
        <Loader2 className="w-12 h-12 text-malama-accent animate-spin mb-6" />
        <h1 className="text-2xl font-black text-white mb-2">Finalizing your purchase</h1>
        <p className="text-gray-400 max-w-md">
          {status.state === 'processing'
            ? 'Payment received. Confirming and preparing your wallet…'
            : 'Confirming payment…'}
        </p>
      </div>
    )
  }

  if (status.state === 'error') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-24 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-6" />
        <h1 className="text-2xl font-black text-white mb-2">Could not complete</h1>
        <p className="text-gray-400 max-w-md mb-8">{status.message}</p>
        <Link href="/presale" className="text-malama-accent font-bold hover:underline">
          ← Back to presale
        </Link>
      </div>
    )
  }

  const d = status.data
  const custody = typeof d.custody === 'string' ? d.custody : 'server'
  const transferUrl = typeof d.transferUrl === 'string' ? d.transferUrl : ''
  const launchUrl = typeof d.launchUrl === 'string' ? d.launchUrl : ''
  const claimId = typeof d.claimId === 'string' ? d.claimId : ''
  const custodial = typeof d.custodialAddress === 'string' ? d.custodialAddress : ''
  const explorerUrl = typeof d.explorerUrl === 'string' ? d.explorerUrl : ''
  const openSeaUrl = typeof d.openSeaUrl === 'string' ? d.openSeaUrl : ''

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center px-4 py-16 max-w-lg mx-auto text-center">
      <CheckCircle2 className="w-16 h-16 text-malama-accent mb-6" />
      <p className="text-malama-accent font-black uppercase tracking-widest text-sm mb-2">Paid with card</p>
      <h1 className="text-4xl font-black text-white mb-2">{claimId}</h1>
      <p className="text-gray-400 text-sm mb-8">
        {custody === 'magic'
          ? 'Your NFT was minted on Base to your Magic embedded wallet (same email as checkout). Open Launch app anytime to view balances.'
          : 'Your NFT was minted on Base to a custodial wallet created for this purchase. Save the transfer link below. It is your authentication to move the NFT later.'}
      </p>

      <div className="w-full rounded-2xl border border-gray-800 bg-malama-card p-6 text-left space-y-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {custody === 'magic' ? 'Magic wallet (Base Sepolia)' : 'Custodial wallet (Base)'}
          </p>
          <p className="font-mono text-sm text-white break-all mt-1">{custodial}</p>
        </div>
        {custody === 'magic' && launchUrl && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Launch app</p>
            <a href={launchUrl} className="text-sm text-malama-accent font-bold break-all hover:underline">
              {launchUrl}
            </a>
          </div>
        )}
        {custody === 'server' && transferUrl && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Transfer NFT (save this link)</p>
            <a
              href={transferUrl}
              className="text-sm text-malama-accent font-bold break-all hover:underline"
            >
              {transferUrl}
            </a>
            <p className="text-xs text-gray-600 mt-2">
              Anyone with this link can initiate a transfer to an address you choose. Store it securely or bookmark
              this page.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gray-900 border border-gray-800 text-gray-200 font-bold hover:bg-gray-800"
          >
            <ExternalLink className="w-4 h-4" /> Transaction
          </a>
        )}
        {openSeaUrl && (
          <a
            href={openSeaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-950 border border-blue-800 text-blue-300 font-bold hover:bg-blue-900"
          >
            <ExternalLink className="w-4 h-4" /> OpenSea
          </a>
        )}
      </div>

      <Link href="/" className="mt-10 text-malama-accent font-bold hover:underline">
        Return home →
      </Link>
    </div>
  )
}

export default function CardCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-malama-accent animate-spin" />
        </div>
      }
    >
      <CardCompleteInner />
    </Suspense>
  )
}
