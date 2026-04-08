import { NextResponse } from 'next/server'
import { hexToGeoJSON, calculateDataScore, calculateBasePrice } from '@/lib/h3'
import { cellToLatLng } from 'h3-js'
import regionsData from '@/data/regions.json'

export async function GET() {
  const allHexStrings = [
    ...(regionsData.idaho || []),
    ...(regionsData.nyc || []),
    ...(regionsData.london || []),
    ...(regionsData.tokyo || [])
  ]

  const allFeatures = allHexStrings.map(hex => {
    const geojson = hexToGeoJSON(hex)
    const [lat, lng] = cellToLatLng(hex)
    
    const rand = Math.random()
    let status = 'available'
    if (rand > 0.7 && rand <= 0.85) status = 'reserved'
    else if (rand > 0.85 && rand <= 0.95) status = 'active'
    else if (rand > 0.95) status = 'auction'

    const dataScore = calculateDataScore(lat, lng)
    const startingBid = calculateBasePrice(lat, lng)

    Object.assign(geojson.properties as Record<string, unknown>, {
      status,
      dataScore,
      startingBid,
      activeSensors: status === 'active' ? Math.floor(Math.random() * 5) + 1 : 0,
      uptime: status === 'active' ? +(98 + Math.random() * 2).toFixed(1) : 0,
      overlap: Math.random() > 0.8
    })

    return geojson
  })

  return NextResponse.json({
    type: 'FeatureCollection',
    features: allFeatures
  })
}
