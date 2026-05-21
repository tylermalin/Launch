'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react';
import mapboxgl from 'mapbox-gl';
import { polygonToCells } from 'h3-js';
import 'mapbox-gl/dist/mapbox-gl.css';

import {
  HEX_STATE_STYLES,
  MAP_DEFAULTS,
  resolutionForZoom,
  type HexStatus,
} from './hex-map.constants';
import { cellsToFeatureCollection } from '../lib/h3-utils';
import type {
  HexClickEvent,
  LandCellSet,
  Phase1Hex,
  Phase1Manifest,
} from './hex-map.types';

interface HexMapProps {
  /**
   * Mapbox public access token. Pass via NEXT_PUBLIC_MAPBOX_TOKEN.
   */
  accessToken: string;
  /**
   * Phase 1 manifest (200 hexes with status). Sourced from
   * /api/phase1-manifest in production; can be passed directly for static
   * rendering.
   */
  manifest: Phase1Manifest;
  /**
   * Pre-computed land cell sets at multiple resolutions. Render the one
   * whose resolution matches the current zoom level. Provide at least
   * one resolution — others are optional.
   */
  landCells: {
    r1?: LandCellSet;
    r3?: LandCellSet;
    r5?: LandCellSet;
  };
  /**
   * Click handler for interactive Phase 1 hexes. Future-phase grey
   * hexes are non-interactive and never fire this callback.
   */
  onHexClick?: (event: HexClickEvent) => void;
}

/**
 * Imperative handle exposed via React ref. Lets the parent page
 * trigger a flyTo from outside the component (e.g. region buttons).
 */
export interface HexMapHandle {
  flyTo: (center: [number, number], zoom: number) => void;
}

const PHASE1_SOURCE = 'phase1-hexes';
const LAND_SOURCE = 'land-hexes';
const CONTEXT_SOURCE = 'context-hexes';

/**
 * Zoom level at which the viewport-driven context hex grid becomes
 * visible. Below this we skip the polygonToCells computation entirely
 * to avoid generating massive cell sets at low zoom (a globe-wide
 * Res 5 fill is ~2M cells — that would crash).
 */
const CONTEXT_MIN_ZOOM = 5.5;

const ALL_PHASE1_STATUSES: HexStatus[] = [
  'available',
  'upcoming',
  'reserved',
  'reserved-founding',
  'activated',
];

