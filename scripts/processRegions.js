const fs = require('fs');
const h3 = require('h3-js');
const path = require('path');

const regions = [
  { name: 'idaho', file: 'idaho_raw.json', res: 4 },
  { name: 'nyc', file: 'nyc_raw.json', res: 7 },
  { name: 'london', file: 'london_raw.json', res: 7 },
  { name: 'tokyo', file: 'tokyo_raw.json', res: 7 }
];

const basePath = path.join(__dirname, '..', 'apps', 'web', 'src', 'data', 'regions');
const outputPath = path.join(__dirname, '..', 'apps', 'web', 'src', 'data', 'regions.json');

const outputData = {};

let totalHexes = 0;

for (const region of regions) {
  const filePath = path.join(basePath, region.file);
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(rawData);
    
    if (!json || json.length === 0) {
      console.warn(`No data found for ${region.name}`);
      continue;
    }

    const feature = json[0];
    const geojson = feature.geojson;
    
    if (!geojson || !geojson.coordinates) {
      console.warn(`No GeoJSON found in ${region.file}`);
      continue;
    }

    console.log(`Processing ${region.name} (${geojson.type})...`);

    let allHexes = new Set();
    
    // h3.polygonToCells respects standard GeoJSON format [lng, lat] when isGeoJson flag is true.
    if (geojson.type === 'Polygon') {
        const hexes = h3.polygonToCells(geojson.coordinates, region.res, true);
        hexes.forEach(h => allHexes.add(h));
    } else if (geojson.type === 'MultiPolygon') {
        for (const polygonCoords of geojson.coordinates) {
            const hexes = h3.polygonToCells(polygonCoords, region.res, true);
            hexes.forEach(h => allHexes.add(h));
        }
    }
    
    const hexArray = Array.from(allHexes);
    outputData[region.name] = hexArray;
    console.log(` -> Generated ${hexArray.length} hexes for ${region.name} at Res ${region.res}`);
    totalHexes += hexArray.length;

  } catch (err) {
    console.error(`Error processing ${region.name}:`, err.message);
  }
}

fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
console.log(`Successfully generated regions.json! Total hexes: ${totalHexes}`);
