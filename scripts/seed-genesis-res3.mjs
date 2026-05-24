/**
 * seed-genesis-res3.mjs
 *
 * Generates apps/web/src/data/regions.json for 200 Genesis Hex Nodes at
 * H3 Resolution 4 (~1,770 km² / cell — city-metro scale).
 *
 * Strategy: tight city clusters — gridDisk(major_metro, 1) only.
 * No remote/rural fallback expansion. All cells within ~120 km of a major city.
 * 100%-water cells (centroid over ocean/lake) are excluded.
 *
 * 5 regions × 40 cells = 200 unique hexes.
 *
 * Usage:
 *   node scripts/seed-genesis-res3.mjs
 */

import { latLngToCell, gridDisk, cellToLatLng } from 'h3-js'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(__dirname, '../apps/web/src/data/regions.json')

const RES = 4
const TARGET = 40
const DISK_R = 1   // ring-1 = 7 cells per anchor (center + 6 neighbors)

// ── Water detection (inlined from lib/hex-geo.ts) ──────────────────────────

function isOverOcean(lat, lng) {
  if (lng < -125.0 && lat > 23.0 && lat < 60.0) return true   // Pacific west of US
  if (lng < -162.0 && lat > 17.0 && lat < 29.0) return true   // Pacific west of Hawaii
  if (lng > -60.0  && lat > 24.0 && lat < 50.0) return true   // Atlantic
  if (lat > 23.0 && lat < 30.5 && lng > -98.0 && lng < -80.0) return true  // Gulf of Mexico

  // Hawaiian islands — per-island checks to avoid wrongly marking inter-island ocean as land.
  // A broad bbox around all of Hawaii would cover ocean gaps between islands.
  if (lat > 21.7 && lat < 22.4 && lng > -160.2 && lng < -159.0) return false // Kauai
  if (lat > 21.0 && lat < 21.8 && lng > -158.7 && lng < -157.4) return false // Oahu
  if (lat > 20.4 && lat < 21.3 && lng > -157.5 && lng < -156.5) return false // Molokai/Lanai
  if (lat > 20.4 && lat < 21.1 && lng > -156.9 && lng < -155.9) return false // Maui
  if (lat > 18.8 && lat < 20.5 && lng > -156.2 && lng < -154.3) return false // Big Island

  // Pacific Ocean around / between Hawaiian islands
  if (lat > 17.0 && lat < 25.0 && lng > -163.0 && lng < -154.0) return true

  if (lat > 71.0) return true  // Arctic Ocean
  if (lng < -168.0 && lat > 54.0) return true  // Bering Sea
  if (lat > 59.0 && lat < 62.0 && lng > -153.0 && lng < -150.5) return true  // Cook Inlet AK (excludes Anchorage at -149.9)
  return false
}

function isOverLake(lat, lng) {
  if (lat > 41.5 && lat < 46.5 && lng > -92.5 && lng < -76.0) {
    if (lat > 46.0 && lat < 49.0 && lng > -92.5 && lng < -84.0) return true  // Superior
    if (lat > 41.5 && lat < 46.0 && lng > -88.0 && lng < -84.5) return true  // Michigan
    if (lat > 43.5 && lat < 46.5 && lng > -84.5 && lng < -79.5) return true  // Huron
    if (lat > 41.5 && lat < 43.0 && lng > -83.5 && lng < -78.5) return true  // Erie
    if (lat > 43.0 && lat < 44.5 && lng > -79.5 && lng < -76.0) return true  // Ontario
  }
  if (lat > 40.7 && lat < 41.7 && lng > -113.2 && lng < -112.0) return true  // Great Salt Lake
  return false
}

function isLandCell(cell) {
  const [lat, lng] = cellToLatLng(cell)
  return !isOverOcean(lat, lng) && !isOverLake(lat, lng)
}

// ── Lab node anchors (one per region, always first in cells array) ─────────

const LAB = {
  west:     { label: 'Los Angeles',   lat: 34.0522,  lng: -118.2437 },
  pacific:  { label: 'Honolulu',      lat: 21.3069,  lng: -157.8583 },
  mountain: { label: 'Denver',        lat: 39.7392,  lng: -104.9903 },
  midwest:  { label: 'Chicago',       lat: 41.8781,  lng:  -87.6298 },
  south:    { label: 'Dallas',        lat: 32.7767,  lng:  -96.7970 },
}

