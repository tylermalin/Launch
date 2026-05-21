#!/usr/bin/env node
/**
 * Compute H3 Resolution 5 indexes for the five founding-team hexes.
 *
 * Inputs are approximate centroids resolved from the addresses Tyler provided:
 *   - LA 90034 (Tyler Malin)
 *   - Dallas TX (Dominick Garely)
 *   - Haiku-Pauwela HI (Jeffrey Wise)
 *   - Idaho City ID 83631 · 3742 ID-21 (Team Node)
 *   - Sister Bay WI 54234 · 2383 Maple Drive (Wisconsin Project Node)
 *
 * Output: data/founding-hexes.json — a slice of the Phase 1 manifest
 * containing only the five founding team hexes, with their H3 Res 5 indexes.
 *
 * Usage:
 *   cd explorer && npm install h3-js && node scripts/compute-founding-hexes.mjs
 */

import { latLngToCell, cellToLatLng, cellToBoundary, getResolution } from 'h3-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'data');
const OUT_FILE = join(OUT_DIR, 'founding-hexes.json');

const H3_RESOLUTION = 5;

/**
 * Founding team hexes. Coordinates are approximate centroids from the
 * provided addresses; verify and adjust before any production use.
 * Once the project resolves Lat/Lng to H3 res 5, the cell anchors a
 * geographic license that cannot be changed without contract redeployment.
 */
const FOUNDING_HEXES = [
  {
    nodeNumber: 1,
    label: 'Los Angeles',
    operator: 'Tyler Malin',
    address: 'Los Angeles, CA 90034, USA',
    lat: 34.0290,
    lng: -118.4012,
    region: 'Los Angeles',
    country: 'US',
    administrativeArea: 'California',
    locality: 'Los Angeles',
    postalCode: '90034',
  },
  {
    nodeNumber: 2,
    label: 'Dallas',
    operator: 'Dominick Garely',
    address: 'Dallas, TX, USA',
    lat: 32.7767,
    lng: -96.7970,
    region: 'Dallas',
    country: 'US',
    administrativeArea: 'Texas',
    locality: 'Dallas',
    postalCode: null,
  },
  {
    nodeNumber: 3,
    label: 'Haiku',
    operator: 'Jeffrey Wise',
    address: 'Haiku-Pauwela, HI, USA',
    lat: 20.9189,
    lng: -156.3158,
    region: 'Haiku',
    country: 'US',
    administrativeArea: 'Hawaii',
    locality: 'Haiku-Pauwela',
    postalCode: null,
  },
  {
    nodeNumber: 4,
    label: 'Idaho City',
    operator: 'Team Node',
    address: '3742 ID-21, Idaho City, ID 83631, USA',
    lat: 43.8281,
    lng: -115.8341,
    region: 'Idaho',
    country: 'US',
    administrativeArea: 'Idaho',
    locality: 'Idaho City',
    postalCode: '83631',
  },
  {
    nodeNumber: 5,
    label: 'Sister Bay',
    operator: 'Wisconsin Project Node',
    address: '2383 Maple Drive, Sister Bay, WI 54234, USA',
    lat: 45.1949,
    lng: -87.1255,
    region: 'Sister Bay',
    country: 'US',
    administrativeArea: 'Wisconsin',
    locality: 'Sister Bay',
    postalCode: '54234',
  },
];

function buildHexRecord(input) {
  const h3Index = latLngToCell(input.lat, input.lng, H3_RESOLUTION);
  const [centroidLat, centroidLng] = cellToLatLng(h3Index);
  const boundary = cellToBoundary(h3Index, /* GeoJson */ true); // [lng, lat] order

  return {
    nodeNumber: input.nodeNumber,
    h3Index,
    h3Resolution: getResolution(h3Index),
    status: 'reserved-founding',
    operator: input.operator,
    address: input.address,
    inputLat: input.lat,
    inputLng: input.lng,
    centroidLat,
    centroidLng,
    region: input.region,
    country: input.country,
    administrativeArea: input.administrativeArea,
    locality: input.locality,
    postalCode: input.postalCode,
    boundaryGeoJson: {
      type: 'Polygon',
      coordinates: [boundary],
    },
    // Zone classification and geographic multiplier get filled in by a
    // separate pass that joins against WorldPop population counts.
    zoneClassification: null,
    geographicMultiplier: null,
    dataDemandScore: null,
    notes: 'Founding team test hex — held by Malama Labs Inc. internal team',
  };
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const hexes = FOUNDING_HEXES.map(buildHexRecord);

  const output = {
    schemaVersion: '1.0.0',
    h3Resolution: H3_RESOLUTION,
    generatedAt: new Date().toISOString(),
    count: hexes.length,
    hexes,
  };

  writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + '\n');

  console.log(`Wrote ${hexes.length} founding hexes to ${OUT_FILE}`);
  console.log('');
  console.log('Summary:');
  console.log(''.padEnd(86, '─'));
  console.log(
    'Node'.padEnd(6) +
      'Label'.padEnd(14) +
      'H3 Index (Res 5)'.padEnd(20) +
      'Centroid lat,lng'.padEnd(28) +
      'Operator',
  );
  console.log(''.padEnd(86, '─'));
  for (const hex of hexes) {
    const coords = `${hex.centroidLat.toFixed(4)}, ${hex.centroidLng.toFixed(4)}`;
    console.log(
      String(hex.nodeNumber).padEnd(6) +
        hex.region.padEnd(14) +
        hex.h3Index.padEnd(20) +
        coords.padEnd(28) +
        hex.operator,
    );
  }
  console.log(''.padEnd(86, '─'));
}

main();
