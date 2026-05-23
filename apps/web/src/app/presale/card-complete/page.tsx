'use client'

import { useEffect, useState, Suspense, FormEvent } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2, AlertCircle, ExternalLink, MapPin } from 'lucide-react'

// ─── Shipping address types (mirrors lib/shipping-store.ts) ──────────────────

interface ShippingAddress {
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  savedAt?: string
}

type ShippingPhase =
  | { tag: 'loading' }
  | { tag: 'form' }
  | { tag: 'saving' }
  | { tag: 'saved'; address: ShippingAddress }
  | { tag: 'error'; message: string }

function ShippingAddressCapture({ claimId, email }: { claimId: string; email: string }) {
  const [phase, setPhase] = useState<ShippingPhase>({ tag: 'loading' })
  const [form, setForm] = useState({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  })

  useEffect(() => {
    if (!claimId) { setPhase({ tag: 'form' }); return }
    fetch(`/api/shipping?claimId=${encodeURIComponent(claimId)}`)
      .then((r) => r.json())
      .then((d: { address: ShippingAddress | null }) => {
        if (d.address) setPhase({ tag: 'saved', address: d.address })
        else setPhase({ tag: 'form' })
      })
      .catch(() => setPhase({ tag: 'form' }))
  }, [claimId])

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setPhase({ tag: 'saving' })
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, claimId, email }),
      })
      const data = (await res.json()) as { ok?: boolean; address?: ShippingAddress; error?: string }
      if (!res.ok || !data.ok) {
        setPhase({ tag: 'error', message: data.error ?? 'Save failed — please try again.' })
        return
      }
      setPhase({ tag: 'saved', address: data.address! })
    } catch {
      setPhase({ tag: 'error', message: 'Network error — please try again.' })
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-malama-accent focus:outline-none'
  const labelClass = 'mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500'

  if (phase.tag === 'loading') {
    return (
      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin" /> Checking shipping info…
      </div>
    )
  }

  if (phase.tag === 'saved') {
    const a = phase.address
    return (
      <div className="mt-10 w-full rounded-2xl border border-malama-accent/30 bg-malama-accent/5 p-6 text-left">
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-malama-accent" />
          <p className="font-bold text-malama-accent">Shipping address saved</p>
        </div>
        <p className="text-sm text-gray-300">{a.fullName}</p>
        <p className="text-sm text-gray-300">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
        <p className="text-sm text-gray-300">{a.city}, {a.state} {a.postalCode} · {a.country}</p>
        {a.phone && <p className="mt-1 text-sm text-gray-500">{a.phone}</p>}
        <button
          type="button"
          onClick={() => setPhase({ tag: 'form' })}
          className="mt-4 text-xs font-bold text-malama-accent/70 hover:text-malama-accent underline underline-offset-2"
        >
          Edit address
        </button>
      </div>
    )
  }

  return (
    <div className="mt-10 w-full rounded-2xl border border-gray-800 bg-malama-card p-6 text-left">
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-malama-accent" />
        <div>
          <p className="font-bold text-white">Shipping address</p>
          <p className="text-xs text-gray-500">Required for hardware fulfillment</p>
        </div>
      </div>

      {phase.tag === 'error' && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {phase.message}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className={labelClass}>Full name</label>
          <input
            className={inputClass}
            required
            placeholder="Jane Smith"
            value={form.fullName}
            onChange={field('fullName')}
          />
        </div>

        <div>
          <label className={labelClass}>Address line 1</label>
          <input
            className={inputClass}
            required
            placeholder="123 Main St"
            value={form.line1}
            onChange={field('line1')}
          />
        </div>

        <div>
          <label className={labelClass}>Address line 2 <span className="normal-case font-normal text-gray-600">(optional)</span></label>
          <input
            className={inputClass}
            placeholder="Apt 4B"
            value={form.line2}
            onChange={field('line2')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>City</label>
            <input className={inputClass} required placeholder="Los Angeles" value={form.city} onChange={field('city')} />
          </div>
          <div>
            <label className={labelClass}>State / Province</label>
            <input className={inputClass} required placeholder="CA" value={form.state} onChange={field('state')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Postal code</label>
            <input className={inputClass} required placeholder="90001" value={form.postalCode} onChange={field('postalCode')} />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <select className={inputClass} value={form.country} onChange={field('country')}>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="JP">Japan</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="SG">Singapore</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Phone <span className="normal-case font-normal text-gray-600">(optional — for shipping notifications)</span></label>
          <input
            className={inputClass}
            type="tel"
            placeholder="+1 555 000 0000"
            value={form.phone}
            onChange={field('phone')}
          />
        </div>

        <button
          type="submit"
          disabled={phase.tag === 'saving'}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-malama-accent py-3 font-bold text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {phase.tag === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}
          {phase.tag === 'saving' ? 'Saving…' : 'Save shipping address'}
        </button>
      </form>
    </div>
  )
}

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
  const purchaseEmail = typeof d.email === 'string' ? d.email : ''
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

      {claimId && purchaseEmail && (
        <ShippingAddressCapture claimId={claimId} email={purchaseEmail} />
      )}

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
