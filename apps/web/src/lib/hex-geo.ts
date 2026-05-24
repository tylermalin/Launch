/**
 * hex-geo.ts — Auto-computation of geographic properties for H3 hex cells.
 *
 * Computes three values at manifest-build time (no network calls):
 *   1. region        — which of the 5 Genesis regions the cell belongs to
 *   2. zoneClass     — urban-core / urban / suburban / rural / remote
 *   3. waterCoverage — estimated % of cell area over ocean/lake (0-100)
 *
 * All calculations are deterministic from the cell's centroid lat/lng, so
 * they can run at API response time with zero external dependencies.
 */

// ── Region detection ──────────────────────────────────────────────────────────

export type GenesisRegionKey = 'west' | 'pacific' | 'mountain' | 'midwest' | 'south';

/** Bounding box [minLat, maxLat, minLng, maxLng] per region. */
const REGION_BOXES: Record<GenesisRegionKey, [number, number, number, number][]> = {
  // West Coast: CA, OR, WA, NV, AZ, NM, plus Boise/western ID
  west: [
    [31.0, 49.5, -125.0, -109.0],
    [31.0, 37.0, -109.0, -103.0], // NM western strip
  ],
  // Pacific: Hawaii + Alaska
  pacific: [
    [18.0, 29.0, -162.0, -154.0], // Hawaii
    [54.0, 72.0, -170.0, -129.0], // Alaska
  ],
  // Mountain West: ID (east), MT, WY, UT, CO, ND, SD, NE panhandle
  mountain: [
    [37.0, 49.5, -117.0, -96.0],
    [37.0, 41.5, -109.0, -96.0],
  ],
  // Midwest: MN, WI, MI, IL, IN, OH, IA, MO, KS, NE, KY border
  midwest: [
    [36.5, 49.5, -97.0, -80.0],
  ],
  // South & East: TX, OK, LA, AR, TN, Gulf States, Appalachia, NE seaboard
  south: [
    [24.0, 40.0, -107.0, -66.0],
    [40.0, 47.5, -80.0, -66.0], // NE seaboard (NY, CT, ME, etc.)
  ],
};

/**
 * Returns the Genesis region key for a lat/lng centroid.
 * Falls back to the closest region centroid if bounding boxes don't match
 * (handles cells that span region boundaries).
 */
export function detectRegion(lat: number, lng: number): GenesisRegionKey {
  const entries = Object.entries(REGION_BOXES) as Array<[GenesisRegionKey, [number,number,number,number][]]>;
  for (const [key, boxes] of entries) {
    for (const box of boxes) {
      const [minLat, maxLat, minLng, maxLng] = box;
      if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
        return key;
      }
    }
  }
  // Fallback: closest region centroid
  const REGION_CENTROIDS: Record<GenesisRegionKey, [number, number]> = {
    west:     [37.0, -119.0],
    pacific:  [21.0, -157.0],
    mountain: [44.0, -107.0],
    midwest:  [43.0, -89.0],
    south:    [33.0, -85.0],
  };
  let best: GenesisRegionKey = 'south';
  let bestDist = Infinity;
  for (const [k, [clat, clng]] of Object.entries(REGION_CENTROIDS) as [GenesisRegionKey, [number,number]][]) {
    const d = Math.hypot(lat - clat, (lng - clng) * Math.cos(lat * Math.PI / 180));
    if (d < bestDist) { bestDist = d; best = k; }
  }
  return best;
}

export const REGION_LABELS: Record<GenesisRegionKey, string> = {
  west:     'West Coast',
  pacific:  'Pacific & Alaska',
  mountain: 'Mountain West',
  midwest:  'Midwest',
  south:    'South & East',
};

// ── Zone classification ───────────────────────────────────────────────────────

export type ZoneClass = 'urban-core' | 'urban' | 'suburban' | 'rural' | 'remote';

