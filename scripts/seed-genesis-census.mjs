/**
 * seed-genesis-census.mjs
 *
 * Regenerates apps/web/src/data/regions.json — 200 Genesis hexes at H3 res 4 — with:
 *   • >50%-water exclusion (true area via point-sampling vs Natural Earth ocean+lakes)
 *   • Native-reserved carve-out: hexes on US Census legal tribal land
 *     (Federal Reservations + Off-Reservation Trust + Hawaiian Home Lands),
 *     tagged for "Native Tribes first" allocation
 *   • 5 team-reserved lab cells (one per region)
 *   • Option A: everything fits within the 200 cap (5 team + native + public = 200)
 *
 * Outputs:
 *   apps/web/src/data/regions.json              { region: { cells: [...] } }
 *   apps/web/src/data/genesis-native-hexes.json { [hexId]: { name, region } }
 *
 * External data cached under scripts/.cache/. Usage: node scripts/seed-genesis-census.mjs
 */
import { latLngToCell, gridDisk, cellToLatLng, cellToBoundary } from 'h3-js'
import * as turf from '@turf/turf'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA = path.join(ROOT, 'apps/web/src/data')
const CACHE = path.join(__dirname, '.cache')
mkdirSync(CACHE, { recursive: true })

const RES = 4
const PER_REGION = 40
const NATIVE_PER_REGION_MAX = 8
const WATER_MAX = 0.5
const SAMPLE_N = 11 // 11×11 sampling grid per hex

const REGIONS = ['west', 'pacific', 'mountain', 'midwest', 'south']

const LAB = {
  west:     { lat: 34.0522,  lng: -118.2437 }, // Los Angeles
  pacific:  { lat: 21.3069,  lng: -157.8583 }, // Honolulu
  mountain: { lat: 39.7392,  lng: -104.9903 }, // Denver
  midwest:  { lat: 41.8781,  lng:  -87.6298 }, // Chicago
  south:    { lat: 32.7767,  lng:  -96.7970 }, // Dallas
}

const METRO_ANCHORS = {
  west: [[34.0522,-118.2437],[37.7749,-122.4194],[47.6062,-122.3321],[33.4484,-112.0740],[32.7157,-117.1611],[45.5051,-122.6750],[36.1699,-115.1398],[38.5816,-121.4944],[39.5296,-119.8138],[35.0844,-106.6504],[47.2529,-122.4443],[43.6150,-116.2023]],
  pacific: [[21.3069,-157.8583,0],[19.7071,-155.0885,0],[20.7984,-156.3319,0],[22.0964,-159.5261,0],[61.2181,-149.9003],[61.5806,-149.4420],[64.8378,-147.7164],[59.6425,-151.5053],[57.7944,-152.4072],[58.3005,-134.4197],[55.3422,-131.6461],[57.0531,-135.3300],[60.4720,-145.7690],[56.8131,-132.9573],[63.3363,-142.9865],[62.9597,-155.5984],[63.8610,-148.9598]],
  mountain: [[39.7392,-104.9903],[40.7608,-111.8910],[40.2338,-111.6585],[43.6150,-116.2023],[47.6547,-116.7803],[46.7298,-117.0002],[43.6860,-114.3635],[42.5630,-114.4609],[43.1566,-112.3373],[43.4886,-112.0422],[38.8339,-104.8214],[46.8721,-96.7898],[43.5473,-96.7283],[44.5000,-103.8700],[43.0760,-108.9666]],
  midwest: [[41.8781,-87.6298],[44.9778,-93.2650],[42.3314,-83.0458],[43.0389,-87.9065],[41.4993,-81.6944],[39.9612,-82.9988],[39.7684,-86.1581],[38.6270,-90.1994],[39.0997,-94.5786],[43.0750,-89.4000],[41.2524,-95.9980],[41.5868,-93.6250]],
  south: [[32.7767,-96.7970],[29.7604,-95.3698],[33.7490,-84.3880],[25.7617,-80.1918],[38.9072,-77.0369],[40.7128,-74.0060],[30.2672,-97.7431],[36.1627,-86.7816],[35.2271,-80.8431],[39.9526,-75.1652],[42.3601,-71.0589],[37.5407,-77.4360]],
}

