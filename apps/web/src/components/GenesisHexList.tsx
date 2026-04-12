'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Hexagon,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  PanelRight,
} from 'lucide-react'
import type { GenesisHexListItem, GenesisRegionKey } from '@/lib/genesis-hexes'
import { GENESIS_REGION_KEYS, GENESIS_REGION_LABELS } from '@/lib/genesis-hexes'
import type { GenesisClaim } from '@/lib/genesis-claim-registry'
import { formatGenesisListingUsd } from '@/lib/h3'
import GenesisHexDetail from './GenesisHexDetail'

type ApiResponse = {
  genesisHexCap: number
  slotsPerRegion: number
  count: number
  items: GenesisHexListItem[]
}

const STATUS_STYLES: Record<GenesisHexListItem['status'], string> = {
  available: 'bg-malama-accent/20 text-malama-accent border-malama-accent/30',
  reserved: 'bg-gray-600/40 text-gray-300 border-gray-600/50',
}

const SOLD_BADGE =
  'bg-gray-700/50 text-gray-200 border-gray-500/60'

function statusBadge(row: GenesisHexListItem): { label: string; className: string } {
  if (row.sold) return { label: 'SOLD', className: SOLD_BADGE }
  return { label: row.status, className: STATUS_STYLES[row.status] }
}

type ScoreSort = 'none' | 'desc' | 'asc'