/** Major US metros [lat, lng, population] for zone distance scoring. */
const MAJOR_METROS: [number, number, number][] = [
  // Pop >= 1M metros
  [34.0522, -118.2437, 13_200_000], // Los Angeles
  [40.7128,  -74.0060, 20_100_000], // New York
  [41.8781,  -87.6298,  9_500_000], // Chicago
  [29.7604,  -95.3698,  7_300_000], // Houston
  [33.7490,  -84.3880,  6_200_000], // Atlanta
  [25.7617,  -80.1918,  6_200_000], // Miami
  [33.4484, -112.0740,  5_000_000], // Phoenix
  [30.2672,  -97.7431,  2_300_000], // Austin
  [32.7767,  -96.7970,  7_700_000], // Dallas
  [47.6062, -122.3321,  4_000_000], // Seattle
  [45.5051, -122.6750,  2_500_000], // Portland
  [37.7749, -122.4194,  4_700_000], // San Francisco
  [36.1699, -115.1398,  2_300_000], // Las Vegas
  [39.7392, -104.9903,  2_900_000], // Denver
  [40.7608, -111.8910,  1_250_000], // Salt Lake City
  [44.9778,  -93.2650,  3_700_000], // Minneapolis
  [38.6270,  -90.1994,  2_800_000], // St. Louis
  [39.0997,  -94.5786,  2_200_000], // Kansas City
  [38.9072,  -77.0369,  6_400_000], // Washington DC
  [39.9526,  -75.1652,  6_200_000], // Philadelphia
  [42.3601,  -71.0589,  4_900_000], // Boston
  [36.1627,  -86.7816,  2_100_000], // Nashville
  [35.2271,  -80.8431,  2_700_000], // Charlotte
  [35.7796,  -78.6382,  1_400_000], // Raleigh
  [36.8529,  -75.9780,  1_800_000], // Virginia Beach
  [29.9511,  -90.0715,  1_300_000], // New Orleans
  [29.4241,  -98.4936,  2_600_000], // San Antonio
  [35.1495,  -90.0490,  1_300_000], // Memphis
  [61.2181, -149.9003,    400_000], // Anchorage
  [21.3069, -157.8583,  1_000_000], // Honolulu
  [20.9208, -156.3044,    160_000], // Maui
  [46.8772, -113.9966,    115_000], // Missoula
  [43.6150, -116.2023,    770_000], // Boise
  [45.7833, -108.5007,    120_000], // Billings
  [43.0750,  -89.4000,    680_000], // Madison
];

/** Haversine distance in km between two lat/lng points. */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Geographic multipliers per zone class (lower = more valuable = urban). */
export const ZONE_MULTIPLIERS: Record<ZoneClass, number> = {
  'urban-core': 0.90,
  'urban':      1.00,
  'suburban':   1.15,
  'rural':      1.35,
  'remote':     1.60,
};

/**
 * Classify a hex cell's zone based on proximity to major metros.
 *
 * At Res-4 (~60 km edge), thresholds are calibrated so:
 *   urban-core  — within 40 km of a city > 1M pop
 *   urban       — within 80 km of a city > 500k pop
 *   suburban    — within 150 km of any major metro
 *   rural       — within 300 km of any major metro
 *   remote      — beyond 300 km
 */
export function classifyZone(lat: number, lng: number): {
  zone: ZoneClass;
  multiplier: number;
  nearestCity: string;
  nearestCityKm: number;
} {
  const NAMED_METROS: [number, number, number, string][] = MAJOR_METROS.map(
    ([la, ln, pop], i) => [la, ln, pop, METRO_NAMES[i] ?? 'Unknown'] as [number, number, number, string]
  );

  let minDist = Infinity;
  let nearestCity = 'Unknown';
  let nearestPop = 0;

  for (const [mLat, mLng, pop, name] of NAMED_METROS) {
    const d = haversineKm(lat, lng, mLat, mLng);
    if (d < minDist) { minDist = d; nearestCity = name; nearestPop = pop; }
  }

  let zone: ZoneClass;
  if (minDist < 40 && nearestPop >= 1_000_000)  zone = 'urban-core';
  else if (minDist < 80 && nearestPop >= 500_000) zone = 'urban';
  else if (minDist < 150)                          zone = 'suburban';
  else if (minDist < 300)                          zone = 'rural';
  else                                             zone = 'remote';

  return { zone, multiplier: ZONE_MULTIPLIERS[zone], nearestCity, nearestCityKm: Math.round(minDist) };
}

const METRO_NAMES = [
  'Los Angeles', 'New York', 'Chicago', 'Houston', 'Atlanta',
  'Miami', 'Phoenix', 'Austin', 'Dallas', 'Seattle',
  'Portland', 'San Francisco', 'Las Vegas', 'Denver', 'Salt Lake City',
  'Minneapolis', 'St. Louis', 'Kansas City', 'Washington DC', 'Philadelphia',
  'Boston', 'Nashville', 'Charlotte', 'Raleigh', 'Virginia Beach',
  'New Orleans', 'San Antonio', 'Memphis', 'Anchorage', 'Honolulu',
  'Maui', 'Missoula', 'Boise', 'Billings', 'Madison',
];

