'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Loader2, MapPin, Hexagon, Check } from 'lucide-react'
import HexBoundaryPreview from './HexBoundaryPreview'
import { resolveContainingCell, neighborCells } from '@/lib/hex-lookup'
import { cellStatusCta, type CellStatusResult } from '@/lib/cell-status'
import { parseForwardSuggestions, type AddressSuggestion } from '@/lib/mapbox-geocode'
import { formatGenesisListingUsd } from '@/lib/h3'

type Selected = { hexId: string; label: string; sublabel: string; lat: number; lng: number }

/**
 * Address → Hex lookup & reserve (Slices 1–4).
 * Type an address, see the Res-4 cell that contains it, and act on its status:
 * mint a curated cell, place a global hold, or pick an available neighbour.
 */
export default function AddressHexLookup({ className = '' }: { className?: string }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const justSelected = useRef(false)

  const [selected, setSelected] = useState<Selected | null>(null)
  const [status, setStatus] = useState<CellStatusResult | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [nearby, setNearby] = useState<CellStatusResult[]>([])

  const [holdEmail, setHoldEmail] = useState('')
  const [holdState, setHoldState] = useState<'idle' | 'submitting' | 'error'>('idle')

  // Debounced forward geocode (Mapbox Search API v6 forward, autocomplete).
  useEffect(() => {
    if (!token) return
    if (justSelected.current) {
      justSelected.current = false
      return
    }
    const q = query.trim()
    if (q.length < 3) {
      setSuggestions([])
      return
    }
    let cancelled = false
    setLoading(true)
    const handle = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q, autocomplete: 'true', limit: '5', access_token: token })
        const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params}`)
        const data = await res.json()
        if (cancelled) return
        setSuggestions(parseForwardSuggestions(data))
        setOpen(true)
      } catch {
        if (!cancelled) setSuggestions([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(handle)
    }
  }, [query, token])

  // Resolve the selected cell's status (and refetch after a hold).
  async function loadStatus(sel: Selected) {
    setStatusLoading(true)
    setNearby([])
    try {
      const res = await fetch(`/api/hexes/resolve?hex=${sel.hexId}`)
      const data: CellStatusResult = await res.json()
      setStatus(data)
      // For taken / native cells, surface available neighbours.
      if (data.status === 'curated-taken' || data.status === 'global-held' || data.status === 'native') {
        const ring = neighborCells(sel.hexId)
        const resolved = await Promise.all(
          ring.map((id) => fetch(`/api/hexes/resolve?hex=${id}`).then((r) => r.json() as Promise<CellStatusResult>)),
        )
        setNearby(resolved.filter((c) => c.status === 'curated-available' || c.status === 'global-available'))
      }
    } finally {
      setStatusLoading(false)
    }
  }

  function selectCell(sel: Selected) {
    justSelected.current = true
    setSelected(sel)
    setStatus(null)
    setHoldState('idle')
    setQuery(sel.label)
    setSuggestions([])
    setOpen(false)
    void loadStatus(sel)
  }

  function pick(s: AddressSuggestion) {
    selectCell({ hexId: resolveContainingCell(s.lat, s.lng), label: s.label, sublabel: s.sublabel, lat: s.lat, lng: s.lng })
  }

  async function placeHold() {
    if (!selected || !holdEmail.trim()) return
    setHoldState('submitting')
    try {
      const res = await fetch('/api/holds', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: holdEmail.trim(), lat: selected.lat, lng: selected.lng }),
      })
      if (!res.ok) throw new Error()
      await loadStatus(selected) // now global-held
      setHoldState('idle')
    } catch {
      setHoldState('error')
    }
  }

  if (!token) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-center text-sm text-amber-200/90 ${className}`}>
        <MapPin className="mb-2 h-8 w-8 opacity-70" />
        Add <span className="font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</span> to enable address lookup.
      </div>
    )
  }

  const cta = status ? cellStatusCta(status.status) : null

  return (
    <div className={className}>
      <label htmlFor="address-hex-search" className="mb-2 block text-sm font-medium text-gray-300">
        Find the hex for your address
      </label>

      <div className="relative">
        <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-[#0a121f] px-3 py-2 focus-within:border-malama-teal">
          <Search className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
          <input
            id="address-hex-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Enter a street address…"
            autoComplete="off"
            className="w-full bg-transparent text-sm text-white placeholder-gray-600 outline-none"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-500" aria-hidden />}
        </div>

        {open && suggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-700 bg-[#0d1829] shadow-xl" role="listbox">
            {suggestions.map((s) => (
              <li key={s.id} role="option" aria-selected={false}>
                <button type="button" onClick={() => pick(s)} className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-malama-teal/10">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-malama-teal" aria-hidden />
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-white">{s.label}</span>
                    {s.sublabel && <span className="block truncate text-xs text-gray-500">{s.sublabel}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-malama-teal/30 bg-malama-teal/5 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <Hexagon className="h-4 w-4 shrink-0 text-malama-teal" aria-hidden />
              <div className="min-w-0 text-sm">
                <p className="truncate text-white">{selected.label}</p>
                <p className="font-mono text-[11px] text-malama-teal">{selected.hexId}</p>
              </div>
            </div>
            {status && (
              <span className="shrink-0 font-mono text-sm text-white">{formatGenesisListingUsd(status.priceUsd)}</span>
            )}
          </div>

          <HexBoundaryPreview hexId={selected.hexId} />

          {/* Status-driven CTA */}
          <div className="mt-3">
            {statusLoading || !cta ? (
              <p className="flex items-center gap-2 text-xs text-gray-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking availability…
              </p>
            ) : cta.action === 'mint' ? (
              <a
                href={`/presale?hex=${selected.hexId}`}
                className="block w-full rounded-lg bg-malama-teal py-2.5 text-center text-sm font-semibold text-[#04121a] hover:opacity-90"
              >
                {cta.label}
              </a>
            ) : cta.action === 'hold' ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-400">
                  This cell is outside the Genesis 200. Reserve it with a free 30-day hold — you’ll get first claim when its round opens.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={holdEmail}
                    onChange={(e) => setHoldEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full rounded-lg border border-gray-700 bg-[#0a121f] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-malama-teal"
                  />
                  <button
                    type="button"
                    onClick={placeHold}
                    disabled={holdState === 'submitting' || !holdEmail.trim()}
                    className="shrink-0 rounded-lg bg-malama-teal px-4 py-2 text-sm font-semibold text-[#04121a] hover:opacity-90 disabled:opacity-50"
                  >
                    {holdState === 'submitting' ? '…' : 'Reserve'}
                  </button>
                </div>
                {holdState === 'error' && <p className="text-xs text-red-400">Couldn’t place the hold — try again.</p>}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-700 bg-[#0a121f] px-3 py-2.5 text-center text-sm text-gray-400">
                {status?.status === 'global-held' ? (
                  <span className="flex items-center justify-center gap-1.5"><Check className="h-4 w-4 text-malama-teal" /> {cta.label}</span>
                ) : (
                  cta.label
                )}
              </div>
            )}
          </div>

          {/* Nearby available cells when this one is taken */}
          {nearby.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs text-gray-500">Available nearby:</p>
              <div className="flex flex-wrap gap-1.5">
                {nearby.map((n) => (
                  <button
                    key={n.hexId}
                    type="button"
                    onClick={() => selectCell({ hexId: n.hexId, label: 'Nearby cell', sublabel: '', lat: n.lat, lng: n.lng })}
                    className="rounded-full border border-malama-teal/40 bg-malama-teal/5 px-3 py-1 font-mono text-[11px] text-malama-teal hover:bg-malama-teal/15"
                  >
                    {n.hexId.slice(0, 8)}… · {formatGenesisListingUsd(n.priceUsd)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
