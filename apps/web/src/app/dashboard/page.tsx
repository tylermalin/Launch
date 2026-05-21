'use client'

import { useState, useEffect, FormEvent } from 'react'
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
} from 'lucide-react'
import Link from 'next/link'

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

  const { isConnected: isEvmConnected } = useAccount()
  const { connectors, connect: connectEvm, isPending: isEvmConnecting } = useConnect()

  const [emailUser, setEmailUser] = useState<string | null>(null)
  const [sessionAuth, setSessionAuth] = useState<'auth0' | 'email' | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const walletConnected = isCardanoConnected || isEvmConnected
  const isAuthenticated = walletConnected || !!emailUser || sessionAuth === 'auth0'

  const [hexes, setHexes] = useState<string[]>([])
  const [loadingAssets, setLoadingAssets] = useState(false)

  const currentStatus = hexes.length > 0 ? 'Hardware Pending' : 'Awaiting Genesis License'
  const activePredictionMarkets = hexes.length > 0 ? 8 : 0

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then((r) => r.json())
      .then((d: { email?: string | null; auth?: 'auth0' | 'email' | null }) => {
        if (d.email) setEmailUser(d.email)
        if (d.auth === 'auth0' || d.auth === 'email') setSessionAuth(d.auth)
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
  }

  useEffect(() => {
    async function resolveAssets() {
      if (isCardanoConnected && cardanoWallet) {
        setLoadingAssets(true)
        try {
          const rawAssets = await cardanoWallet.getAssets()
          const assets = Array.isArray(rawAssets) ? rawAssets : []
          const foundHexes: string[] = []

          for (const asset of assets) {
            if (asset && asset.unit && typeof asset.unit === 'string') {
              const assetNameHex = asset.unit.length > 56 ? asset.unit.slice(56) : ''
              if (assetNameHex.length > 0) {
                try {
                  const decodedName = hexToAscii(assetNameHex)
                  if (decodedName.startsWith('Hex')) {
                    const rawTty = decodedName.replace('Hex', '')
                    foundHexes.push(rawTty)
                  }
                } catch {
                  /* ignore */
                }
              }
            }
          }
          setHexes(foundHexes)
        } catch (e) {
          console.error('Failed to fetch Cardano assets', e)
        } finally {
          setLoadingAssets(false)
        }
      } else if (isEvmConnected) {
        setLoadingAssets(true)
        setTimeout(() => {
          setHexes(['EVM-Mock-Tty'])
          setLoadingAssets(false)
        }, 1200)
      } else {
        setHexes([])
      }
    }
    resolveAssets()
  }, [isCardanoConnected, cardanoWallet, isEvmConnected])

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
              {(emailUser || sessionAuth === 'auth0') && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-1.5">
                  <Mail className="h-4 w-4 shrink-0 text-malama-teal" />
                  <span className="max-w-[200px] truncate text-xs text-gray-300">
                    {emailUser ?? 'Auth0 session'}
                  </span>
                  {sessionAuth === 'auth0' ? (
                    <a
                      href="/auth/logout"
                      className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white"
                    >
                      Sign out
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => signOutEmail()}
                      className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white"
                    >
                      Sign out
                    </button>
                  )}
                </div>
              )}
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Network Status</p>
                <div className="flex items-center space-x-2">
                  {isEvmConnected && <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />}
                  {isCardanoConnected && (
                    <span className="h-2 w-2 animate-pulse rounded-full bg-malama-teal" />
                  )}
                  {!walletConnected && (emailUser || sessionAuth === 'auth0') && (
                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                  )}
                  <p className="text-lg font-bold text-white">
                    {!walletConnected && sessionAuth === 'auth0'
                      ? 'Auth0 session'
                      : !walletConnected && emailUser
                        ? 'Email session'
                        : currentStatus}
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
              Sign in with Auth0, use your email (session on this device), or connect{' '}
              <strong className="text-gray-300">Cardano</strong> (Lace) / <strong className="text-gray-300">Base</strong>{' '}
              (MetaMask) to load on-chain licenses.
            </p>

            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <a
                href="/auth/login"
                className="rounded-xl border-2 border-malama-teal/60 bg-malama-teal/15 py-3 text-center font-black text-malama-teal transition hover:bg-malama-teal/25"
              >
                Log in
              </a>
              <a
                href="/auth/login?screen_hint=signup"
                className="rounded-xl border border-gray-700 py-3 text-center font-bold text-gray-300 transition hover:border-malama-teal/50 hover:text-white"
              >
                Sign up
              </a>
            </div>

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

      {(emailUser || sessionAuth === 'auth0') && !walletConnected && isAuthenticated && (
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
                          <span
                            className={`rounded px-2 py-1 text-[10px] font-bold ${
                              isEvmConnected ? 'bg-blue-500/20 text-blue-400' : 'bg-malama-teal/20 text-malama-teal'
                            }`}
                          >
                            GENESIS TIER
                          </span>
                        </div>
                        <p className="mt-2 font-mono text-2xl font-bold text-white">{hex}</p>
                        <p className="mt-1 text-sm text-gray-500">Target Physical Coordinate Base</p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Active Data Markets</p>
                        <p className="mb-2 text-2xl font-black text-malama-amber">{activePredictionMarkets}</p>
                        <Link
                          href={`/explorer?hex=${hex}`}
                          className="inline-flex items-center rounded-lg border border-malama-teal/20 bg-malama-teal/10 px-3 py-1.5 text-xs font-bold text-malama-teal transition-colors hover:border-malama-teal hover:text-white"
                        >
                          <MapPin className="mr-1 h-3 w-3" /> View Explorer
                        </Link>
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
    </div>
  )
}
