import { cellToBoundary } from 'h3-js'

/** Stable [0, 1) from hex id + salt (no Math.random). */
export function hexIdUnit(hexId: string, salt: number): number {
  let h = 2166136261 ^ salt
  const s = `${hexId}:${salt}`
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (Math.abs(h) % 1_000_000) / 1_000_000
}

export function hexToGeoJSON(h3Index: string) {
  const boundary = cellToBoundary(h3Index, true)
  if (boundary.length > 0) {
    boundary.push(boundary[0])
  }

  return {
    type: "Feature" as const,
    geometry: {
      type: "Polygon" as const,
      coordinates: [boundary]
    },
    properties: {
      id: h3Index
    }
  }
}

export function calculateDataScore(lat: number, lng: number): number {
  let score = 40 + (Math.random() * 20)
  
  // NYC, London, Tokyo, etc.
  const highProfile = [
    { lat: 43.5, lng: -112.5, radius: 2 }, // Idaho
    { lat: 40.71, lng: -74.0, radius: 1.5 }, // NYC
    { lat: 51.5, lng: -0.12, radius: 1.5 }, // London
    { lat: 35.67, lng: 139.65, radius: 1.5 } // Tokyo
  ]

  for (const region of highProfile) {
    const dist = Math.sqrt(Math.pow(lat - region.lat, 2) + Math.pow(lng - region.lng, 2))
    if (dist < region.radius) {
      score += 30 + (Math.random() * 10)
    }
  }
  
  return Math.min(100, Math.floor(score))
}

export function calculateDataScoreDeterministic(lat: number, lng: number, hexId: string): number {
  let score = 40 + hexIdUnit(hexId, 1) * 20
  const highProfile = [
    { lat: 43.5, lng: -112.5, radius: 2 },
    { lat: 40.71, lng: -74.0, radius: 1.5 },
    { lat: 51.5, lng: -0.12, radius: 1.5 },
    { lat: 35.67, lng: 139.65, radius: 1.5 },
  ]
  for (let i = 0; i < highProfile.length; i++) {
    const region = highProfile[i]
    const dist = Math.sqrt(Math.pow(lat - region.lat, 2) + Math.pow(lng - region.lng, 2))
    if (dist < region.radius) {
      score += 30 + hexIdUnit(hexId, 10 + i) * 10
    }
  }
  return Math.min(100, Math.floor(score))
}

export function calculateBasePrice(lat: number, lng: number): number {
  let price = 150 + Math.floor(Math.random() * 100)
  
  // NYC, London, Tokyo boost
  const premium = [
    { lat: 40.71, lng: -74.0, radius: 1 }, // NYC
    { lat: 51.5, lng: -0.12, radius: 1 }, // London
    { lat: 35.67, lng: 139.65, radius: 1 } // Tokyo
  ]

  for (const region of premium) {
    const dist = Math.sqrt(Math.pow(lat - region.lat, 2) + Math.pow(lng - region.lng, 2))
    if (dist < region.radius) {
      price += 1200 // Strong premium for settlement hubs
    }
  }
  
  return price
}

export function calculateBasePriceDeterministic(lat: number, lng: number, hexId: string): number {
  let price = 150 + Math.floor(hexIdUnit(hexId, 2) * 100)
  const premium = [
    { lat: 40.71, lng: -74.0, radius: 1 },
    { lat: 51.5, lng: -0.12, radius: 1 },
    { lat: 35.67, lng: 139.65, radius: 1 },
  ]
  for (let i = 0; i < premium.length; i++) {
    const region = premium[i]
    const dist = Math.sqrt(Math.pow(lat - region.lat, 2) + Math.pow(lng - region.lng, 2))
    if (dist < region.radius) {
      price += 1200
    }
  }
  return price
}

/** Genesis node reserve / listing price (USD); always ≥ {@link GENESIS_ENTRY_USD}. */
export const GENESIS_ENTRY_USD = 2000

export function formatGenesisListingUsd(amount: number | string): string {
  const n = typeof amount === 'number' ? amount : Number(amount)
  const safe = Number.isFinite(n) ? n : 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safe)
}

/**
 * Listing price for Genesis inventory (map + API). Floor matches Genesis entry; hub cells get extra spread.
 */
export function calculateGenesisListingPriceDeterministic(
  lat: number,
  lng: number,
  hexId: string
): number {
  const spread = Math.floor(hexIdUnit(hexId, 5) * 400)
  const premium = [
    { lat: 40.71, lng: -74.0, radius: 1 },
    { lat: 51.5, lng: -0.12, radius: 1 },
    { lat: 35.67, lng: 139.65, radius: 1 },
  ]
  let hub = 0
  for (let i = 0; i < premium.length; i++) {
    const region = premium[i]
    const dist = Math.sqrt(Math.pow(lat - region.lat, 2) + Math.pow(lng - region.lng, 2))
    if (dist < region.radius) {
      hub = Math.max(hub, Math.floor(hexIdUnit(hexId, 20 + i) * 800))
    }
  }
  return GENESIS_ENTRY_USD + spread + hub
}