export const HexMap = forwardRef<HexMapHandle, HexMapProps>(function HexMap(
  { accessToken, manifest, landCells, onHexClick }: HexMapProps,
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useImperativeHandle(ref, () => ({
    flyTo: (center, zoom) => {
      const map = mapRef.current;
      if (!map) return;
      map.flyTo({ center, zoom, duration: 1400, essential: true });
    },
  }), []);

  const [currentResolution, setCurrentResolution] = useState<number>(
    resolutionForZoom(MAP_DEFAULTS.initialZoom),
  );

  // -------- Initialize map ------------------------------------------------
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_DEFAULTS.style,
      center: MAP_DEFAULTS.initialCenter,
      zoom: MAP_DEFAULTS.initialZoom,
      minZoom: MAP_DEFAULTS.minZoom,
      maxZoom: MAP_DEFAULTS.maxZoom,
      projection: { name: 'globe' },
    });
    mapRef.current = map;

    map.on('zoom', () => {
      const z = map.getZoom();
      const r = resolutionForZoom(z);
      setCurrentResolution((prev) => (prev === r ? prev : r));
    });

    map.on('style.load', () => {
      map.setFog({});
    });

    // Viewport-driven context grid: compute the H3 cells visible in the
    // current viewport (excluding Phase 1 cells, which are already rendered
    // with full fill+border) and update the context source. Throttled to
    // run on moveend rather than every pan frame.
    const updateContextGrid = () => {
      if (!map.getSource(CONTEXT_SOURCE)) return;
      const zoom = map.getZoom();
      if (zoom < CONTEXT_MIN_ZOOM) {
        (map.getSource(CONTEXT_SOURCE) as mapboxgl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: [],
        });
        return;
      }
      const b = map.getBounds();
      if (!b) return;
      const sw = b.getSouthWest();
      const ne = b.getNorthEast();
      // h3-js polygonToCells with flipped=true expects [lng, lat] (GeoJSON).
      const viewportPolygon: [number, number][] = [
        [sw.lng, sw.lat],
        [ne.lng, sw.lat],
        [ne.lng, ne.lat],
        [sw.lng, ne.lat],
        [sw.lng, sw.lat],
      ];
      const resolution = resolutionForZoom(zoom);
      let cells: string[];
      try {
        cells = polygonToCells(viewportPolygon, resolution, /* flipped */ true);
      } catch {
        cells = [];
      }
      // Exclude active Phase 1 cells — they're rendered by the phase1 layer
      // and we don't want a duplicate outline on top of them.
      const phase1Set = new Set(manifest.hexes.map((h) => h.h3Index));
      const contextCells = cells.filter((c) => !phase1Set.has(c));
      // Hard cap to keep performance sane if the viewport is huge.
      const MAX_CONTEXT_CELLS = 4000;
      const trimmed = contextCells.slice(0, MAX_CONTEXT_CELLS);
      const data = cellsToFeatureCollection(trimmed, () => ({}));
      (map.getSource(CONTEXT_SOURCE) as mapboxgl.GeoJSONSource).setData(data);
    };

    map.on('moveend', updateContextGrid);
    map.on('zoomend', updateContextGrid);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [accessToken]);

  // -------- Render layers when map style + sources are ready -------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const ready = () => addLayers(map);
    if (map.isStyleLoaded()) ready();
    else map.once('load', ready);

    function addLayers(m: mapboxgl.Map) {
      // Land cell baseline (decorative future-phase backdrop).
      const landSet =
        currentResolution === 1
          ? landCells.r1
          : currentResolution === 3
          ? landCells.r3
          : landCells.r5;

      if (landSet) {
        const landGeoJson = cellsToFeatureCollection(landSet.cells, () => ({
          status: 'future-phase' as HexStatus,
        }));
        if (m.getSource(LAND_SOURCE)) {
          (m.getSource(LAND_SOURCE) as mapboxgl.GeoJSONSource).setData(
            landGeoJson,
          );
        } else {
          m.addSource(LAND_SOURCE, { type: 'geojson', data: landGeoJson });
          const style = HEX_STATE_STYLES['future-phase'];
          m.addLayer({
            id: 'land-hexes-fill',
            type: 'fill',
            source: LAND_SOURCE,
            paint: {
              'fill-color': style.fillColor,
              'fill-opacity': style.fillOpacity,
            },
          });
        }
      }

      // Viewport-driven context grid — outlines only, no fill. Generated
      // on-the-fly from h3-js polygonToCells whenever the user pans or
      // zooms (handlers attached in the init effect). Excludes Phase 1
      // cells to avoid double-rendering on top of the colored layer.
      if (!m.getSource(CONTEXT_SOURCE)) {
        m.addSource(CONTEXT_SOURCE, {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        });
        m.addLayer({
          id: 'context-hexes-outline',
          type: 'line',
          source: CONTEXT_SOURCE,
          minzoom: CONTEXT_MIN_ZOOM,
          paint: {
            'line-color': 'rgba(255, 255, 255, 0.08)',
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              CONTEXT_MIN_ZOOM,
              0.3,
              8,
              0.6,
              10,
              1.0,
            ],
          },
        });
      }

      // Phase 1 hexes — interactive layer.
      const phase1GeoJson = cellsToFeatureCollection(
        manifest.hexes.map((h) => h.h3Index),
        (h3Index) => {
          const hex = manifest.hexes.find((h) => h.h3Index === h3Index)!;
          return {
            status: hex.status,
            nodeNumber: hex.nodeNumber,
            region: hex.region,
            operator: hex.operator,
          };
        },
      );

      if (m.getSource(PHASE1_SOURCE)) {
        (m.getSource(PHASE1_SOURCE) as mapboxgl.GeoJSONSource).setData(
          phase1GeoJson,
        );
      } else {
        m.addSource(PHASE1_SOURCE, {
          type: 'geojson',
          data: phase1GeoJson,
        });

        // Fill layer with Mapbox expression for per-status colors.
        m.addLayer({
          id: 'phase1-hexes-fill',
          type: 'fill',
          source: PHASE1_SOURCE,
          paint: {
            'fill-color': [
              'match',
              ['get', 'status'],
              'available',
              HEX_STATE_STYLES.available.fillColor,
              'upcoming',
              HEX_STATE_STYLES.upcoming.fillColor,
              'reserved',
              HEX_STATE_STYLES.reserved.fillColor,
              'reserved-founding',
              HEX_STATE_STYLES['reserved-founding'].fillColor,
              'activated',
              HEX_STATE_STYLES.activated.fillColor,
              /* default */ HEX_STATE_STYLES['future-phase'].fillColor,
            ],
            'fill-opacity': [
              'match',
              ['get', 'status'],
              'available',
              HEX_STATE_STYLES.available.fillOpacity,
              'upcoming',
              HEX_STATE_STYLES.upcoming.fillOpacity,
              'reserved',
              HEX_STATE_STYLES.reserved.fillOpacity,
              'reserved-founding',
              HEX_STATE_STYLES['reserved-founding'].fillOpacity,
              'activated',
              HEX_STATE_STYLES.activated.fillOpacity,
              0.5,
            ],
          },
        });

        // Border layer, primarily so founding-team hexes can show the
        // amber 2px outline that distinguishes them from external sales.
        m.addLayer({
          id: 'phase1-hexes-border',
          type: 'line',
          source: PHASE1_SOURCE,
          paint: {
            'line-color': [
              'match',
              ['get', 'status'],
              'available',
              HEX_STATE_STYLES.available.borderColor!,
              'upcoming',
              HEX_STATE_STYLES.upcoming.borderColor!,
              'reserved-founding',
              HEX_STATE_STYLES['reserved-founding'].borderColor!,
              'activated',
              HEX_STATE_STYLES.activated.borderColor!,
              /* default */ 'rgba(0,0,0,0)',
            ],
            'line-width': [
              'match',
              ['get', 'status'],
              'available',
              HEX_STATE_STYLES.available.borderWidth,
              'upcoming',
              HEX_STATE_STYLES.upcoming.borderWidth,
              'reserved-founding',
              HEX_STATE_STYLES['reserved-founding'].borderWidth,
              'activated',
              HEX_STATE_STYLES.activated.borderWidth,
              0,
            ],
          },
        });

        // Click + cursor handlers. Only attached to phase1 layer, so the
        // future-phase land backdrop stays non-interactive by design.
        m.on('click', 'phase1-hexes-fill', (e) => {
          const feat = e.features?.[0];
          if (!feat) return;
          const status = feat.properties?.status as HexStatus;
          if (!ALL_PHASE1_STATUSES.includes(status)) return;
          if (!HEX_STATE_STYLES[status].interactive) return;
          const h3Index = feat.properties?.h3Index as string;
          const hex = manifest.hexes.find((h) => h.h3Index === h3Index);
          if (!hex) return;
          onHexClick?.({
            hex,
            screenX: e.point.x,
            screenY: e.point.y,
          });
        });

        m.on('mouseenter', 'phase1-hexes-fill', (e) => {
          const feat = e.features?.[0];
          const status = feat?.properties?.status as HexStatus | undefined;
          if (status && HEX_STATE_STYLES[status].interactive) {
            m.getCanvas().style.cursor = 'pointer';
          }
        });
        m.on('mouseleave', 'phase1-hexes-fill', () => {
          m.getCanvas().style.cursor = '';
        });
      }
    }
  }, [currentResolution, landCells, manifest, onHexClick]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', background: '#0f0f0f' }}
      aria-label="Mālama Hex Node Explorer"
    />
  );
});
