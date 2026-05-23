/**
 * seed-genesis-res3.mjs
 *
 * Generates apps/web/src/data/regions.json for 200 Genesis Hex Nodes at
 * H3 Resolution 3 (~12,392 km² / cell — metro-region scale).
 *
 * 5 regions × 40 cells = 200 unique hexes.
 * Lab nodes (one per region) are always the first entry in each region's
 * cell array so genesis-hexes.ts can identify them by index if needed.
 * Global deduplication ensures no cell appears in more than one region.
 *
 * Usage:
 *   node scripts/seed-genesis-res3.mjs
 */

import { latLngToCell, gridDisk } from 'h3-js'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(__dirname, '../apps/web/src/data/regions.json')

const RES = 3
const TARGET = 40   // cells per region
const REGIONS = 5   // 5 × 40 = 200

// ── Lab node anchor points (one per region, always reserved) ──────────────────
const LAB = {
  west:     { label: 'Los Angeles',   lat: 34.0522,  lng: -118.2437 },
  pacific:  { label: 'Haiku, Hawaii', lat: 20.9208,  lng: -156.3044 },
  mountain: { label: 'Idaho City',    lat: 43.8288,  lng: -115.8374 },
  midwest:  { label: 'Sister Bay',    lat: 45.1891,  lng: -87.1267  },
  south:    { label: 'Dallas',        lat: 32.7767,  lng: -96.7970  },
}

// ── Population-center anchors ordered: lab first, then major metro areas ─────
// At Res 3 each cell is ~110 km edge-to-edge, so one cell covers a full
// metro area.  We cluster outward from multiple anchors to fill each region
// with a natural mix of urban and rural territory.

