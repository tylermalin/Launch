#!/usr/bin/env node
/**
 * Seed the complete Phase 1 Hex Node manifest.
 *
 * Produces 200 hex cells total:
 *   - 5 founding team hexes (LA, Dallas, Haiku, Idaho City, Sister Bay)
 *   - 195 external-sale hexes distributed across LA, NY, Tokyo, London, Idaho
 *
 * Each cell carries an H3 Resolution 5 index, a zone classification
 * (urban/suburban/rural/wild), and a geographic multiplier derived from
 * the zone. Zone is assigned by H3 grid-disk distance from the regional
 * center; Idaho gets a different curve since it's natively sparse.
 *
 * Output: apps/web/src/explorer/data/phase1-manifest.json
 *
 * Usage:
 *   cd ~/Code/Launch/apps/web
 *   node src/explorer/scripts/seed-phase1-cells.mjs
 */

import {
  latLngToCell,
  cellToLatLng,
  gridDisk,
} from 'h3-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const FOUNDING_FILE = join(DATA_DIR, 'founding-hexes.json');
const OUT_FILE = join(DATA_DIR, 'phase1-manifest.json');

const H3_RESOLUTION = 5;
const TARGET_EXTERNAL_PER_REGION = 39;

const ZONE_MULTIPLIERS = {
  urban: 0.5,
  suburban: 1.0,
  rural: 1.5,
  wild: 2.0,
};

/**
 * Regional seeds. The `seedFounderH3` (where present) is the actual H3 cell
 * of the founding-team hex in that region; we expand from that center so
 * the founder hex sits in the middle of its region. For NY, Tokyo, London
 * we use city-center coordinates since no founder is in those regions.
 */
const REGIONS = [
  {
    name: 'Los Angeles',
    country: 'US',
    administrativeArea: 'California',
    centerLat: 34.0140,
    centerLng: -118.4378,
    seedFounderH3: '8529a19bfffffff', // Tyler Malin · LA 90034
  },
  {
    name: 'New York',
    country: 'US',
    administrativeArea: 'New York',
    centerLat: 40.7128,
    centerLng: -74.0060,
    seedFounderH3: null,
  },
  {
    name: 'Tokyo',
    country: 'JP',
    administrativeArea: 'Tokyo',
    centerLat: 35.6762,
    centerLng: 139.6503,
    seedFounderH3: null,
  },
  {
    name: 'London',
    country: 'GB',
    administrativeArea: 'England',
    centerLat: 51.5074,
    centerLng: -0.1278,
    seedFounderH3: null,
  },
  {
    name: 'Idaho',
    country: 'US',
    administrativeArea: 'Idaho',
    centerLat: 43.8843,
    centerLng: -115.8485,
    seedFounderH3: '8528846ffffffff', // Team Node · Idaho City
  },
];

function classifyByRing(k, regionName) {
  // Idaho's natural geography is mostly wilderness; almost every cell
  // within reasonable rings is wild or rural, never urban/suburban.
  if (regionName === 'Idaho') {
    if (k === 0) return 'rural';
    if (k <= 1) return 'rural';
    return 'wild';
  }
  // Standard urban-fringe curve for the four city regions.
  if (k === 0) return 'urban';
  if (k <= 1) return 'urban';
  if (k <= 2) return 'suburban';
  if (k <= 3) return 'rural';
  return 'wild';
}

/**
 * Expand outward from a center H3 cell, ring by ring, collecting cells
 * until we have `targetCount` unique cells (excluding `excludeH3` if any).
 * Returns each cell tagged with its ring distance `k` from the center.
 */
function expandFromCenter(centerH3, targetCount, excludeH3 = null) {
  const seen = new Set();
  const cells = []; // { h3Index, k }
  for (let k = 0; k < 12; k++) {
    const ring = gridDisk(centerH3, k);
    for (const h of ring) {
      if (seen.has(h)) continue;
      seen.add(h);
      if (h === excludeH3) continue; // founder seed is excluded from external sale
      cells.push({ h3Index: h, k });
      if (cells.length >= targetCount) return cells;
    }
  }
  return cells;
}

function buildExternalHex({ nodeNumber, h3Index, k, region }) {
  const [centroidLat, centroidLng] = cellToLatLng(h3Index);
  const zone = classifyByRing(k, region.name);
  return {
    nodeNumber,
    h3Index,
    h3Resolution: H3_RESOLUTION,
    status: 'available',
    operator: null,
    region: region.name,
    country: region.country,
    administrativeArea: region.administrativeArea,
    locality: null,
    postalCode: null,
    centroidLat,
    centroidLng,
    zoneClassification: zone,
    geographicMultiplier: ZONE_MULTIPLIERS[zone],
    dataDemandScore: null,
    listingReferenceUsd: 2228,
    genesisReserveUsd: 2000,
    notes: `Ring distance k=${k} from ${region.name} center; seeded by seed-phase1-cells.mjs`,
  };
}

