'use client';

/**
 * Additive review route for the new Hex Explorer module.
 *
 * Mounts apps/web/src/explorer/components/{HexMap, HexPanel} for visual
 * review. The existing /app/map route is unchanged and still uses the
 * legacy MapPageClient. To compare implementations, visit:
 *
 *   /map        → existing MapPageClient
 *   /explorer   → new HexMap + HexPanel (this file)
 */

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { cellToLatLng, getResolution } from 'h3-js';

import { HexPanel } from '@/explorer/components/HexPanel';
import { REGION_DESTINATIONS } from '@/explorer/components/hex-map.constants';
import type { HexMapHandle } from '@/explorer/components/HexMap';
import type {
  LandCellSet,
  Phase1Hex,
  Phase1Manifest,
} from '@/explorer/components/hex-map.types';

/**
 * The 5 Mālama Labs reserved nodes (one per region, H3 Res 3).
 * These arrive pre-marked as `reserved` from /api/hexes — no override needed.
 * Kept here as a lookup so the explorer can label them distinctly in the panel.
 *
 * Res-6 lab cells (~36 km² each — city-district scale):
 *   8629a1d77ffffff → West Coast    (Los Angeles, CA)
 *   865d144efffffff → Pacific       (Haiku, Maui, HI)
 *   8628846e7ffffff → Mountain West (Idaho City, ID)
 *   862740767ffffff → Midwest       (Sister Bay, WI)
 *   8626cb917ffffff → South & East  (Dallas, TX)
 */
const MALAMA_RESERVED_HEX_LABELS: Record<string, { operator: string; label: string }> = {
  '8629a1d77ffffff': { operator: 'Mālama Labs', label: 'Los Angeles'  },
  '865d144efffffff': { operator: 'Mālama Labs', label: 'Haiku, Hawaii' },
  '8628846e7ffffff': { operator: 'Mālama Labs', label: 'Idaho City'   },
  '862740767ffffff': { operator: 'Mālama Labs', label: 'Sister Bay'   },
  '8626cb917ffffff': { operator: 'Mālama Labs', label: 'Dallas'       },
};

// HexMap pulls in mapbox-gl which is browser-only; load it client-side only.
const HexMap = dynamic(
  () => import('@/explorer/components/HexMap').then((m) => m.HexMap),
  { ssr: false, loading: () => <MapLoading /> },
);

export default function ExplorerPage() {
  const [selected, setSelected] = useState<Phase1Hex | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>(REGION_DESTINATIONS[0].name);
  const [manifest, setManifest] = useState<Phase1Manifest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const mapRef = useRef<HexMapHandle | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
  const isPlaceholder =
    token === 'pk.your_token_here' || token === 'pk.your_mapbox_token_here';

  // Load the live Genesis hex catalog from /api/hexes so hex IDs match
  // the rest of the app — that's what makes Reserve actually work.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/hexes', { cache: 'no-store' });
        if (!r.ok) throw new Error(`/api/hexes returned ${r.status}`);
        const fc = (await r.json()) as {
          features: Array<{
            properties: Record<string, unknown>;
          }>;
        };
        const built = buildManifestFromApi(fc);
        if (!cancelled) setManifest(built);
      } catch (e) {
        if (!cancelled) setLoadError(String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!token || isPlaceholder) {
    return <MissingToken isPlaceholder={isPlaceholder} />;
  }
  if (loadError) {
    return <LoadError message={loadError} />;
  }
  if (!manifest) {
    return <MapLoading />;
  }

  const handleRegionClick = (regionName: string) => {
    const dest = REGION_DESTINATIONS.find((r) => r.name === regionName);
    if (!dest) return;
    setActiveRegion(regionName);
    mapRef.current?.flyTo(dest.center, dest.zoom);
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 4rem)', background: '#0f0f0f' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <HexMap
          ref={mapRef}
          accessToken={token}
          manifest={manifest}
          // Land-cell backdrop is optional; omit it for first-review until
          // generate-land-hexes.mjs is run with Natural Earth input.
          landCells={{} as { r1?: LandCellSet; r3?: LandCellSet; r5?: LandCellSet }}
          onHexClick={({ hex }) => setSelected(hex)}
        />
        <RegionJumpBar activeRegion={activeRegion} onSelect={handleRegionClick} />
        <ReviewBanner />
      </div>
      {selected && (
        <div style={{ flexShrink: 0, padding: 16 }}>
          <HexPanel
            hex={selected}
            links={{
              erc721MetadataUrl: `/api/nft/${selected.nodeNumber}?hexId=${selected.h3Index}`,
              cardanoReferenceNftUrl: null, // Cardano metadata endpoint not yet live
              purchaseAgreementUrl: '/legal/hex-node-purchase-agreement',
              termsAndConditionsUrl: '/legal',
              tokenRewardsRiskUrl: '/legal/token-rewards-risk',
              zoneClassificationDocUrl: '/docs/zone-classification',
              dataDemandScoreDocUrl: '/docs/data-demand-score-methodology',
              pricingMethodologyDocUrl: '/docs/pricing',
            }}
            onReserveClick={(hex) => {
              // /explorer now uses the same hex catalog as /api/hexes, so
              // we can deep-link straight into the live reserve flow.
              window.location.href = `/presale?hex=${hex.h3Index}`;
            }}
            onClose={() => setSelected(null)}
          />
        </div>
      )}
    </div>
  );
}