const ANCHORS = {

  // ── West Coast (CA · OR · WA · NV · AZ · NM) ─────────────────────────────
  west: [
    [34.0522, -118.2437], // Los Angeles ★ lab
    [37.7749, -122.4194], // San Francisco
    [47.6062, -122.3321], // Seattle
    [45.5051, -122.6750], // Portland
    [32.7157, -117.1611], // San Diego
    [38.5816, -121.4944], // Sacramento
    [36.7378, -119.7871], // Fresno / Central Valley
    [33.4484, -112.0740], // Phoenix
    [36.1699, -115.1398], // Las Vegas
    [35.0844, -106.6504], // Albuquerque
    [32.2226, -110.9747], // Tucson
    [47.6588, -117.4260], // Spokane
    [43.6150, -116.2023], // Boise
    [37.3382, -121.8863], // San Jose
    [40.5853, -122.3917], // Redding
    [35.3733, -119.0187], // Bakersfield
    [48.7519, -122.4787], // Bellingham, WA
    [46.7298, -117.0002], // Moscow, ID / Palouse
    [37.9577, -120.3608], // Modesto
    [34.1083, -117.2898], // San Bernardino
    [38.2975, -122.2869], // Napa / Wine Country
    [44.9429, -123.0351], // Salem, OR
    [44.0521, -121.3153], // Bend, OR
    [46.1399, -122.9390], // Longview, WA
    [48.5126, -119.5122], // Okanogan, WA (rural east)
    [39.5296, -119.8138], // Reno, NV
    [40.5733, -122.3927], // Shasta area
    [42.3265, -122.8756], // Medford, OR
    [37.2090, -112.0210], // Zion / Southern Utah edge
    [33.6844, -117.8265], // Irvine / South OC
    [38.9071, -120.0000], // Lake Tahoe area
    [34.4208, -119.6982], // Santa Barbara
    [35.6870, -105.9378], // Santa Fe, NM
    [31.7587, -106.4869], // El Paso, TX (western edge)
    [39.7391, -121.8375], // Chico, CA
    [36.3013, -119.3175], // Visalia / Tulare
    [42.0740, -120.5242], // Klamath Falls, OR
    [46.8647, -121.7478], // Yakima, WA
    [47.0379, -122.9007], // Olympia, WA
    [36.7783, -119.4179], // Central Valley catch-all
  ],

  // ── Pacific (Hawaii · Alaska) ─────────────────────────────────────────────
  // Hawaii Res-3 footprint is small (~4-5 cells for all islands); the rest
  // of the region is Alaska metro + interior to reach 40 cells.
  pacific: [
    [20.9208, -156.3044], // Haiku, Maui ★ lab
    [21.3069, -157.8583], // Honolulu, Oahu
    [19.8968, -155.5828], // Hilo, Big Island
    [22.0964, -159.5261], // Lihue, Kauai
    [20.7984, -156.3319], // Kahului, Maui
    [61.2181, -149.9003], // Anchorage, AK
    [58.3005, -134.4197], // Juneau, AK
    [64.8378, -147.7164], // Fairbanks, AK
    [57.0531, -135.3300], // Sitka, AK
    [59.6425, -151.5053], // Homer / Kenai Peninsula
    [55.3422, -131.6461], // Ketchikan, AK
    [60.5544, -150.8004], // Soldotna, AK
    [62.8600, -152.2700], // Denali / Interior AK
    [64.5011, -165.4064], // Nome, AK (western)
    [66.8875, -162.5977], // Kotzebue, AK
    [63.7467, -171.4763], // St. Lawrence Island, AK
    [52.8784, -166.5310], // Unalaska / Dutch Harbor
    [60.1222, -149.4413], // Seward, AK
    [61.5806, -149.4420], // Palmer / Mat-Su, AK
    [64.0853, -141.7233], // Tok, AK (east-interior)
    [56.1808, -158.4551], // King Salmon, AK
    [60.7922, -161.7558], // Bethel, AK
    [67.7299, -164.4711], // Utqiagvik / Barrow, AK
    [65.2482, -166.2847], // Wales, AK (far west)
    [70.2002, -148.4597], // Prudhoe Bay, AK
    [63.3467, -150.4947], // Cantwell, AK (Denali area)
    [55.9045, -160.5220], // Cold Bay, AK (Aleutian)
    [62.5500, -164.8461], // St. Mary's, AK
    [64.7551, -158.1160], // Galena, AK
    [59.4549, -135.3059], // Skagway, AK
    [61.1300, -146.3470], // Valdez, AK
    [60.9004, -162.5187], // Toksook Bay / YK Delta
    [65.6742, -168.0944], // Shishmaref, AK (NW coast)
    [58.1026, -157.8552], // Dillingham, AK
    [65.1820, -152.4200], // Tanana, AK
    [61.9332, -162.9005], // Marshall, AK
    [57.7944, -152.4072], // Kodiak, AK
    [59.7558, -161.8821], // Togiak, AK
    [60.4720, -145.7690], // Cordova, AK
    [56.3478, -134.6494], // Wrangell, AK
  ],

  // ── Mountain West (ID · MT · WY · UT · CO · ND · SD · NE edge) ───────────
  mountain: [
    [43.8288, -115.8374], // Idaho City ★ lab
    [39.7392, -104.9903], // Denver, CO
    [40.7608, -111.8910], // Salt Lake City, UT
    [41.1400, -104.8202], // Cheyenne, WY
    [43.4926, -110.7624], // Jackson, WY
    [46.8772, -113.9966], // Missoula, MT
    [48.2766, -114.1653], // Kalispell, MT
    [45.7833, -108.5007], // Billings, MT
    [46.5958, -112.0270], // Helena, MT
    [47.5053, -111.2994], // Great Falls, MT
    [44.5000, -103.8700], // Rapid City, SD
    [43.0760, -108.9666], // Riverton, WY
    [41.3114, -105.5911], // Laramie, WY
    [40.0150, -105.2705], // Boulder, CO
    [38.8339, -104.8214], // Colorado Springs, CO
    [37.2753, -107.8801], // Durango, CO
    [38.8000, -111.7948], // Richfield, UT
    [37.6775, -113.0619], // Cedar City, UT
    [40.2338, -111.6585], // Provo, UT
    [46.8721, -96.7898],  // Fargo, ND
    [47.9253, -97.0329],  // Grand Forks, ND
    [46.3700, -99.9996],  // Bismarck, ND
    [43.5473, -96.7283],  // Sioux Falls, SD
    [44.0805, -103.2310], // Rapid City east
    [42.8666, -106.3132], // Casper, WY
    [44.7080, -110.4584], // Yellowstone area, WY
    [48.5500, -109.6400], // Havre, MT
    [45.0000, -109.5000], // Cody, WY area
    [46.0000, -105.5000], // Miles City, MT
    [47.2500, -101.7500], // Minot, ND
    [48.8000, -106.8400], // Wolf Point, MT / NE Montana
    [39.0638, -108.5506], // Grand Junction, CO
    [37.2750, -105.9994], // Alamosa, CO / San Luis Valley
    [45.5850, -104.7200], // Baker, MT / SE Montana
    [44.8795, -101.7827], // Pierre, SD
    [41.5000, -100.5000], // North Platte, NE
    [42.0300, -102.8800], // Alliance, NE / panhandle
    [40.8500, -115.7600], // Elko, NV
    [45.6800, -111.0500], // Bozeman, MT
    [46.4300, -117.0000], // Lewiston, ID
  ],

  // ── Midwest / Great Lakes (WI · MN · MI · IL · IN · OH · IA · MO · KS · NE) ──
  midwest: [
    [45.1891, -87.1267],  // Sister Bay, WI ★ lab
    [41.8781, -87.6298],  // Chicago, IL
    [42.3314, -83.0458],  // Detroit, MI
    [44.9778, -93.2650],  // Minneapolis, MN
    [41.4993, -81.6944],  // Cleveland, OH
    [39.9612, -82.9988],  // Columbus, OH
    [39.7684, -86.1581],  // Indianapolis, IN
    [46.7867, -92.1005],  // Duluth, MN
    [41.2524, -95.9980],  // Omaha, NE
    [37.6872, -97.3301],  // Wichita, KS
    [39.0997, -94.5786],  // Kansas City, MO
    [38.6270, -90.1994],  // St. Louis, MO
    [43.0481, -76.1474],  // Syracuse, NY (Midwest–East border)
    [42.8864, -78.8784],  // Buffalo, NY
    [43.6547, -84.7965],  // Mt. Pleasant, MI (central)
    [44.7631, -85.6206],  // Traverse City, MI
    [46.4500, -84.5500],  // Sault Ste. Marie area
    [47.9253, -88.7580],  // Houghton / Keweenaw, MI
    [43.0750, -89.4000],  // Madison, WI
    [44.5000, -89.5000],  // Wausau, WI
    [45.5630, -94.1594],  // St. Cloud, MN
    [47.0000, -94.8000],  // Brainerd, MN lakes
    [48.0000, -96.2000],  // Red Lake, MN
    [43.5000, -84.5000],  // Saginaw / Bay City, MI
    [42.2710, -85.5850],  // Kalamazoo, MI
    [41.0534, -85.1394],  // Fort Wayne, IN
    [42.4928, -90.6640],  // Dubuque, IA
    [42.0333, -93.6201],  // Ames, IA
    [41.5868, -93.6250],  // Des Moines, IA
    [40.8000, -96.7000],  // Lincoln, NE
    [37.3382, -94.4000],  // Joplin, MO / 4-state area
    [39.8000, -98.9000],  // Concordia, KS / High Plains
    [44.0500, -92.4800],  // Rochester, MN
    [41.9942, -91.6652],  // Cedar Rapids, IA
    [37.9643, -87.5710],  // Evansville, IN
    [40.5000, -88.0000],  // Bloomington-Normal, IL
    [37.2200, -93.2982],  // Springfield, MO
    [38.2527, -85.7585],  // Louisville, KY (border)
    [46.7200, -90.8700],  // Ashland / Chequamegon, WI
    [41.6600, -83.5554],  // Toledo, OH
  ],

  // ── South + East (TX · OK · LA · AR · Gulf States · Appalachia · NE seaboard) ──
  south: [
    [32.7767, -96.7970],  // Dallas ★ lab
    [29.7604, -95.3698],  // Houston, TX
    [33.7490, -84.3880],  // Atlanta, GA
    [25.7617, -80.1918],  // Miami, FL
    [36.1627, -86.7816],  // Nashville, TN
    [29.9511, -90.0715],  // New Orleans, LA
    [35.2271, -80.8431],  // Charlotte, NC
    [35.7796, -78.6382],  // Raleigh, NC
    [38.9072, -77.0369],  // Washington, DC
    [39.9526, -75.1652],  // Philadelphia, PA
    [40.7128, -74.0060],  // New York City, NY
    [42.3601, -71.0589],  // Boston, MA
    [30.3322, -81.6557],  // Jacksonville, FL
    [27.9506, -82.4572],  // Tampa, FL
    [28.5383, -81.3792],  // Orlando, FL
    [30.2672, -97.7431],  // Austin, TX
    [29.4241, -98.4936],  // San Antonio, TX
    [36.1595, -95.9940],  // Tulsa, OK
    [35.4676, -97.5164],  // Oklahoma City, OK
    [35.1495, -90.0490],  // Memphis, TN
    [36.8529, -75.9780],  // Virginia Beach, VA
    [37.5407, -77.4360],  // Richmond, VA
    [39.2904, -76.6122],  // Baltimore, MD
    [41.7658, -72.6851],  // Hartford, CT
    [41.8240, -71.4128],  // Providence, RI
    [44.3148, -69.7795],  // Augusta, ME
    [43.6591, -70.2568],  // Portland, ME
    [43.2081, -71.5376],  // Concord, NH
    [44.4759, -73.2121],  // Burlington, VT
    [32.3668, -86.3000],  // Montgomery, AL
    [30.6954, -88.0399],  // Mobile, AL
    [32.2988, -90.1848],  // Jackson, MS
    [35.1495, -90.0490],  // Memphis / mid-south
    [31.5493, -97.1467],  // Waco, TX
    [26.2034, -98.2300],  // McAllen / Rio Grande Valley, TX
    [31.7587, -106.4869], // El Paso, TX
    [30.5000, -92.5000],  // Lafayette, LA
    [32.4600, -93.7200],  // Shreveport, LA
    [36.3730, -94.2088],  // Fayetteville, AR
    [34.7465, -92.2896],  // Little Rock, AR
    [35.9606, -83.9207],  // Knoxville, TN
    [36.5000, -82.5000],  // Tri-Cities, TN/VA
    [38.3498, -81.6326],  // Charleston, WV
    [37.2710, -79.9414],  // Roanoke, VA
    [34.0007, -81.0348],  // Columbia, SC
    [32.7765, -79.9311],  // Charleston, SC
    [33.5779, -101.8552], // Lubbock, TX
    [31.9686, -99.9018],  // Abilene, TX
    [41.0534, -74.1301],  // Northern NJ
    [41.3083, -72.9279],  // New Haven, CT
    [44.8000, -68.7700],  // Bangor, ME
    [43.0481, -76.1474],  // Syracuse, NY
    [42.6526, -73.7562],  // Albany, NY
    [43.1566, -77.6088],  // Rochester, NY
    [42.8867, -74.0174],  // Gloversville / Mohawk Valley, NY
    [40.4774, -74.2591],  // Staten Island / NJ Shore
    [40.9176, -72.6667],  // Long Island, NY
  ],
}