function buildFoundingHex(founding) {
  // Founding hex zones aren't computed via ring distance; we hand-classify
  // them based on their actual geography. Override per location.
  const zoneByH3 = {
    '8529a19bfffffff': 'urban',     // LA 90034
    '8526cb9bfffffff': 'urban',     // Dallas
    '855d1447fffffff': 'rural',     // Haiku-Pauwela (sparse Maui)
    '8528846ffffffff': 'wild',      // Idaho City (timber/forest)
    '8527400ffffffff': 'wild',      // Sister Bay WI (Door County tip)
  };
  const zone = zoneByH3[founding.h3Index] ?? 'rural';
  return {
    nodeNumber: founding.nodeNumber,
    h3Index: founding.h3Index,
    h3Resolution: founding.h3Resolution,
    status: 'reserved-founding',
    operator: founding.operator,
    region: founding.region,
    country: founding.country,
    administrativeArea: founding.administrativeArea,
    locality: founding.locality,
    postalCode: founding.postalCode,
    centroidLat: founding.centroidLat,
    centroidLng: founding.centroidLng,
    zoneClassification: zone,
    geographicMultiplier: ZONE_MULTIPLIERS[zone],
    dataDemandScore: null,
    listingReferenceUsd: 2228,
    genesisReserveUsd: 2000,
    notes: founding.notes ?? 'Founding team test hex. Held by Malama Labs Inc.',
  };
}

function main() {
  const founding = JSON.parse(readFileSync(FOUNDING_FILE, 'utf8'));
  const foundingHexes = founding.hexes.map(buildFoundingHex);

  // External sale hexes: nodeNumbers 6-200, distributed across the 5 regions.
  const externalHexes = [];
  let nodeNumber = 6;
  for (const region of REGIONS) {
    const centerH3 = region.seedFounderH3
      ?? latLngToCell(region.centerLat, region.centerLng, H3_RESOLUTION);
    const cells = expandFromCenter(
      centerH3,
      TARGET_EXTERNAL_PER_REGION,
      region.seedFounderH3, // exclude founder hex from external sale
    );
    for (const { h3Index, k } of cells) {
      externalHexes.push(
        buildExternalHex({ nodeNumber, h3Index, k, region }),
      );
      nodeNumber += 1;
    }
  }

  // Combine and sort by nodeNumber (founders 1-5 first, then externals 6-200).
  const allHexes = [...foundingHexes, ...externalHexes].sort(
    (a, b) => a.nodeNumber - b.nodeNumber,
  );

  // Sanity: should be exactly 200 with unique h3Indexes.
  const h3Set = new Set(allHexes.map((h) => h.h3Index));
  if (allHexes.length !== 200) {
    throw new Error(`Expected 200 hexes, got ${allHexes.length}`);
  }
  if (h3Set.size !== 200) {
    throw new Error(
      `Duplicate H3 indexes detected: ${allHexes.length} hexes but only ${h3Set.size} unique indexes`,
    );
  }

  // Compose the full manifest.
  const manifest = {
    schemaVersion: '1.0.0',
    manifestName: 'Phase 1 Hex Node Launchpad',
    h3Resolution: H3_RESOLUTION,
    totalCells: 200,
    soldOrReserved: foundingHexes.length,
    externalAvailable: externalHexes.length,
    lastUpdated: new Date().toISOString().slice(0, 10),
    wavesPolicy:
      "Phase 1 hexes are released in waves. Cells with status 'available' are open for reservation; cells flagged 'upcoming' render in a muted blue and are not yet purchasable. All externally sold cells default to 'available' in this seed; flip individual cells to 'upcoming' to stage wave rollouts.",
    regions: REGIONS.map((r) => r.name).concat(['Other (founding team)']),
    statusVocabulary: {
      available: 'Open for reservation in the current wave',
      upcoming: 'Phase 1 hex held back for a future wave; not yet purchasable',
      reserved: 'Purchased by an external operator; awaiting hardware boot',
      'reserved-founding':
        'Held by the Malama Labs founding team for internal testing; not for sale',
      activated: 'Hardware booted, registered on chain, generating signed data',
      restricted:
        'Sales prohibited in this jurisdiction per Terms §25; rendered as non-interactive',
    },
    zoneVocabulary: {
      urban: { multiplier: 0.5, description: 'Dense city core; high coverage saturation' },
      suburban: { multiplier: 1.0, description: 'Mid-density; baseline reward weight' },
      rural: { multiplier: 1.5, description: 'Low-density; climate-relevant land use' },
      wild: { multiplier: 2.0, description: 'Sparse coverage; frontier and high-climate-value terrain' },
    },
    hexes: allHexes,
  };

  writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Wrote ${allHexes.length} hexes to ${OUT_FILE}`);

  // Summary by region and zone.
  const byRegion = {};
  for (const h of allHexes) {
    const key = h.region;
    if (!byRegion[key]) byRegion[key] = {};
    byRegion[key][h.zoneClassification] =
      (byRegion[key][h.zoneClassification] ?? 0) + 1;
  }

  console.log('');
  console.log('Distribution by region and zone:');
  console.log(''.padEnd(72, '─'));
  console.log(
    'Region'.padEnd(20) +
      'Urban'.padStart(8) +
      'Suburban'.padStart(10) +
      'Rural'.padStart(8) +
      'Wild'.padStart(8) +
      'Total'.padStart(8),
  );
  console.log(''.padEnd(72, '─'));
  let grandTotal = 0;
  for (const [region, zones] of Object.entries(byRegion)) {
    const u = zones.urban ?? 0;
    const s = zones.suburban ?? 0;
    const r = zones.rural ?? 0;
    const w = zones.wild ?? 0;
    const t = u + s + r + w;
    grandTotal += t;
    console.log(
      region.padEnd(20) +
        String(u).padStart(8) +
        String(s).padStart(10) +
        String(r).padStart(8) +
        String(w).padStart(8) +
        String(t).padStart(8),
    );
  }
  console.log(''.padEnd(72, '─'));
  console.log('Total'.padEnd(46) + String(grandTotal).padStart(26));
}

main();
