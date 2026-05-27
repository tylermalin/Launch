'use client'

import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { useWallet } from '@meshsdk/react'
import { useAccount, useConnect } from 'wagmi'
import {
  ShieldCheck,
  Cpu,
  MapPin,
  CheckCircle2,
  Box,
  Radio,
  AlertCircle,
  TrendingUp,
  Lock,
  Mail,
  Loader2,
  Pencil,
  X,
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { cellToLatLng, getResolution } from 'h3-js'
import { classifyZone, estimateWaterCoverage, detectRegion, REGION_LABELS } from '@/lib/hex-geo'
import type { Phase1Hex } from '@/explorer/components/hex-map.types'

// HexPanel has no Mapbox dep but uses h3-js WASM — load client-side only
const HexPanel = dynamic(
  () => import('@/explorer/components/HexPanel').then((m) => m.HexPanel),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center p-12 text-gray-500 font-mono text-sm">
      Loading details…
    </div>
  )},
)

/** Build a Phase1Hex from an h3Index alone (all fields derivable server-free). */
async function buildHexFromId(hexId: string): Promise<Phase1Hex> {
  const [lat, lng] = cellToLatLng(hexId)
  const res = getResolution(hexId)
  const { zone, multiplier } = classifyZone(lat, lng)
  const waterCoveragePercent = estimateWaterCoverage(lat, lng, res)
  const regionKey = detectRegion(lat, lng)
  const region = REGION_LABELS[regionKey] ?? 'United States'

  // Pull edition number from claim registry so nodeNumber is accurate
  let nodeNumber = 0
  try {
    const r = await fetch(`/api/nft/claim?hexId=${hexId}`)
    if (r.ok) {
      const d = (await r.json()) as { editionNumber?: number }
      if (d.editionNumber) nodeNumber = d.editionNumber
    }
  } catch { /* non-fatal */ }

  return {
    nodeNumber,
    h3Index: hexId,
    h3Resolution: res,
    status: 'reserved',
    operator: null,
    region,
    country: 'US',
    administrativeArea: null,
    locality: null,
    postalCode: null,
    centroidLat: lat,
    centroidLng: lng,
    zoneClassification: zone,
    geographicMultiplier: multiplier,
    waterCoveragePercent,
    dataDemandScore: null,
    listingReferenceUsd: 2228,
    genesisReserveUsd: 2000,
  }
}

// ─── Shipping address (mirrors lib/shipping-store.ts) ────────────────────────

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
  | { tag: 'idle' }
  | { tag: 'loading' }
  | { tag: 'view'; address: ShippingAddress }
  | { tag: 'edit'; address: ShippingAddress | null }
  | { tag: 'saving' }
  | { tag: 'error'; message: string }

// ─── Referral link section ────────────────────────────────────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://launch.malamalabs.com'

/**
 * Simple referral link for non-partner users.
 * Earns reward points (not % commission — that's the KOL partner programme).
 * The ref param is the SHA-256 prefix of the user's email (URL-safe, non-reversible).
 */
function ReferralLinkSection({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const [refId, setRefId] = useState<string | null>(null)

  useEffect(() => {
    // Derive a short, non-reversible referral ID from the email
    const encoder = new TextEncoder()
    crypto.subtle.digest('SHA-256', encoder.encode(email.toLowerCase())).then((buf) => {
      const hex = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
      setRefId(hex.slice(0, 12))
    })
  }, [email])

  const referralUrl = refId ? `${APP_URL}/presale?ref=${refId}` : null

  const copy = () => {
    if (!referralUrl) return
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section className="rounded-3xl border border-gray-800 bg-malama-card p-8 shadow-xl">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">🔗</span>
        <h2 className="text-xl font-bold uppercase tracking-wider text-white">Your Referral Link</h2>
      </div>
      <p className="mb-6 text-sm text-gray-400 leading-relaxed">
        Share your personalised link — when someone reserves a Genesis Hex through it, you earn reward points toward future network benefits.{' '}
        <a href="/partners/apply" className="text-malama-teal underline underline-offset-2">Apply to the Partner Programme</a>{' '}
        to earn commission instead.
      </p>
      {referralUrl ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="flex-1 rounded-lg border border-gray-700 bg-black/30 px-4 py-3 font-mono text-sm text-malama-teal break-all">
            {referralUrl}
          </code>
          <button
            onClick={copy}
            className="shrink-0 rounded-lg border border-malama-teal/40 bg-malama-teal/10 px-5 py-3 font-mono text-sm font-bold text-malama-teal transition-colors hover:bg-malama-teal/20"
          >
            {copied ? '✓ Copied' : 'Copy Link'}
          </button>
        </div>
      ) : (
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-800" />
      )}
    </section>
  )
}

