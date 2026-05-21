#!/usr/bin/env node
/**
 * Pre-compute H3 cells covering Earth's landmass at multiple resolutions
 * for the Hex Map Explorer's resolution-stepped rendering.
 *
 *   Resolution 1 (~7 cells per continent)  → used at Mapbox zoom 0-2
 *   Resolution 3 (~5K land cells)          → used at Mapbox zoom 3-5
 *   Resolution 5 (~600K land cells)        → used at Mapbox zoom 6+
 *
 * Inputs:
 *   data/ne_50m_land.geojson   Natural Earth land polygons (50m scale)
 *
 * Outputs:
 *   data/land-cells-r1.json   { resolution: 1, cells: [...h3 indexes] }
 *   data/land-cells-r3.json
 *   data/land-cells-r5.json
 *
 * Downloading the Natural Earth land geojson:
 *   curl -L -o data/ne_50m_land.geojson \
 *     https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/physical/ne_50m_land.json
 *
 * Performance note: Resolution 5 over global land is the bottleneck
 * (~5-15 min wall time, peak ~2GB RAM). Run on a dev machine, ship the
 * resulting JSON files (or PMTiles) as static assets.
 */

import { polygonToCells } from 'h3-js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const LAND_GEOJSON = join(DATA_DIR, 'ne_50m_land.geojson');

const RESOLUTIONS = [1, 3, 5];

function loadLandPolygons() {
  if (!existsSync(LAND_GEOJSON)) {
    console.error(`Missing input: ${LAND_GEOJSON}`);
    console.error('');
    console.error('Download it with:');
    console.error(
      '  curl -L -o explorer/data/ne_50m_land.geojson \\',
    );
    console.error(
      '    https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/physical/ne_50m_land.json',
    );
    process.exit(1);
  }
  const geo = JSON.parse(readFileSync(LAND_GEOJSON, 'utf8'));
  const polygons = [];
  for (const feature of geo.features) {
    const geom = feature.geometry;
    if (!geom) continue;
    if (geom.type === 'Polygon') {
      polygons.push(geom.coordinates);
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.coordinates) polygons.push(poly);
    }
  }
  return polygons;
}

/**
 * h3-js polygonToCells expects coordinates as [lat, lng] when flipped=false
 * (the default), or [lng, lat] when flipped=true. Natural Earth GeoJSON
 * uses [lng, lat], so we pass flipped=true.
 */
function fillResolution(polygons, resolution) {
  const cellSet = new Set();
  let polyIndex = 0;
  for (const poly of polygons) {
    polyIndex += 1;
    const cells = polygonToCells(poly, resolution, /* flipped */ true);
    for (const c of cells) cellSet.add(c);
    if (polyIndex % 50 === 0) {
      console.log(
        `  resolution ${resolution}: ${polyIndex}/${polygons.length} polygons processed (${cellSet.size} unique cells so far)`,
      );
    }
  }
  return Array.from(cellSet);
}

function main() {
  mkdirSync(DATA_DIR, { recursive: true });

  console.log(`Loading land polygons from ${LAND_GEOJSON}`);
  const polygons = loadLandPolygons();
  console.log(`Loaded ${polygons.length} land polygons`);

  for (const resolution of RESOLUTIONS) {
    console.log(`Filling H3 resolution ${resolution}...`);
    const t0 = Date.now();
    const cells = fillResolution(polygons, resolution);
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

    const outPath = join(DATA_DIR, `land-cells-r${resolution}.json`);
    const payload = {
      schemaVersion: '1.0.0',
      resolution,
      generatedAt: new Date().toISOString(),
      count: cells.length,
      cells,
    };
    writeFileSync(outPath, JSON.stringify(payload));
    console.log(
      `  → ${cells.length.toLocaleString()} cells written to ${outPath} (${elapsed}s)`,
    );
  }

  console.log('Done.');
}

main();