function MapLoading() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: 'calc(100vh - 4rem)', color: '#888', fontFamily: 'monospace', fontSize: 13, background: '#0f0f0f' }}>
      Loading hex catalog…
    </div>
  );
}

function LoadError({ message }: { message: string }) {
  return (
    <div style={{ padding: 40, color: '#e8e8e8', fontFamily: 'system-ui', maxWidth: 720, margin: '40px auto' }}>
      <h1 style={{ fontFamily: 'serif', fontSize: 24, marginBottom: 12 }}>
        Could not load /api/hexes
      </h1>
      <pre style={{ background: '#1f1f1f', padding: 12, borderRadius: 4, color: '#fda4a4', fontSize: 12, overflowX: 'auto' }}>
        {message}
      </pre>
      <p style={{ color: '#888', fontSize: 13, marginTop: 12 }}>
        The explorer pulls the live Genesis hex catalog from <code>/api/hexes</code>.
        Confirm the dev server is up and the route resolves.
      </p>
    </div>
  );
}

/**
 * Convert the /api/hexes FeatureCollection (legacy genesis-hexes
 * properties) into the Phase1Manifest shape this explorer expects.
 *
 * Status mapping:
 *   isHQ === true || sold === true || status === 'reserved' → reserved
 *   FOUNDING_HEX_OVERRIDES[id] present                       → reserved-founding
 *   otherwise                                                → available
 */