async function cachedJson(name, url) {
  const f = path.join(CACHE, name)
  if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8'))
  process.stdout.write(`  fetching ${name}… `)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${name} failed: ${res.status}`)
  const j = await res.json()
  writeFileSync(f, JSON.stringify(j))
  console.log(`ok (${(JSON.stringify(j).length / 1e6).toFixed(1)}MB)`)
  return j
}

// hex cell → turf polygon ([lng,lat] ring, closed)
function hexPolygon(cell) {
  const ring = cellToBoundary(cell).map(([lat, lng]) => [lng, lat])
  ring.push(ring[0])
  return turf.polygon([ring])
}

// fraction of hex area that is water, by sampling points inside the hex
function waterFraction(cell, ocean, lakes) {
  const poly = hexPolygon(cell)
  const [minX, minY, maxX, maxY] = turf.bbox(poly)
  let inside = 0, water = 0
  for (let i = 0; i < SAMPLE_N; i++) {
    for (let j = 0; j < SAMPLE_N; j++) {
      const lng = minX + ((maxX - minX) * (i + 0.5)) / SAMPLE_N
      const lat = minY + ((maxY - minY) * (j + 0.5)) / SAMPLE_N
      const pt = turf.point([lng, lat])
      if (!turf.booleanPointInPolygon(pt, poly)) continue
      inside++
      if (turf.booleanPointInPolygon(pt, ocean) || lakes.some((l) => turf.booleanPointInPolygon(pt, l))) water++
    }
  }
  return inside ? water / inside : 1
}

// reservation name if the hex centroid sits on tribal land, else null
function nativeName(cell, reservations) {
  const [lat, lng] = cellToLatLng(cell)
  const pt = turf.point([lng, lat])
  for (const r of reservations) {
    if (r._bbox && (lng < r._bbox[0] || lng > r._bbox[2] || lat < r._bbox[1] || lat > r._bbox[3])) continue
    if (turf.booleanPointInPolygon(pt, r)) return r.properties?.NAME ?? 'Tribal land'
    if (r.geometry?.type === 'MultiPolygon' && turf.booleanPointInPolygon(pt, r)) return r.properties?.NAME ?? 'Tribal land'
  }
  return null
}

function nearestRegion(lat, lng) {
  let best = REGIONS[0], bestD = Infinity
  for (const r of REGIONS) {
    const d = turf.distance(turf.point([lng, lat]), turf.point([LAB[r].lng, LAB[r].lat]))
    if (d < bestD) { bestD = d; best = r }
  }
  return best
}

async function main() {
  console.log('Loading data…')
  const oceanFC = await cachedJson('ne_50m_ocean.geojson', 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_ocean.geojson')
  const lakesFC = await cachedJson('ne_50m_lakes.geojson', 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_lakes.geojson')
  const ocean = oceanFC.features[0]
  // US-area lakes only (perf): bbox intersect continental US + AK/HI
  const lakes = lakesFC.features.filter((f) => {
    const b = turf.bbox(f)
    return b[2] > -170 && b[0] < -66 && b[3] > 17 && b[1] < 72
  })

  // Census legal tribal land: 2=Federal Reservations, 3=Off-Reservation Trust, 5=Hawaiian Home Lands
  const reservations = []
  for (const layer of [2, 3, 5]) {
    const fc = await cachedJson(
      `census_aiannh_${layer}.geojson`,
      `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/AIANNHA/MapServer/${layer}/query?where=1%3D1&outFields=NAME&outSR=4326&f=geojson`,
    )
    for (const f of fc.features || []) { f._bbox = turf.bbox(f); reservations.push(f) }
  }
  console.log(`Reservations: ${reservations.length} polygons; lakes(US): ${lakes.length}`)

  // Build native candidate cells from reservation centroids
  const nativeByRegion = Object.fromEntries(REGIONS.map((r) => [r, []]))
  const nativeSeen = new Set()
  for (const r of reservations) {
    let c
    try { c = turf.centroid(r) } catch { continue }
    const [lng, lat] = c.geometry.coordinates
    const cell = latLngToCell(lat, lng, RES)
    if (nativeSeen.has(cell)) continue
    if (waterFraction(cell, ocean, lakes) > WATER_MAX) continue
    nativeSeen.add(cell)
    nativeByRegion[nearestRegion(lat, lng)].push({ cell, name: r.properties?.NAME ?? 'Tribal land' })
  }

  const result = {}
  const nativeManifest = {}
  const globalSeen = new Set()
  // reserve lab cells
  const labCells = Object.fromEntries(REGIONS.map((r) => [r, latLngToCell(LAB[r].lat, LAB[r].lng, RES)]))
  Object.values(labCells).forEach((c) => globalSeen.add(c))

  for (const region of REGIONS) {
    const cells = []
    const labCell = labCells[region]
    cells.push(labCell) // team-reserved, first

    // native carve-out (up to max), water-clean, not already used
    let nativeUsed = 0
    for (const n of nativeByRegion[region]) {
      if (nativeUsed >= NATIVE_PER_REGION_MAX) break
      if (globalSeen.has(n.cell)) continue
      globalSeen.add(n.cell); cells.push(n.cell); nativeManifest[n.cell] = { name: n.name, region }
      nativeUsed++
    }

    // public fill from metro ring-1 candidates
    for (const anchor of METRO_ANCHORS[region]) {
      if (cells.length >= PER_REGION) break
      const [lat, lng, diskR = 1] = anchor
      const center = latLngToCell(lat, lng, RES)
      for (const cell of gridDisk(center, diskR)) {
        if (cells.length >= PER_REGION) break
        if (globalSeen.has(cell)) continue
        if (waterFraction(cell, ocean, lakes) > WATER_MAX) continue
        globalSeen.add(cell); cells.push(cell)
      }
    }

    result[region] = { cells }
    console.log(`${region}: ${cells.length} cells (1 team, ${nativeUsed} native, ${cells.length - 1 - nativeUsed} public)`)
  }

  const total = Object.values(result).reduce((s, r) => s + r.cells.length, 0)
  const nativeTotal = Object.keys(nativeManifest).length
  console.log(`\nTOTAL: ${total} hexes · 5 team · ${nativeTotal} native-reserved · ${total - 5 - nativeTotal} public`)

  writeFileSync(path.join(DATA, 'regions.json'), JSON.stringify(result, null, 2))
  writeFileSync(path.join(DATA, 'genesis-native-hexes.json'), JSON.stringify(nativeManifest, null, 2))
  console.log('Wrote regions.json + genesis-native-hexes.json')
}

main().catch((e) => { console.error(e); process.exit(1) })
