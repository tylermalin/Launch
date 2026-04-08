import { cellToBoundary } from 'h3-js'

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
