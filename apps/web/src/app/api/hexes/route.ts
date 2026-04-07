import { NextResponse } from 'next/server'
import { generateHexGrid, hexToGeoJSON, calculateDataScore, calculateBasePrice } from '@/lib/h3'
import { cellToLatLng } from 'h3-js'
import idahoData from '@/data/idaho.json'

// Ray-casting algorithm for checking if a point is inside a polygon
function pointInPolygon(point: [number, number], vs: number[][]) {
  // point = [lng, lat], vs = array of [lng, lat]
  const x = point[0], y = point[1]
  let inside = false
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1]
    const xj = vs[j][0], yj = vs[j][1]
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

export async function GET() {
  const regions = [
    { lat: 45.5, lng: -114.0, radius: 450, res: 5 } // Center of Idaho, large radius to cover state bounds
  ]

  const idahoPolygon = idahoData.geometry.coordinates[0] as number[][]

  const allFeatures = regions.flatMap(region => {
    const hexes = generateHexGrid(region.lat, region.lng, region.radius, region.res)
    
    return hexes
      .map(hex => {
        const geojson = hexToGeoJSON(hex)
        const [lat, lng] = cellToLatLng(hex)
        return { geojson, lat, lng }
      })
      .filter(({ lat, lng }) => {
        // Strict boundary filter using Idaho Polygon
        return pointInPolygon([lng, lat], idahoPolygon)
      })
      .map(({ geojson, lat, lng }) => {
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
          uptime: status === 'active' ? +(98 + Math.random() * 2).toFixed(1) : 0
        })
        
        return geojson
      })
  })

  return NextResponse.json({
    type: 'FeatureCollection',
    features: allFeatures
  })
}