// ── Generation ────────────────────────────────────────────────────────────────

const globalSeen = new Set()   // cross-region dedup
const result = {}

// Pre-seed ALL lab cells so no lab cell can accidentally land in a foreign region
for (const lab of Object.values(LAB)) {
  globalSeen.add(latLngToCell(lab.lat, lab.lng, RES))
}

for (const regionKey of ['west', 'pacific', 'mountain', 'midwest', 'south']) {
  const lab = LAB[regionKey]
  const labCell = latLngToCell(lab.lat, lab.lng, RES)
  const anchors = ANCHORS[regionKey]

  // 1. Collect candidate cells: anchor cells + k=1 rings around each
  const candidates = new Set()
  for (const [lat, lng] of anchors) {
    const cell = latLngToCell(lat, lng, RES)
    candidates.add(cell)
    for (const n of gridDisk(cell, 1)) candidates.add(n)
  }

  // 2. Build the selected set — lab node always first and always included.
  //    Remove labCell from globalSeen temporarily so it can be added to its
  //    own region (it was pre-seeded to block foreign regions, not its own).
  globalSeen.delete(labCell)
  const selected = [labCell]
  globalSeen.add(labCell)

  // Priority order: cells at anchor lat/lng first, then ring-1 fills
  const anchorCells = anchors.map(([lat, lng]) => latLngToCell(lat, lng, RES))
  for (const cell of anchorCells) {
    if (selected.length >= TARGET) break
    if (!globalSeen.has(cell)) { selected.push(cell); globalSeen.add(cell) }
  }

  // Fill from ring-1 expansion
  for (const cell of candidates) {
    if (selected.length >= TARGET) break
    if (!globalSeen.has(cell)) { selected.push(cell); globalSeen.add(cell) }
  }

  // 3. If still short, expand outward from the lab cell
  let k = 2
  while (selected.length < TARGET && k <= 12) {
    for (const cell of gridDisk(labCell, k)) {
      if (selected.length >= TARGET) break
      if (!globalSeen.has(cell)) { selected.push(cell); globalSeen.add(cell) }
    }
    k++
  }

  result[regionKey] = { cells: selected.slice(0, TARGET) }

  const missing = TARGET - result[regionKey].cells.length
  console.log(
    `${regionKey.padEnd(8)} ${result[regionKey].cells.length} cells  lab=${labCell}` +
    (missing > 0 ? `  ⚠ MISSING ${missing}` : '')
  )
}

// ── Verify ────────────────────────────────────────────────────────────────────
const total = Object.values(result).reduce((s, r) => s + r.cells.length, 0)
const allCells = Object.values(result).flatMap(r => r.cells)
const uniqueCells = new Set(allCells)
console.log(`\nTotal : ${total}  Unique: ${uniqueCells.size}  Duplicates: ${total - uniqueCells.size}`)
console.log('Lab cells:')
for (const [rk, lab] of Object.entries(LAB)) {
  const cell = latLngToCell(lab.lat, lab.lng, RES)
  const inResult = result[rk].cells[0] === cell
  console.log(`  ${rk.padEnd(8)} ${cell}  (${lab.label}) ${inResult ? '✓' : '✗ MISSING from index 0'}`)
}

// ── Write ─────────────────────────────────────────────────────────────────────
writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n')
console.log(`\nWrote ${OUT}`)
