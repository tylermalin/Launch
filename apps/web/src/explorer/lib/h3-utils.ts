/**
 * Lightweight helpers around h3-js that produce GeoJSON suitable for
 * Mapbox sources and layers.
 */
import { cellToBoundary, cellToLatLng, getResolution } from 'h3-js';

export interface HexFeatureProps {
  h3Index: string;
  h3Resolution: number;
  status?: string;
  nodeNumber?: number;
  [key: string]: unknown;
}

/**
 * Convert one H3 cell into a GeoJSON Feature whose geometry is the
 * cell boundary polygon, with optional properties carried through.
 *
 * Note on antimeridian: cells that straddle ±180° longitude are split
 * by h3-js into wraparound coords. Mapbox renders those fine as long as
 * the polygon ring is closed; cellToBoundary closes for us when we pass
 * geoJson=true.
 */
export function cellToFeature<P extends HexFeatureProps>(
  h3Index: string,
  properties?: Omit<P, 'h3Index' | 'h3Resolution'>,
): GeoJSON.Feature<GeoJSON.Polygon, P> {
  const boundary = cellToBoundary(h3Index, /* geoJson */ true) as [number, number][];
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [boundary],
    },
    properties: {
      h3Index,
      h3Resolution: getResolution(h3Index),
      ...(properties as object),
    } as P,
  };
}

export function cellsToFeatureCollection<P extends HexFeatureProps>(
  cells: string[],
  buildProps: (h3Index: string) => Omit<P, 'h3Index' | 'h3Resolution'>,
): GeoJSON.FeatureCollection<GeoJSON.Polygon, P> {
  return {
    type: 'FeatureCollection',
    features: cells.map((h3Index) =>
      cellToFeature<P>(h3Index, buildProps(h3Index)),
    ),
  };
}

export function cellCentroidLngLat(h3Index: string): [number, number] {
  const [lat, lng] = cellToLatLng(h3Index);
  return [lng, lat];
}