export default function GenesisHexList({ className = '' }: { className?: string }) {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState<GenesisRegionKey | 'all'>('all')
  const [query, setQuery] = useState('')
  const [scoreSort, setScoreSort] = useState<ScoreSort>('none')
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<GenesisHexListItem | null>(null)
  const [detailClaim, setDetailClaim] = useState<GenesisClaim | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/hexes/list')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = (await res.json()) as ApiResponse
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    if (!data?.items) return []
    const q = query.trim().toLowerCase()
    return data.items.filter((row) => {
      if (region !== 'all' && row.region !== region) return false
      if (!q) return true
      return (
        row.hexId.toLowerCase().includes(q) ||
        row.regionLabel.toLowerCase().includes(q) ||
        row.status.includes(q) ||
        (row.sold && 'sold'.startsWith(q))
      )
    })
  }, [data, region, query])

  const sortedFiltered = useMemo(() => {
    const arr = [...filtered]
    if (scoreSort === 'desc') arr.sort((a, b) => b.dataScore - a.dataScore)
    else if (scoreSort === 'asc') arr.sort((a, b) => a.dataScore - b.dataScore)
    return arr
  }, [filtered, scoreSort])

  const cycleScoreSort = useCallback(() => {
    setScoreSort((s) => (s === 'none' ? 'desc' : s === 'desc' ? 'asc' : 'none'))
  }, [])

  const openDetail = useCallback(async (row: GenesisHexListItem) => {
    setDetailItem(row)
    setDetailClaim(null)
    setDetailOpen(true)
    try {
      const res = await fetch(`/api/hexes/by-id/${encodeURIComponent(row.hexId)}`)
      if (res.ok) {
        const j = (await res.json()) as { item: GenesisHexListItem; claim: GenesisClaim | null }
        setDetailClaim(j.claim)
      }
    } catch {
      /* keep null claim */
    }
  }, [])

  useEffect(() => {
    if (!detailOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [detailOpen])

  return (
    <section
      className={`flex flex-col min-h-0 h-full bg-malama-deep/95 ${className}`}
      aria-label="Genesis 200 hex license list"
    >
      <div className="shrink-0 p-4 border-b border-gray-800 space-y-3">
        <div className="flex items-center gap-2">
          <Hexagon className="w-5 h-5 text-malama-teal shrink-0" />
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tight">Genesis hex inventory</h2>
            {data && (
              <p className="text-[11px] font-mono text-gray-500 mt-0.5">
                {data.count} of {data.genesisHexCap} licenses in pool · {data.slotsPerRegion} per region
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search hex ID or region…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/40 border border-gray-800 text-sm text-white placeholder:text-gray-600 focus:border-malama-teal focus:outline-none"
            />
          </div>
          <div className="relative shrink-0">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as GenesisRegionKey | 'all')}
              className="w-full sm:w-44 pl-9 pr-3 py-2 rounded-lg bg-black/40 border border-gray-800 text-sm text-white focus:border-malama-teal focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All regions</option>
              {GENESIS_REGION_KEYS.map((k) => (
                <option key={k} value={k}>
                  {GENESIS_REGION_LABELS[k]}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={cycleScoreSort}
            className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-800 bg-black/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:border-malama-teal hover:text-malama-teal md:hidden"
          >
            Score
            {scoreSort === 'desc' && <ChevronDown className="h-4 w-4" />}
            {scoreSort === 'asc' && <ChevronUp className="h-4 w-4" />}
            {scoreSort === 'none' && <ArrowUpDown className="h-4 w-4 opacity-50" />}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-malama-teal">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-mono">Loading Genesis pool…</span>
          </div>
        )}
        {error && (
          <p className="p-4 text-sm text-red-400 font-mono">{error}</p>
        )}
        {!loading && !error && data && (
          <>
            <div className="hidden md:block">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-malama-deep border-b border-gray-800">
                  <tr className="text-gray-500 font-bold uppercase tracking-wider">
                    <th className="p-3 font-mono">Hex (H3)</th>
                    <th className="p-3">Region</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">
                      <button
                        type="button"
                        onClick={cycleScoreSort}
                        className="inline-flex items-center gap-1 rounded-lg px-1 py-0.5 text-gray-500 hover:bg-white/5 hover:text-malama-teal"
                        title="Sort by score"
                      >
                        Score
                        {scoreSort === 'desc' && <ChevronDown className="h-3.5 w-3.5 text-malama-teal" />}
                        {scoreSort === 'asc' && <ChevronUp className="h-3.5 w-3.5 text-malama-teal" />}
                        {scoreSort === 'none' && <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />}
                      </button>
                    </th>
                    <th className="p-3 text-right">Listing</th>
                    <th className="p-3 text-right">Genesis</th>
                    <th className="p-3 text-right w-28">Detail</th>
                    <th className="p-3 text-right w-24">Reserve</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFiltered.map((row) => {
                    const badge = statusBadge(row)
                    return (
                    <tr
                      key={row.hexId}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer border-b border-gray-800/80 hover:bg-white/5"
                      onClick={() => openDetail(row)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          openDetail(row)
                        }
                      }}
                    >
                      <td className="p-3 font-mono text-[11px] text-gray-300 break-all max-w-[140px]">
                        {row.hexId}
                      </td>
                      <td className="p-3 text-gray-300">{row.regionLabel}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded border text-[10px] font-black uppercase ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-malama-teal">{row.dataScore}</td>
                      <td className="p-3 text-right font-mono text-gray-300">
                        {formatGenesisListingUsd(row.startingBid)}
                      </td>
                      <td className="p-3 text-right">
                        <span className="font-black text-white">{formatGenesisListingUsd(row.genesisPriceUsd)}</span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="inline-flex flex-col items-end gap-1">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-malama-teal hover:underline"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDetail(row)
                            }}
                          >
                            <PanelRight className="h-3.5 w-3.5" />
                            View
                          </button>
                          <Link
                            href={`/list/${encodeURIComponent(row.hexId)}`}
                            className="text-[10px] font-mono text-gray-500 hover:text-gray-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Full page
                          </Link>
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {row.status === 'available' ? (
                          <Link
                            href={`/presale?hex=${encodeURIComponent(row.hexId)}`}
                            className="text-malama-accent hover:text-malama-accent-dim text-[11px] font-black uppercase"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Reserve
                          </Link>
                        ) : (
                          <span className="text-gray-600 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  )
                  })}
                </tbody>
              </table>
            </div>

            <ul className="md:hidden divide-y divide-gray-800">
              {sortedFiltered.map((row) => {
                const badge = statusBadge(row)
                return (
                <li key={row.hexId} className="p-4 space-y-3">
                  <button
                    type="button"
                    className="w-full space-y-2 text-left"
                    onClick={() => openDetail(row)}
                  >
                    <div className="flex justify-between gap-2">
                      <span className="font-mono text-[10px] text-gray-400 break-all">{row.hexId}</span>
                      <span className={`shrink-0 px-2 py-0.5 rounded border text-[10px] font-black uppercase ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{row.regionLabel}</span>
                      <span className="text-malama-teal font-mono">{row.dataScore}/100</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>List {formatGenesisListingUsd(row.startingBid)}</span>
                      <span className="text-white font-bold">{formatGenesisListingUsd(row.genesisPriceUsd)} reserve</span>
                    </div>
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 rounded-lg border border-gray-700 py-2 text-xs font-black uppercase text-malama-teal"
                      onClick={() => openDetail(row)}
                    >
                      Details
                    </button>
                    <Link
                      href={`/list/${encodeURIComponent(row.hexId)}`}
                      className="flex-1 rounded-lg border border-gray-700 py-2 text-center text-xs font-medium text-gray-400"
                    >
                      Full page
                    </Link>
                  </div>
                  {row.status === 'available' && (
                    <Link
                      href={`/presale?hex=${encodeURIComponent(row.hexId)}`}
                      className="block w-full py-2 text-center rounded-lg bg-malama-accent-dim text-white text-xs font-black uppercase"
                    >
                      Reserve
                    </Link>
                  )}
                </li>
                )
              })}
            </ul>

            {sortedFiltered.length === 0 && (
              <p className="p-8 text-center text-sm text-gray-500">No hexes match your filters.</p>
            )}
          </>
        )}
      </div>

      <div className="shrink-0 p-3 border-t border-gray-800 text-[10px] text-gray-600 font-mono text-center">
        Illustrative listing prices; Genesis entry is $2,000 USDC per operator terms.
      </div>

      <GenesisHexDetail
        item={detailItem}
        claim={detailClaim}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false)
          setDetailItem(null)
          setDetailClaim(null)
        }}
      />
    </section>
  )
}
