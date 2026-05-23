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
 * H3 Resolution 3 (~12,392 km² / cell) is the canonical NFT-license size.
 * At low zoom (0-2) we render Resolution 1 for a continental overview.
 * At zoom 3-5 we switch to Resolution 3 — the actual license grid.
 * At zoom 6+ we render Resolution 5 to show fine sub-hex detail.
 */
export interface ResolutionStep {
  minZoom: number;
  maxZoom: number;
  h3Resolution: number;
}

export const RESOLUTION_STEPS: ResolutionStep[] = [
  { minZoom: 0,    maxZoom: 2.99, h3Resolution: 1 },
  { minZoom: 3,    maxZoom: 5.99, h3Resolution: 3 },
  { minZoom: 6,    maxZoom: 24,   h3Resolution: 5 },
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
  // Zoom 4.5 shows the Res-3 hex cluster around each lab node clearly.
  { name: 'West Coast',       center: [-118.2437,  34.0522], zoom: 4.5 }, // LA lab
  { name: 'Pacific & Alaska', center: [-156.3044,  20.9208], zoom: 5.0 }, // Haiku, HI lab
  { name: 'Mountain West',    center: [-115.8374,  43.8288], zoom: 4.5 }, // Idaho City lab
  { name: 'Midwest',          center: [ -87.1267,  45.1891], zoom: 4.5 }, // Sister Bay lab
  { name: 'South & East',     center: [ -96.7970,  32.7767], zoom: 4.0 }, // Dallas lab
];

/**
 * Default landing view. Opens on the continental US at zoom 3.5 so all
 * five Genesis regions are immediately visible as Res-3 hex clusters.
 * Region jump buttons fly to each lab node. To restore a global view,
 * swap initialCenter / initialZoom to `[-30, 30]` / `1.6`.
 */
export const MAP_DEFAULTS = {
  style: 'mapbox://styles/mapbox/dark-v11',
  initialCenter: [-98.5, 39.5] as [number, number], // geographic center of contiguous US
  initialZoom: 3.5,
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