function buildManifestFromApi(fc: {
  features: Array<{ properties: Record<string, unknown> }>;
}): Phase1Manifest {
  // Deduplicate: /api/hexes returns 400 features (200 Base + 200 Cardano)
  // for the same 200 H3 cells. Collapse on h3Index so each cell renders
  // once on the map.
  const byH3 = new Map<string, Phase1Hex>();

  fc.features.forEach((feat, idx) => {
    const p = feat.properties as {
      id: string;
      region: string;
      regionLabel: string;
      status: string;
      sold: boolean;
      chain: 'base' | 'cardano';
      isHQ: boolean;
      dataScore: number;
      startingBid: number;
    };
    const h3Index = p.id;
    if (byH3.has(h3Index)) return; // already counted from the other chain

    const [lat, lng] = cellToLatLng(h3Index);
    const malamaLabel = MALAMA_RESERVED_HEX_LABELS[h3Index];
    const upstreamReserved = Boolean(p.sold) || p.status === 'reserved' || p.isHQ || Boolean((p as Record<string,unknown>).isMalamaReserved);
    const status: Phase1Hex['status'] = malamaLabel
      ? 'reserved-founding'
      : upstreamReserved
      ? 'reserved'
      : 'available';

    // All Genesis Res-3 regions are US territory (West, Pacific/AK, Mountain, Midwest, South).
    const country = 'US';

    // TODO: wire population dataset to compute zoneClassification at build time.
    // For now, leave null and emit a dev warning.
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[explorer] zoneClassification not computed for ${h3Index} — no population dataset wired.`);
    }

    byH3.set(h3Index, {
      nodeNumber: idx + 1,
      h3Index,
      h3Resolution: getResolution(h3Index),
      status,
      operator: malamaLabel?.operator ?? null,
      region: p.regionLabel ?? p.region,
      country,
      administrativeArea: null,
      locality: malamaLabel?.label ?? null,
      postalCode: null,
      centroidLat: lat,
      centroidLng: lng,
      zoneClassification: null,
      geographicMultiplier: null,
      dataDemandScore: p.dataScore ?? null,
      listingReferenceUsd: p.startingBid ?? 2228,
      genesisReserveUsd: 2000,
      notes: undefined,
    });
  });

  const hexes = Array.from(byH3.values()).map((h, i) => ({ ...h, nodeNumber: i + 1 }));
  const reservedCount = hexes.filter((h) => h.status !== 'available').length;

  return {
    schemaVersion: '1.0.0',
    manifestName: 'Phase 1 Hex Node Launchpad (live from /api/hexes)',
    h3Resolution: hexes[0]?.h3Resolution ?? 5,
    totalCells: hexes.length,
    soldOrReserved: reservedCount,
    externalAvailable: hexes.length - reservedCount,
    lastUpdated: new Date().toISOString().slice(0, 10),
    wavesPolicy: 'Live catalog from /api/hexes',
    regions: ['West Coast', 'Pacific & Alaska', 'Mountain West', 'Midwest', 'South & East'],
    statusVocabulary: {
      available: 'Open for reservation',
      upcoming: 'Held back for a future wave',
      reserved: 'Purchased by an operator or held by Mālama HQ',
      'reserved-founding': 'Held by the Mālama Labs founding team',
      activated: 'Hardware booted and signing on-chain',
      'future-phase': 'Land cell not yet in any Phase',
      restricted: 'Sales prohibited in this jurisdiction',
    },
    hexes,
  };
}

function RegionJumpBar({
  activeRegion,
  onSelect,
}: {
  activeRegion: string;
  onSelect: (name: string) => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 4,
        background: 'rgba(15,15,15,0.92)',
        border: '1px solid #2a2a2a',
        borderRadius: 999,
        padding: 4,
        boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
        zIndex: 10,
      }}
    >
      {REGION_DESTINATIONS.map((r) => {
        const isActive = r.name === activeRegion;
        return (
          <button
            key={r.name}
            onClick={() => onSelect(r.name)}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: 'none',
              background: isActive ? '#c4f061' : 'transparent',
              color: isActive ? '#0f0f0f' : '#c8c8c8',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 11,
              fontWeight: isActive ? 600 : 500,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 120ms ease',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = '#1f1f1f';
                (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = '#c8c8c8';
              }
            }}
          >
            {r.name}
          </button>
        );
      })}
    </div>
  );
}

function ReviewBanner() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        background: 'rgba(15,15,15,0.85)',
        border: '1px solid #2a2a2a',
        borderRadius: 4,
        padding: '10px 14px',
        fontFamily: 'monospace',
        fontSize: 11,
        color: '#c4f061',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        zIndex: 10,
      }}
    >
      Genesis Explorer · H3 Res 6 · 200 hexes · 5 regions
    </div>
  );
}

function MissingToken({ isPlaceholder = false }: { isPlaceholder?: boolean }) {
  return (
    <div style={{ padding: 40, color: '#e8e8e8', fontFamily: 'system-ui', maxWidth: 720, margin: '40px auto' }}>
      <h1 style={{ fontFamily: 'serif', fontSize: 28, marginBottom: 16 }}>
        {isPlaceholder
          ? 'NEXT_PUBLIC_MAPBOX_TOKEN is still the placeholder'
          : 'NEXT_PUBLIC_MAPBOX_TOKEN is not set'}
      </h1>
      <p style={{ color: '#c8c8c8', lineHeight: 1.6 }}>
        {isPlaceholder ? (
          <>
            Your{' '}
            <code style={{ background: '#1f1f1f', padding: '2px 6px', borderRadius: 3 }}>
              apps/web/.env.local
            </code>{' '}
            has the placeholder value. Replace it with a real Mapbox token:
          </>
        ) : (
          <>
            The Hex Explorer needs a Mapbox token to render the basemap. Add this to
            <code style={{ background: '#1f1f1f', padding: '2px 6px', borderRadius: 3, marginLeft: 4 }}>
              apps/web/.env.local
            </code>
            :
          </>
        )}
      </p>
      <pre style={{ background: '#1f1f1f', padding: 16, borderRadius: 4, marginTop: 12, color: '#c4f061', fontSize: 13 }}>
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijo...your_real_token...
      </pre>
      <p style={{ color: '#888', fontSize: 13, marginTop: 12 }}>
        Get a token at{' '}
        <a href="https://account.mapbox.com/access-tokens/" style={{ color: '#c4f061' }}>
          mapbox.com/account/access-tokens
        </a>
        , then restart the dev server (
        <code style={{ background: '#1f1f1f', padding: '2px 6px', borderRadius: 3 }}>
          kill the process · npm run dev
        </code>
        ).
      </p>
    </div>
  );
}
