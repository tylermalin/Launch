'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Loader2, MapPin, Hexagon } from 'lucide-react'
import HexBoundaryPreview from './HexBoundaryPreview'
import { resolveContainingCell } from '@/lib/hex-lookup'
import { parseForwardSuggestions, type AddressSuggestion } from '@/lib/mapbox-geocode'

type Selected = {
  hexId: string
  label: string
  sublabel: string
}

/**
 * Address → Hex lookup (Slice 1, read-only).
 * Type an address, pick a suggestion, and see the Res-4 H3 cell that contains it.
 * Reservation / status CTAs land in later slices.
 */
export default function AddressHexLookup({ className = '' }: { className?: string }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Selected | null>(null)
  const [open, setOpen] = useState(false)
  const justSelected = useRef(false)

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
        const params = new URLSearchParams({
          q,
          autocomplete: 'true',
          limit: '5',
          access_token: token,
        })
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

  function pick(s: AddressSuggestion) {
    const hexId = resolveContainingCell(s.lat, s.lng)
    justSelected.current = true
    setSelected({ hexId, label: s.label, sublabel: s.sublabel })
    setQuery(s.label)
    setSuggestions([])
    setOpen(false)
  }

  if (!token) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-center text-sm text-amber-200/90 ${className}`}
      >
        <MapPin className="mb-2 h-8 w-8 opacity-70" />
        Add <span className="font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</span> to enable address lookup.
      </div>
    )
  }

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
          <ul
            className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-700 bg-[#0d1829] shadow-xl"
            role="listbox"
          >
            {suggestions.map((s) => (
              <li key={s.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => pick(s)}
                  className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-malama-teal/10"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-malama-teal" aria-hidden />
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-white">{s.label}</span>
                    {s.sublabel && (
                      <span className="block truncate text-xs text-gray-500">{s.sublabel}</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div className="mt-4">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-malama-teal/30 bg-malama-teal/5 px-3 py-2">
            <Hexagon className="h-4 w-4 shrink-0 text-malama-teal" aria-hidden />
            <div className="min-w-0 text-sm">
              <p className="truncate text-white">{selected.label} sits in this Res-4 hex:</p>
              <p className="font-mono text-[11px] text-malama-teal">{selected.hexId}</p>
            </div>
          </div>
          <HexBoundaryPreview hexId={selected.hexId} />
        </div>
      )}
    </div>
  )
}
