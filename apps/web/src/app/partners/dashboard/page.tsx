'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import {
  Wallet,
  Copy,
  CheckCircle2,
  BarChart3,
  DollarSign,
  Clock,
  ExternalLink,
  ArrowRight,
  MousePointer,
  RefreshCw,
  AlertCircle,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import type { KOLPartner, ReferralCommission } from '@/lib/kol-registry'

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.3 } }),
}

type DashboardData = {
  partner: KOLPartner
  clicks: number
  conversions: number
  totalEarned: number
  pendingEarned: number
  paidEarned: number
  commissions: ReferralCommission[]
  referralUrl: string
  vanityUrl: string
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs text-malama-ink-dim hover:text-malama-accent transition-colors"
    >
      {copied ? <CheckCircle2 size={12} className="text-malama-accent" /> : <Copy size={12} />}
      {copied ? 'Copied!' : (label ?? 'Copy')}
    </button>
  )
}

function StatusBadge({ status }: { status: ReferralCommission['status'] }) {
  const map = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    paid: 'bg-malama-accent/10 text-malama-accent border-malama-accent/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  return (
    <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${map[status]}`}>
      {status}
    </span>
  )
}

// ── Connect wall ─────────────────────────────────────────────────────────────

function ConnectWall() {
  const { connectors, connect, isPending } = useConnect()
  const mmConnector = connectors.find((c) => c.name === 'MetaMask') ?? connectors[0]

  return (
    <div className="min-h-screen bg-malama-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full bg-malama-card border border-malama-line rounded-malama p-10 text-center"
      >
        <Wallet size={36} className="text-malama-accent mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-black text-white mb-2">Partner dashboard</h2>
        <p className="text-sm text-malama-ink-dim mb-8 leading-relaxed">
          Connect the wallet you registered as your payout address to view your stats and earnings.
        </p>
        {mmConnector && (
          <button
            onClick={() => connect({ connector: mmConnector })}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-malama-accent text-malama-bg font-black text-sm uppercase tracking-wider py-3 rounded-malama hover:bg-malama-accent/90 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Connecting…' : 'Connect wallet'}
          </button>
        )}
        <p className="text-xs text-malama-ink-faint mt-6">
          Not a partner yet?{' '}
          <Link href="/partners/apply" className="text-malama-accent hover:underline">
            Apply here
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

// ── Not found ─────────────────────────────────────────────────────────────────

function NotFound({ address }: { address: string }) {
  const { disconnect } = useDisconnect()
  return (
    <div className="min-h-screen bg-malama-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full bg-malama-card border border-malama-line rounded-malama p-10 text-center"
      >
        <AlertCircle size={36} className="text-malama-warn mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-black text-white mb-2">Not found</h2>
        <p className="text-sm text-malama-ink-dim mb-2 leading-relaxed">
          No partner account is linked to:
        </p>
        <p className="text-xs font-mono text-malama-ink-faint bg-malama-bg border border-malama-line rounded px-3 py-2 mb-8 break-all">
          {address}
        </p>
        <Link
          href="/partners/apply"
          className="inline-flex items-center gap-2 bg-malama-accent text-malama-bg font-black text-sm uppercase tracking-wider px-6 py-3 rounded-malama hover:bg-malama-accent/90 transition-colors mb-4"
        >
          Apply to become a partner <ArrowRight size={14} />
        </Link>
        <button onClick={() => disconnect()} className="block mx-auto text-xs text-malama-ink-faint hover:text-malama-accent transition-colors mt-3">
          Disconnect wallet
        </button>
      </motion.div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ data, onRefresh }: { data: DashboardData; onRefresh: () => void }) {
  const { disconnect } = useDisconnect()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setRefreshing(false)
  }

  const commissionPct = (data.partner.commissionBps / 100).toFixed(0)

  return (
    <div className="min-h-screen bg-malama-bg">
      {/* Header */}
      <div className="border-b border-malama-line bg-malama-elev">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-malama-accent mb-0.5">
              Partner Dashboard
            </p>
            <h1 className="text-xl font-serif font-black text-white">{data.partner.displayName}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-malama-ink-dim hover:text-malama-accent transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => disconnect()}
              className="flex items-center gap-1.5 text-xs text-malama-ink-faint hover:text-malama-accent transition-colors"
            >
              <LogOut size={13} /> Disconnect
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Stats grid */}
        <motion.div
          initial="hidden" animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total clicks', value: data.clicks.toLocaleString(), icon: MousePointer, color: 'text-blue-400' },
            { label: 'Conversions', value: data.conversions.toLocaleString(), icon: BarChart3, color: 'text-malama-accent' },
            { label: 'Pending USDC', value: `$${data.pendingEarned.toFixed(2)}`, icon: Clock, color: 'text-amber-400' },
            { label: 'Paid out', value: `$${data.paidEarned.toFixed(2)}`, icon: DollarSign, color: 'text-malama-accent' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp} custom={i}
              className="bg-malama-card border border-malama-line rounded-malama p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-malama-ink-faint uppercase tracking-wider">{stat.label}</p>
                <stat.icon size={14} className={stat.color} />
              </div>
              <p className={`text-2xl font-black font-mono ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Referral links */}
        <motion.div
          initial="hidden" animate="show" variants={fadeUp} custom={4}
          className="bg-malama-card border border-malama-line rounded-malama p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-white text-sm uppercase tracking-wider">Your referral links</h2>
            <span className="text-[10px] font-black uppercase tracking-wider bg-malama-accent/10 text-malama-accent border border-malama-accent/20 px-2 py-0.5 rounded">
              {commissionPct}% commission
            </span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Standard', url: data.referralUrl },
              { label: 'Vanity (short)', url: data.vanityUrl },
            ].map((link) => (
              <div key={link.label} className="flex items-center gap-3 bg-malama-bg border border-malama-line rounded px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-malama-ink-faint mb-0.5">{link.label}</p>
                  <p className="text-sm font-mono text-malama-ink truncate">{link.url}</p>
                </div>
                <CopyButton text={link.url} />
              </div>
            ))}
          </div>
          <p className="text-xs text-malama-ink-faint mt-3">
            Share these anywhere. Referrals are tracked for 30 days after first click.
          </p>
        </motion.div>

        {/* Commission history */}
        <motion.div
          initial="hidden" animate="show" variants={fadeUp} custom={5}
          className="bg-malama-card border border-malama-line rounded-malama p-6"
        >
          <h2 className="font-black text-white text-sm uppercase tracking-wider mb-4">
            Commission history
          </h2>
          {data.commissions.length === 0 ? (
            <div className="text-center py-10">
              <BarChart3 size={28} className="text-malama-ink-faint mx-auto mb-3" />
              <p className="text-sm text-malama-ink-faint">No commissions yet.</p>
              <p className="text-xs text-malama-ink-faint mt-1">Share your link to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-malama-line">
                    {['Date', 'Hex', 'Chain', 'Sale', 'Commission', 'Status', 'Tx'].map((h) => (
                      <th key={h} className="text-left text-[10px] font-black uppercase tracking-wider text-malama-ink-faint pb-3 pr-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-malama-line">
                  {data.commissions.map((c) => (
                    <tr key={c.id}>
                      <td className="py-3 pr-4 text-malama-ink-dim text-xs whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="font-mono text-xs text-malama-ink" title={c.hexId}>
                          {c.hexId.slice(0, 10)}…
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          c.chain === 'base'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-violet-500/10 text-violet-400'
                        }`}>
                          {c.chain}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-mono text-malama-ink">
                        ${c.saleAmountUsd.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 font-mono font-black text-malama-accent">
                        +${c.commissionUsd.toFixed(2)}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-3">
                        {c.txHash ? (
                          <a
                            href={`https://basescan.org/tx/${c.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-malama-ink-faint hover:text-malama-accent transition-colors"
                          >
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-malama-ink-faint text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Payout info */}
        {data.pendingEarned > 0 && (
          <motion.div
            initial="hidden" animate="show" variants={fadeUp} custom={6}
            className="bg-amber-500/5 border border-amber-500/20 rounded-malama p-5 flex items-start gap-4"
          >
            <Clock size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-amber-400 text-sm mb-1">
                ${data.pendingEarned.toFixed(2)} USDC pending payout
              </p>
              <p className="text-xs text-malama-ink-dim leading-relaxed">
                Commissions are batched and paid weekly to{' '}
                <span className="font-mono text-malama-ink">
                  {data.partner.walletAddress.slice(0, 6)}…{data.partner.walletAddress.slice(-4)}
                </span>{' '}
                on Base network. No action needed from you.
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}

// ── Page root ─────────────────────────────────────────────────────────────────

export default function PartnersDashboardPage() {
  const { address, isConnected } = useAccount()
  const [data, setData] = useState<DashboardData | null>(null)
  const [status, setStatus] = useState<'loading' | 'found' | 'not-found' | 'idle'>('idle')

  const load = useCallback(async (addr: string) => {
    setStatus('loading')
    try {
      const res = await fetch(`/api/partners/me?address=${encodeURIComponent(addr)}`)
      if (res.status === 404) { setStatus('not-found'); return }
      const json = await res.json()
      setData(json)
      setStatus('found')
    } catch {
      setStatus('not-found')
    }
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      load(address)
    } else {
      setStatus('idle')
      setData(null)
    }
  }, [isConnected, address, load])

  if (!isConnected) return <ConnectWall />
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="min-h-screen bg-malama-bg flex items-center justify-center">
        <div className="flex items-center gap-3 text-malama-ink-dim">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-sm">Loading your dashboard…</span>
        </div>
      </div>
    )
  }
  if (status === 'not-found' || !data) return <NotFound address={address!} />
  return <Dashboard data={data} onRefresh={() => load(address!)} />
}
