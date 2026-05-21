/**
 * Color, opacity, and zoom-step constants for the Hex Map Explorer.
 *
 * Palette is tuned for the launch.malamalabs.com dark theme. Available
 * hexes are bright blue; sold and reserved hexes are red. Founding-team
 * hexes share the red fill but carry an amber border to distinguish
 * "held by team" from "sold to external operator".
 */

export type HexStatus =
  | 'available'
  | 'upcoming'
  | 'reserved'
  | 'reserved-founding'
  | 'activated'
  | 'future-phase'
  | 'restricted';

export interface HexStateStyle {
  fillColor: string;
  fillOpacity: number;
  borderColor: string | null;
  borderWidth: number;
  borderDasharray?: number[];
  interactive: boolean;
  label: string;
}

export const HEX_STATE_STYLES: Record<HexStatus, HexStateStyle> = {
  available: {
    fillColor: '#3b82f6', // blue-500
    fillOpacity: 0.65,
    borderColor: '#60a5fa', // blue-400
    borderWidth: 1,
    interactive: true,
    label: 'Available',
  },
  upcoming: {
    fillColor: '#3b82f6',
    fillOpacity: 0.25,
    borderColor: '#60a5fa',
    borderWidth: 1,
    borderDasharray: [2, 2],
    interactive: false,
    label: 'Upcoming wave',
  },
  reserved: {
    fillColor: '#dc2626', // red-600
    fillOpacity: 0.7,
    borderColor: null,
    borderWidth: 0,
    interactive: true,
    label: 'Reserved',
  },
  'reserved-founding': {
    fillColor: '#dc2626',
    fillOpacity: 0.7,
    borderColor: '#e8b04a', // warm amber accent
    borderWidth: 2,
    interactive: true,
    label: 'Founding team',
  },
  activated: {
    fillColor: '#c4f061', // brand accent green
    fillOpacity: 1.0,
    borderColor: '#c4f061',
    borderWidth: 1,
    interactive: true,
    label: 'Activated',
  },
  'future-phase': {
    fillColor: '#3a3a3a', // muted grey
    fillOpacity: 0.2,
    borderColor: null,
    borderWidth: 0,
    interactive: false, // decorative only — no click handler
    label: 'Future phase',
  },
  restricted: {
    fillColor: '#3a3a3a',
    fillOpacity: 0.3,
    borderColor: null,
    borderWidth: 0,
    interactive: false,
    label: 'Restricted jurisdiction',
  },
};

/**
 * Resolution stepping by Mapbox zoom level.
 *
 * At low zoom (0-2) we render H3 Resolution 1 cells (~7 per continent) so
 * the globe reads as continental hexes. At zoom 3-5 we step to Resolution
 * 3. At zoom 6 and up we render Resolution 5, which is the cell size that
 * anchors the actual NFT-HEX licenses.
 */
export interface ResolutionStep {
  minZoom: number;
  maxZoom: number;
  h3Resolution: number;
}

export const RESOLUTION_STEPS: ResolutionStep[] = [
  { minZoom: 0, maxZoom: 2.99, h3Resolution: 1 },
  { minZoom: 3, maxZoom: 5.99, h3Resolution: 3 },
  { minZoom: 6, maxZoom: 24, h3Resolution: 5 },
];

export function resolutionForZoom(zoom: number): number {
  for (const step of RESOLUTION_STEPS) {
    if (zoom >= step.minZoom && zoom <= step.maxZoom) {
      return step.h3Resolution;
    }
  }
  return 5;
}

/**
 * Region quick-jump destinations. The HexMap component starts at
 * MAP_DEFAULTS center/zoom; the explorer page exposes buttons that
 * fly to each region below via the HexMap ref.
 */
export interface RegionDestination {
  name: string;
  center: [number, number]; // [lng, lat]
  zoom: number;
}

export const REGION_DESTINATIONS: RegionDestination[] = [
  { name: 'Los Angeles', center: [-118.4378, 34.0140], zoom: 7.5 },
  { name: 'New York', center: [-74.0060, 40.7128], zoom: 7.5 },
  { name: 'London', center: [-0.1278, 51.5074], zoom: 7.5 },
  { name: 'Tokyo', center: [139.6503, 35.6762], zoom: 7.5 },
  { name: 'Idaho', center: [-115.8485, 43.8843], zoom: 7.5 },
];

/**
 * Default landing view. Opens on Los Angeles at zoom 7.5 instead of a
 * global view: it shows the LA hex cluster (Tyler's founding hex + 39
 * external cells), triggers the viewport-driven context grid since
 * zoom >= CONTEXT_MIN_ZOOM (5.5), and gives the user something concrete
 * on first load. Region buttons let them jump to NY / London / Tokyo /
 * Idaho. To restore the full-globe initial view, swap
 * initialCenter/initialZoom for `[-30, 30]` / `1.6`.
 */
export const MAP_DEFAULTS = {
  style: 'mapbox://styles/mapbox/dark-v11',
  initialCenter: REGION_DESTINATIONS[0].center,
  initialZoom: REGION_DESTINATIONS[0].zoom,
  minZoom: 0.5,
  maxZoom: 12,
};

/**
 * Sanctioned/restricted jurisdiction list referenced by Terms §25.
 * Confirm with Beneficial Technology before going live; this is an
 * illustrative default.
 */
export const RESTRICTED_COUNTRY_CODES = [
  'IR', // Iran
  'KP', // North Korea
  'SY', // Syria
  'CU', // Cuba
  // Crimea/DNR/LNR/Kherson/Zaporizhzhia regions handled as polygons
];