// ── Metro anchors: 8–14 cities per region, priority order ────────────────
// Format: [lat, lng] uses default DISK_R (1).
// Format: [lat, lng, 0] = disk-0 (anchor cell only — for islands smaller than 1 Res-4 cell).
// With 8+ anchors × ~5 unique land cells ≈ 40 cells per region.

const METRO_ANCHORS = {

  // ── West Coast (CA · OR · WA · AZ · NV · NM) ─────────────────────────────
  west: [
    [34.0522, -118.2437],  // Los Angeles ★ lab
    [37.7749, -122.4194],  // San Francisco Bay Area
    [47.6062, -122.3321],  // Seattle
    [33.4484, -112.0740],  // Phoenix
    [32.7157, -117.1611],  // San Diego
    [45.5051, -122.6750],  // Portland
    [36.1699, -115.1398],  // Las Vegas
    [38.5816, -121.4944],  // Sacramento
    [39.5296, -119.8138],  // Reno
    [35.0844, -106.6504],  // Albuquerque
    [47.2529, -122.4443],  // Tacoma, WA
    [43.6150, -116.2023],  // Boise
  ],

  // ── Pacific (Hawaii · Alaska) ──────────────────────────────────────────────
  // Hawaii anchors use disk=0: each island ≈ 1 Res-4 cell, ring-1 lands in ocean.
  // Alaska anchors use disk=1: large land mass, neighbors are land.
  pacific: [
    [21.3069, -157.8583, 0],  // Honolulu, Oahu ★ lab (disk=0: island fits in 1 cell)
    [19.7071, -155.0885, 0],  // Hilo, Big Island (disk=0)
    [20.7984, -156.3319, 0],  // Kahului, Maui (disk=0)
    [22.0964, -159.5261, 0],  // Lihue, Kauai (disk=0)
    [61.2181, -149.9003],     // Anchorage
    [61.5806, -149.4420],     // Palmer / Mat-Su Valley
    [64.8378, -147.7164],     // Fairbanks
    [59.6425, -151.5053],     // Homer / Kenai Peninsula
    [57.7944, -152.4072],     // Kodiak Island
    [58.3005, -134.4197],     // Juneau
    [55.3422, -131.6461],     // Ketchikan
    [57.0531, -135.3300],     // Sitka
    [60.4720, -145.7690],     // Cordova
    [56.8131, -132.9573],     // Petersburg, AK
    [63.3363, -142.9865],     // Tok, AK (interior highway junction)
    [62.9597, -155.5984],     // McGrath, AK (Kuskokwim interior)
    [63.8610, -148.9598],     // Healy, AK (Denali area)
  ],

  // ── Mountain West (CO · UT · ID · WY · ND · SD) ───────────────────────────
  // Montana removed — filling Idaho corridor from north (CDA) to south (Pocatello).
  mountain: [
    [39.7392, -104.9903],  // Denver ★ lab
    [40.7608, -111.8910],  // Salt Lake City
    [40.2338, -111.6585],  // Provo / Orem
    [43.6150, -116.2023],  // Boise
    [47.6547, -116.7803],  // Coeur d'Alene, ID (northern Idaho)
    [46.7298, -117.0002],  // Moscow / Lewiston, ID (Palouse)
    [43.6860, -114.3635],  // Sun Valley / Ketchum, ID
    [42.5630, -114.4609],  // Twin Falls, ID (Magic Valley)
    [43.1566, -112.3373],  // Pocatello, ID
    [43.4886, -112.0422],  // Idaho Falls, ID
    [38.8339, -104.8214],  // Colorado Springs
    [46.8721,  -96.7898],  // Fargo, ND
    [43.5473,  -96.7283],  // Sioux Falls, SD
    [44.5000, -103.8700],  // Rapid City, SD
    [43.0760, -108.9666],  // Riverton / Lander, WY
  ],

  // ── Midwest (MN · WI · MI · IL · IN · OH · IA · MO · KS · NE) ──────────
  midwest: [
    [41.8781,  -87.6298],  // Chicago ★ lab
    [44.9778,  -93.2650],  // Minneapolis
    [42.3314,  -83.0458],  // Detroit
    [43.0389,  -87.9065],  // Milwaukee
    [41.4993,  -81.6944],  // Cleveland
    [39.9612,  -82.9988],  // Columbus
    [39.7684,  -86.1581],  // Indianapolis
    [38.6270,  -90.1994],  // St. Louis
    [39.0997,  -94.5786],  // Kansas City
    [43.0750,  -89.4000],  // Madison
    [41.2524,  -95.9980],  // Omaha
    [41.5868,  -93.6250],  // Des Moines
  ],

  // ── South & East (TX · FL · GA · NC · VA · MD · PA · NY · NE seaboard) ──
  // Virginia Beach removed — anchor cell extends into Atlantic Ocean.
  south: [
    [32.7767,  -96.7970],  // Dallas ★ lab
    [29.7604,  -95.3698],  // Houston
    [33.7490,  -84.3880],  // Atlanta
    [25.7617,  -80.1918],  // Miami
    [38.9072,  -77.0369],  // Washington DC
    [40.7128,  -74.0060],  // New York City
    [30.2672,  -97.7431],  // Austin
    [36.1627,  -86.7816],  // Nashville
    [35.2271,  -80.8431],  // Charlotte
    [39.9526,  -75.1652],  // Philadelphia
    [42.3601,  -71.0589],  // Boston
    [37.5407,  -77.4360],  // Richmond, VA (inland — replaces Virginia Beach)
  ],
}