// ── Water coverage estimation ─────────────────────────────────────────────────
//
// Approximates the % of a Res-4 cell that is covered by ocean or major lakes.
// Uses a simplified continental US landmass + known ocean/lake bounding boxes.
// Accuracy: ~±15% — sufficient for informational display.
//
// Method: sample the 6 hex vertices + centroid, count how many are over water,
// then linearly interpolate. Coastal cells that straddle land/water get ~33%–66%.

/** Returns true if lat/lng is clearly over ocean (not land). */
function isOverOcean(lat: number, lng: number): boolean {
  // Pacific Ocean (west of continental US)
  if (lng < -125.0 && lat > 23.0 && lat < 60.0) return true;
  // Pacific west of Hawaii
  if (lng < -162.0 && lat > 17.0 && lat < 29.0) return true;
  // Atlantic Ocean (east of continental US and eastern seaboard)
  if (lng > -60.0 && lat > 24.0 && lat < 50.0) return true;
  // Gulf of Mexico
  if (lat > 23.0 && lat < 30.5 && lng > -98.0 && lng < -80.0) return true;
  // Hawaiian islands — per-island checks (broad bbox covers inter-island ocean)
  if (lat > 21.7 && lat < 22.4 && lng > -160.2 && lng < -159.0) return false; // Kauai
  if (lat > 21.0 && lat < 21.8 && lng > -158.7 && lng < -157.4) return false; // Oahu
  if (lat > 20.4 && lat < 21.3 && lng > -157.5 && lng < -156.5) return false; // Molokai/Lanai
  if (lat > 20.4 && lat < 21.1 && lng > -156.9 && lng < -155.9) return false; // Maui
  if (lat > 18.8 && lat < 20.5 && lng > -156.2 && lng < -154.3) return false; // Big Island
  // Pacific Ocean around / between Hawaiian islands
  if (lat > 17.0 && lat < 25.0 && lng > -163.0 && lng < -154.0) return true;
  // Arctic Ocean north of Alaska
  if (lat > 71.0) return true;
  // Bering Sea west of Alaska
  if (lng < -168.0 && lat > 54.0) return true;
  // Cook Inlet (coastal AK) — excludes Anchorage (-149.9°) and Palmer (-149.4°)
  if (lat > 59.0 && lat < 62.0 && lng > -153.0 && lng < -150.5) return true;
  return false;
}

/** Returns true if lat/lng is over a major inland lake. */
function isOverLake(lat: number, lng: number): boolean {
  // Great Lakes (simplified bounding boxes)
  if (lat > 41.5 && lat < 46.5 && lng > -92.5 && lng < -76.0) {
    // Lake Superior
    if (lat > 46.0 && lat < 49.0 && lng > -92.5 && lng < -84.0) return true;
    // Lake Michigan
    if (lat > 41.5 && lat < 46.0 && lng > -88.0 && lng < -84.5) return true;
    // Lake Huron
    if (lat > 43.5 && lat < 46.5 && lng > -84.5 && lng < -79.5) return true;
    // Lake Erie
    if (lat > 41.5 && lat < 43.0 && lng > -83.5 && lng < -78.5) return true;
    // Lake Ontario
    if (lat > 43.0 && lat < 44.5 && lng > -79.5 && lng < -76.0) return true;
  }
  // Great Salt Lake
  if (lat > 40.7 && lat < 41.7 && lng > -113.2 && lng < -112.0) return true;
  return false;
}

function isOverWater(lat: number, lng: number): boolean {
  return isOverOcean(lat, lng) || isOverLake(lat, lng);
}

/**
 * Estimate the percentage of a hex cell's area that is over water (0–100).
 *
 * Samples 7 points: centroid + 6 approximate vertices derived from the
 * hex edge length (Res-4 edge ≈ 60 km → ~0.54° of latitude).
 */
export function estimateWaterCoverage(lat: number, lng: number, res: number = 4): number {
  // Approximate edge length in degrees for common resolutions
  const EDGE_DEG: Record<number, number> = {
    1: 1.17, 2: 0.44, 3: 0.17, 4: 0.063, 5: 0.024, 6: 0.009,
  };
  const edge = EDGE_DEG[res] ?? 0.063;
  const lngScale = 1 / Math.cos(lat * Math.PI / 180);

  // 6 hex vertex directions (flat-top hexagon)
  const angles = [0, 60, 120, 180, 240, 300].map((a) => a * Math.PI / 180);
  const samples: [number, number][] = [
    [lat, lng], // centroid
    ...angles.map((a) => [lat + edge * Math.sin(a), lng + edge * lngScale * Math.cos(a)] as [number, number]),
  ];

  const waterCount = samples.filter(([la, ln]) => isOverWater(la, ln)).length;
  return Math.round((waterCount / samples.length) * 100);
}