function ShippingAddressSection({ email }: { email: string }) {
  const [phase, setPhase] = useState<ShippingPhase>({ tag: 'loading' })
  const [form, setForm] = useState({
    fullName: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'US', phone: '',
  })

  useEffect(() => {
    if (!email) { setPhase({ tag: 'idle' }); return }
    fetch(`/api/shipping?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((d: { address: ShippingAddress | null }) => {
        if (d.address) {
          setPhase({ tag: 'view', address: d.address })
          setForm({
            fullName: d.address.fullName,
            line1: d.address.line1,
            line2: d.address.line2 ?? '',
            city: d.address.city,
            state: d.address.state,
            postalCode: d.address.postalCode,
            country: d.address.country,
            phone: d.address.phone ?? '',
          })
        } else {
          setPhase({ tag: 'edit', address: null })
        }
      })
      .catch(() => setPhase({ tag: 'edit', address: null }))
  }, [email])

  function fieldHandler(key: keyof typeof form) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    setPhase({ tag: 'saving' })
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email, claimId: `dashboard-${email}` }),
      })
      const data = (await res.json()) as { ok?: boolean; address?: ShippingAddress; error?: string }
      if (!res.ok || !data.ok) {
        setPhase({ tag: 'error', message: data.error ?? 'Save failed — please try again.' })
        return
      }
      setPhase({ tag: 'view', address: data.address! })
    } catch {
      setPhase({ tag: 'error', message: 'Network error — please try again.' })
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-malama-teal focus:outline-none'
  const labelClass = 'mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500'

  return (
    <section className="rounded-3xl border border-gray-800 bg-malama-card p-8 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MapPin className="h-6 w-6 text-malama-teal" />
          <h2 className="text-lg font-bold uppercase tracking-wider text-white">Shipping address</h2>
        </div>
        {phase.tag === 'view' && (
          <button
            type="button"
            onClick={() => {
              const a = phase.address
              setForm({
                fullName: a.fullName,
                line1: a.line1,
                line2: a.line2 ?? '',
                city: a.city,
                state: a.state,
                postalCode: a.postalCode,
                country: a.country,
                phone: a.phone ?? '',
              })
              setPhase({ tag: 'edit', address: a })
            }}
            className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-400 transition hover:border-malama-teal hover:text-malama-teal"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        )}
      </div>

      {phase.tag === 'loading' && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      )}

      {phase.tag === 'view' && (
        <div className="space-y-0.5 text-sm">
          <p className="font-semibold text-gray-200">{phase.address.fullName}</p>
          <p className="text-gray-400">{phase.address.line1}{phase.address.line2 ? `, ${phase.address.line2}` : ''}</p>
          <p className="text-gray-400">{phase.address.city}, {phase.address.state} {phase.address.postalCode}</p>
          <p className="text-gray-400">{phase.address.country}</p>
          {phase.address.phone && <p className="pt-1 text-gray-500 text-xs">{phase.address.phone}</p>}
        </div>
      )}

      {(phase.tag === 'edit' || phase.tag === 'saving' || phase.tag === 'error') && (
        <form onSubmit={save} className="space-y-3">
          {phase.tag === 'error' && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {phase.message}
            </div>
          )}
          <div>
            <label className={labelClass}>Full name</label>
            <input className={inputClass} required placeholder="Jane Smith" value={form.fullName} onChange={fieldHandler('fullName')} />
          </div>
          <div>
            <label className={labelClass}>Address line 1</label>
            <input className={inputClass} required placeholder="123 Main St" value={form.line1} onChange={fieldHandler('line1')} />
          </div>
          <div>
            <label className={labelClass}>Line 2 <span className="normal-case font-normal text-gray-600">(optional)</span></label>
            <input className={inputClass} placeholder="Apt 4B" value={form.line2} onChange={fieldHandler('line2')} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>City</label>
              <input className={inputClass} required placeholder="Los Angeles" value={form.city} onChange={fieldHandler('city')} />
            </div>
            <div>
              <label className={labelClass}>State / Province</label>
              <input className={inputClass} required placeholder="CA" value={form.state} onChange={fieldHandler('state')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Postal code</label>
              <input className={inputClass} required placeholder="90001" value={form.postalCode} onChange={fieldHandler('postalCode')} />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <select className={inputClass} value={form.country} onChange={fieldHandler('country')}>
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
            <label className={labelClass}>Phone <span className="normal-case font-normal text-gray-600">(optional)</span></label>
            <input className={inputClass} type="tel" placeholder="+1 555 000 0000" value={form.phone} onChange={fieldHandler('phone')} />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={phase.tag === 'saving'}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-malama-teal/50 bg-malama-teal/20 py-2.5 text-sm font-bold text-malama-teal transition hover:bg-malama-teal hover:text-black disabled:opacity-50"
            >
              {phase.tag === 'saving' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {phase.tag === 'saving' ? 'Saving…' : 'Save address'}
            </button>
            {phase.tag !== 'saving' && (phase as { tag: string }).tag === 'edit' && (phase as { address: ShippingAddress | null }).address !== null && (
              <button
                type="button"
                onClick={() => setPhase({ tag: 'view', address: (phase as { address: ShippingAddress }).address })}
                className="rounded-lg border border-gray-700 px-4 text-sm font-bold text-gray-500 transition hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {phase.tag === 'idle' && (
        <p className="text-sm text-gray-600">Sign in to manage your shipping address.</p>
      )}
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function hexToAscii(hexStr: string | undefined) {
  if (!hexStr || typeof hexStr !== 'string') return ''
  let str = ''
  for (let i = 0; i < hexStr.length; i += 2) {
    str += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16))
  }
  return str
}

export default function Dashboard() {
  const {
    connected: isCardanoConnected,
    wallet: cardanoWallet,
    connect: connectCardano,
    connecting: isCardanoConnecting,
  } = useWallet()

  const { isConnected: isEvmConnected, address: evmAddress } = useAccount()
  const { connectors, connect: connectEvm, isPending: isEvmConnecting } = useConnect()

  const [emailUser, setEmailUser] = useState<string | null>(null)
  const [sessionAuth, setSessionAuth] = useState<'email' | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const walletConnected = isCardanoConnected || isEvmConnected
  const isAuthenticated = walletConnected || !!emailUser

  const [hexes, setHexes] = useState<string[]>([])
  const [loadingAssets, setLoadingAssets] = useState(false)

  // ── Hex detail modal ──────────────────────────────────────────────────────
  const [detailHex, setDetailHex] = useState<Phase1Hex | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  async function openDetail(hexId: string) {
    setDetailLoading(true)
    setDetailHex(null)
    // Show the modal shell immediately while data loads
    setDetailHex({ h3Index: hexId } as Phase1Hex)
    const full = await buildHexFromId(hexId)
    setDetailHex(full)
    setDetailLoading(false)
  }
  // ─────────────────────────────────────────────────────────────────────────

  const currentStatus = hexes.length > 0 ? 'Hardware Pending' : 'Awaiting Genesis License'
  const activePredictionMarkets = hexes.length > 0 ? 8 : 0

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then((r) => r.json())
      .then((d: { email?: string | null; auth?: string | null }) => {
        if (d.email) setEmailUser(d.email)
        if (d.auth === 'email') setSessionAuth('email')
        else setSessionAuth(null)
      })
      .catch(() => {})
  }, [])

  async function signInWithEmail(e: FormEvent) {
    e.preventDefault()
    setEmailError(null)
    const trimmed = emailInput.trim()
    if (!trimmed) {
      setEmailError('Enter your email')
      return
    }
    setEmailSubmitting(true)
    try {
      const res = await fetch('/api/auth/email-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: trimmed }),
      })
      const data = (await res.json()) as { ok?: boolean; email?: string; error?: string }
      if (!res.ok) {
        setEmailError(data.error ?? 'Sign-in failed')
        return
      }
      if (data.email) setEmailUser(data.email)
      setSessionAuth('email')
      window.dispatchEvent(new Event('malama:auth'))
    } catch {
      setEmailError('Network error')
    } finally {
      setEmailSubmitting(false)
    }
  }

  async function signOutEmail() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setEmailUser(null)
    setSessionAuth(null)
    setEmailInput('')
    window.dispatchEvent(new Event('malama:auth'))
  }

  // ── Inventory: single source of truth from /api/user ──────────────────────
  // When the user signs in with email, fetch their account record (hexIds is
  // the authoritative list regardless of payment method used at purchase).
  // When a wallet connects without email, link it to the account server-side.
  useEffect(() => {
    if (!emailUser) {
      setHexes([])
      return
    }
    setLoadingAssets(true)
    fetch('/api/user', { credentials: 'include' })
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((data: { account?: { hexIds?: string[] } }) => {
        setHexes(data.account?.hexIds ?? [])
      })
      .catch((e) => console.error('[dashboard] failed to load user account:', e))
      .finally(() => setLoadingAssets(false))
  }, [emailUser])

  // Link a newly connected wallet to the account (fire-and-forget)
  useEffect(() => {
    if (!emailUser) return
    if (evmAddress) {
      fetch('/api/user', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evmAddress }),
      }).catch(() => {})
    }
  }, [emailUser, evmAddress])

  useEffect(() => {
    if (!emailUser || !isCardanoConnected || !cardanoWallet) return
    Promise.resolve(cardanoWallet.getChangeAddress?.())
      .then((cardanoAddress: string | undefined) => {
        if (!cardanoAddress) return
        fetch('/api/user', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardanoAddress }),
        }).catch(() => {})
      })
      .catch(() => {})
  }, [emailUser, isCardanoConnected, cardanoWallet])

  const firstConnector = connectors[0]

  return (
    <div className="relative min-h-screen bg-black p-6 font-sans text-gray-200 selection:bg-malama-teal selection:text-black md:p-12">
      <header className="mx-auto mb-10 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Node Command Center</h1>
          <p className="mt-1 font-mono text-sm text-malama-teal">
            {loadingAssets
              ? 'Scanning Omnichain Ledger...'
              : `${hexes.length} Genesis Licenses Active`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAuthenticated ? (
            <div className="flex flex-wrap items-center gap-3">
              {emailUser && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-1.5">
                  <Mail className="h-4 w-4 shrink-0 text-malama-teal" />
                  <span className="max-w-[200px] truncate text-xs text-gray-300">{emailUser}</span>
                  <button
                    type="button"
                    onClick={() => signOutEmail()}
                    className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white"
                  >
                    Sign out
                  </button>
                </div>
              )}
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Network Status</p>
                <div className="flex items-center space-x-2">
                  {isEvmConnected && <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />}
                  {isCardanoConnected && (
                    <span className="h-2 w-2 animate-pulse rounded-full bg-malama-teal" />
                  )}
                  {!walletConnected && emailUser && (
                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                  )}
                  <p className="text-lg font-bold text-white">
                    {!walletConnected && emailUser ? 'Email session' : currentStatus}
                  </p>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-malama-teal/30 bg-malama-deep shadow-[0_0_15px_rgba(196,240,97,0.2)]">
                <Cpu className="h-6 w-6 text-malama-teal" />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => connectCardano('lace')}
                disabled={isCardanoConnecting || isEvmConnecting}
                className="rounded-lg border border-malama-teal/50 bg-malama-teal/20 px-4 py-2 font-bold text-malama-teal transition-colors hover:bg-malama-teal hover:text-black disabled:opacity-50"
              >
                Access Lace
              </button>
              <button
                type="button"
                onClick={() => firstConnector && connectEvm({ connector: firstConnector })}
                disabled={isCardanoConnecting || isEvmConnecting || !firstConnector}
                className="rounded-lg border border-blue-500/50 bg-blue-500/20 px-4 py-2 font-bold text-blue-400 transition-colors hover:bg-blue-500 hover:text-white disabled:opacity-50"
              >
                Access EVM
              </button>
            </div>
          )}
        </div>
      </header>

      {!isAuthenticated && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 pt-32 backdrop-blur-md">
          <div className="mx-4 max-w-md rounded-3xl border border-gray-800 bg-malama-card p-8 text-center shadow-2xl md:p-10">
            <ShieldCheck className="mx-auto mb-6 h-20 w-20 text-malama-teal drop-shadow-[0_0_20px_rgba(196,240,97,0.3)]" />
            <h2 className="mb-2 text-2xl font-black tracking-tight text-white">Sign in to the app</h2>
            <p className="mb-8 leading-relaxed text-gray-400">
              Enter your email to continue — or connect your{' '}
              <strong className="text-gray-300">Cardano</strong> (Lace) /{' '}
              <strong className="text-gray-300">Base</strong> (MetaMask) wallet to load on-chain licences.
            </p>

            <form onSubmit={signInWithEmail} className="mb-6 space-y-3 text-left">
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-800 bg-black/50 px-4 py-3 text-white placeholder:text-gray-600 focus:border-malama-teal focus:outline-none"
                />
              </label>
              {emailError && <p className="text-sm text-red-400">{emailError}</p>}
              <button
                type="submit"
                disabled={emailSubmitting || isCardanoConnecting || isEvmConnecting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-violet-500/50 bg-violet-500/10 py-4 font-black text-violet-200 transition hover:bg-violet-500/20 disabled:opacity-50"
              >
                <Mail className="h-5 w-5" />
                {emailSubmitting ? 'Signing in…' : 'Continue with email'}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-malama-card px-4 text-gray-500">Or connect a wallet</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => connectCardano('lace')}
                disabled={isCardanoConnecting || isEvmConnecting}
                className="w-full rounded-xl border-2 border-malama-teal/50 bg-malama-teal/10 py-4 font-black text-malama-teal shadow-xl transition hover:bg-malama-teal hover:text-black disabled:opacity-50"
              >
                {isCardanoConnecting ? 'Verifying…' : 'Cardano (Lace)'}
              </button>

              <button
                type="button"
                onClick={() => firstConnector && connectEvm({ connector: firstConnector })}
                disabled={isCardanoConnecting || isEvmConnecting || !firstConnector}
                className="w-full rounded-xl border-2 border-blue-500/50 bg-blue-500/10 py-4 font-black text-blue-400 shadow-xl transition hover:bg-blue-500 hover:text-white disabled:opacity-50"
              >
                {isEvmConnecting ? 'Verifying…' : 'Base / EVM (MetaMask)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {emailUser && !walletConnected && isAuthenticated && (
        <div className="mx-auto mb-8 max-w-6xl rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 text-sm text-violet-100 md:text-center">
          Signed in with email. Connect a wallet to scan NFTs on-chain, or use your{' '}
          <Link href="/presale" className="font-bold text-malama-teal underline underline-offset-2">
            reservation / custodial transfer link
          </Link>{' '}
          from checkout.
        </div>
      )}

      <div
        className={`mx-auto grid max-w-6xl grid-cols-1 gap-8 transition-opacity duration-500 lg:grid-cols-3 ${
          !isAuthenticated ? 'pointer-events-none opacity-20' : 'opacity-100'
        }`}
      >
        <div className="space-y-8 lg:col-span-2">
          <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-malama-card p-8 shadow-2xl">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-malama-teal to-blue-600" />
            <h2 className="mb-6 text-xl font-bold uppercase tracking-wider text-white">Node Activation Protocol</h2>

            <div className="relative mb-8 flex flex-col justify-between md:flex-row">
              <div className="absolute left-0 top-1/2 -z-10 hidden h-1 w-full bg-gray-800 md:block" />

              <div
                className={`z-10 flex w-32 flex-col items-center bg-malama-card p-2 text-center ${
                  hexes.length === 0 ? 'opacity-40' : ''
                }`}
              >
                <CheckCircle2
                  className={`mb-2 h-10 w-10 rounded-full bg-malama-card ${
                    hexes.length > 0
                      ? 'text-malama-teal shadow-[0_0_20px_rgba(196,240,97,0.3)]'
                      : 'text-gray-600'
                  }`}
                />
                <span className={`font-bold ${hexes.length > 0 ? 'text-white' : 'text-gray-400'}`}>
                  License Ownership
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  {hexes.length > 0 ? 'Genesis Deed Secured' : 'No License Found'}
                </span>
              </div>

              <div
                className={`z-10 flex w-32 flex-col items-center bg-malama-card p-2 text-center ${
                  hexes.length === 0 ? 'opacity-20 grayscale' : ''
                }`}
              >
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full border-4 ${
                    hexes.length > 0
                      ? 'border-malama-teal bg-malama-teal/20'
                      : 'border-gray-700 bg-gray-800'
                  }`}
                >
                  <Box className={`h-4 w-4 ${hexes.length > 0 ? 'text-malama-teal' : 'text-gray-500'}`} />
                </div>
                <span className={`font-bold ${hexes.length > 0 ? 'text-malama-teal' : 'text-gray-500'}`}>
                  Hardware Shipped
                </span>
                <span className="mt-1 text-xs text-malama-teal/80">
                  {hexes.length > 0 ? 'In Transit - Expected in 6 Months' : 'Pending Verification'}
                </span>
              </div>

              <div className="z-10 flex w-32 flex-col items-center bg-malama-card p-2 text-center opacity-40">
                <Radio className="mb-2 h-10 w-10 bg-malama-card text-gray-600" />
                <span className="font-bold text-gray-400">Data Uplink</span>
                <span className="mt-1 text-xs text-gray-500">Awaiting Sensor Boot</span>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6">
              <div className="flex items-start">
                <AlertCircle className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-blue-400" />
                <div>
                  <h3 className="text-lg font-bold text-blue-400">Next Step: Plug & Play Validation</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-300">
                    Once your sensor arrives, simply connect it to a standard power source within your Hex territory. It
                    will immediately begin broadcasting cryptographically-signed spatial data constraints natively to the
                    base network without any technical setup routing required.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-800 bg-malama-card p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Your Validator Network Licenses</h2>
            </div>

            {loadingAssets ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-700 p-10 text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-t-2 border-malama-teal" />
                <p className="font-bold text-gray-400">Scanning Ledger Utilities...</p>
              </div>
            ) : hexes.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-700 bg-gray-900/30 p-10 text-center">
                <Lock className="mb-4 h-10 w-10 text-gray-600" />
                <p className="mb-2 text-xl font-bold text-gray-400">No Genesis Licenses Discovered</p>
                <p className="mb-6 max-w-md text-gray-500">
                  {walletConnected
                    ? 'Your connected wallet currently holds 0 verified Node Operator NFTs in this view.'
                    : emailUser
                      ? 'Connect Cardano or Base above to load on-chain NFTs. Paid with card? Use the transfer link from your purchase email.'
                      : 'Connect a wallet or sign in with email to continue.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {hexes.map((hex, i) => (
                  <div
                    key={`${hex}-${i}`}
                    className="group relative overflow-hidden rounded-xl border border-gray-700 bg-malama-deep p-5"
                  >
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-malama-amber/5 blur-2xl" />

                    <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="rounded px-2 py-1 text-[10px] font-bold bg-yellow-500/20 text-yellow-400">
                            GENESIS TIER
                          </span>
                        </div>
                        <p className="mt-2 font-mono text-2xl font-bold text-white">{hex}</p>
                        <p className="mt-1 text-sm text-gray-500">Target Physical Coordinate Base</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Active Data Markets</p>
                        <p className="text-2xl font-black text-malama-amber">{activePredictionMarkets}</p>
                        <div className="flex items-center gap-2">
                          {/* See full node details (same panel as presented at sale) */}
                          <button
                            type="button"
                            onClick={() => openDetail(hex)}
                            className="inline-flex items-center rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs font-bold text-yellow-400 transition-colors hover:border-yellow-400 hover:bg-yellow-500/20"
                          >
                            See Details
                          </button>
                          {/* Open explorer map zoomed to this hex */}
                          <Link
                            href={`/explorer?hex=${hex}`}
                            className="inline-flex items-center rounded-lg border border-malama-teal/20 bg-malama-teal/10 px-3 py-1.5 text-xs font-bold text-malama-teal transition-colors hover:border-malama-teal hover:text-white"
                          >
                            <MapPin className="mr-1 h-3 w-3" /> View on Map
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/explorer"
              className="mt-8 block w-full rounded-xl border border-gray-800 bg-gray-900 py-4 text-center text-lg font-black text-white transition-colors hover:bg-gray-800"
            >
              Acquire Additional Territory
            </Link>
          </section>
        </div>

        <div className="space-y-8">
          {emailUser && <ShippingAddressSection email={emailUser} />}
          {emailUser && <ReferralLinkSection email={emailUser} />}

          <section className="rounded-3xl border border-gray-800 bg-malama-card p-8 shadow-xl">
            <div className="mb-6 flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-malama-teal" />
              <h2 className="text-xl font-bold uppercase tracking-wider text-white">Validator Fee Accruals</h2>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Prediction Market Yields
                </p>
                <div className="flex items-baseline space-x-2">
                  <p
                    className={`font-mono text-4xl font-black ${
                      hexes.length > 0 ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    $0.00
                  </p>
                  <p className="text-sm font-bold text-gray-500">USDC</p>
                </div>
              </div>

              <div className="h-px w-full bg-gray-800" />

              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-500">Data Feed Bounties</p>
                <div className="flex items-baseline space-x-2">
                  <p className={`font-mono text-3xl font-bold ${hexes.length > 0 ? 'text-gray-300' : 'text-gray-600'}`}>
                    0.00
                  </p>
                  <p className="text-sm font-bold text-malama-teal">MALAMA</p>
                </div>
              </div>
            </div>

            <div className="mt-8 w-full">
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-gray-900/50 py-3 text-sm font-bold text-gray-500"
              >
                Claim Yields (Awaiting Uplink)
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-malama-teal/30 bg-malama-teal/10 p-4">
              <p className="text-xs font-bold leading-relaxed text-malama-teal/90">
                As soon as your hardware establishes a secure uplink, external Prediction Markets resolving inside your
                Hex automatically pay validation fees directly into this ledger!
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* ── Hex Detail Modal ─────────────────────────────────────────────── */}
      {detailHex && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setDetailHex(null)}
        >
          <div
            className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-700 bg-[#0c0c0c] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setDetailHex(null)}
              className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {detailLoading || !detailHex.h3Resolution ? (
              <div className="flex items-center justify-center gap-2 p-12 text-gray-500 font-mono text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading node details…
              </div>
            ) : (
              <HexPanel
                hex={detailHex}
                links={{
                  erc721MetadataUrl: `/api/nft/${detailHex.nodeNumber}?hexId=${detailHex.h3Index}`,
                  cardanoReferenceNftUrl: null,
                  purchaseAgreementUrl: '/legal/hex-node-purchase-agreement',
                  termsAndConditionsUrl: '/legal',
                  tokenRewardsRiskUrl: '/legal/token-rewards-risk',
                  zoneClassificationDocUrl: '/docs/zone-classification',
                  dataDemandScoreDocUrl: '/docs/data-demand-score-methodology',
                  pricingMethodologyDocUrl: '/docs/pricing',
                }}
                onReserveClick={() => {}} // already owned — no-op
                onClose={() => setDetailHex(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