// ── Generation ────────────────────────────────────────────────────────────────

const globalSeen = new Set()
const result = {}

// Pre-seed lab cells to prevent cross-region bleed
for (const lab of Object.values(LAB)) {
  globalSeen.add(latLngToCell(lab.lat, lab.lng, RES))
}

for (const regionKey of ['west', 'pacific', 'mountain', 'midwest', 'south']) {
  const lab = LAB[regionKey]
  const labCell = latLngToCell(lab.lat, lab.lng, RES)
  const anchors = METRO_ANCHORS[regionKey]

  // 1. Gather all candidate cells from ring-1 (or disk=0 for islands) of each metro anchor
  const candidates = []
  for (const anchor of anchors) {
    const [lat, lng, diskR = DISK_R] = anchor
    const center = latLngToCell(lat, lng, RES)
    for (const cell of gridDisk(center, diskR)) {
      if (isLandCell(cell)) candidates.push(cell)
    }
  }

  // 2. Build selected set — lab always first
  globalSeen.delete(labCell)  // allow lab into its own region
  const selected = [labCell]
  globalSeen.add(labCell)

  // Priority: anchor cells first (ring-0), then ring-1 fills
  const anchorCells = anchors.map(([lat, lng]) => latLngToCell(lat, lng, RES))
  for (const cell of anchorCells) {
    if (selected.length >= TARGET) break
    if (isLandCell(cell) && !globalSeen.has(cell)) {
      selected.push(cell)
      globalSeen.add(cell)
    }
  }
  for (const cell of candidates) {
    if (selected.length >= TARGET) break
    if (!globalSeen.has(cell)) {
      selected.push(cell)
      globalSeen.add(cell)
    }
  }

  result[regionKey] = { cells: selected.slice(0, TARGET) }

  const missing = TARGET - result[regionKey].cells.length
  console.log(
    `${regionKey.padEnd(8)} ${result[regionKey].cells.length} cells  lab=${labCell}` +
    (missing > 0 ? `  ⚠ SHORT by ${missing}` : '')
  )
}

// ── Verify ────────────────────────────────────────────────────────────────────
const total = Object.values(result).reduce((s, r) => s + r.cells.length, 0)
const allCells = Object.values(result).flatMap(r => r.cells)
const uniqueCells = new Set(allCells)
console.log(`\nTotal: ${total}  Unique: ${uniqueCells.size}  Duplicates: ${total - uniqueCells.size}`)
console.log('Lab cells:')
for (const [rk, lab] of Object.entries(LAB)) {
  const cell = latLngToCell(lab.lat, lab.lng, RES)
  const inResult = result[rk]?.cells[0] === cell
  console.log(`  ${rk.padEnd(8)} ${cell}  (${lab.label}) ${inResult ? '✓' : '✗ MISSING'}`)
}

// ── Write ─────────────────────────────────────────────────────────────────────
writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n')
console.log(`\nWrote ${OUT}`)
