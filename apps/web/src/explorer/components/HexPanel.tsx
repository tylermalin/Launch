'use client';

import { cellArea, cellToBoundary } from 'h3-js';
import { HEX_STATE_STYLES, type HexStatus } from './hex-map.constants';
import type { Phase1Hex } from './hex-map.types';

// ── Classification system ──────────────────────────────────────────────────
// Distance thresholds are degree-distance from regional city centre
// (cosine-corrected for longitude compression), matching /docs/pricing.

const CITY_CENTERS: Record<string, [number, number]> = {
  'Los Angeles':   [34.0522, -118.2437],
  'New York City': [40.7128,  -74.0060],
  'London':        [51.5074,   -0.1278],
  'Tokyo':         [35.6762,  139.6503],
  'Idaho':         [43.6150, -116.2023],
}

type Classification = {
  key: 'urban-core' | 'urban' | 'suburban' | 'rural' | 'remote'
  label: string
  multiplier: number
  color: string
}

function classifyHex(lat: number, lng: number, region: string): Classification {
  const center = CITY_CENTERS[region]
  if (!center) return { key: 'rural', label: 'RURAL', multiplier: 1.35, color: '#06b6d4' }
  const dlat = lat - center[0]
  const dlng = (lng - center[1]) * Math.cos(lat * Math.PI / 180)
  const dist  = Math.sqrt(dlat ** 2 + dlng ** 2)

  if (dist < 0.30) return { key: 'urban-core', label: 'URBAN CORE', multiplier: 0.90, color: '#f97316' }
  if (dist < 0.80) return { key: 'urban',      label: 'URBAN',      multiplier: 1.00, color: '#eab308' }
  if (dist < 2.20) return { key: 'suburban',   label: 'SUBURBAN',   multiplier: 1.15, color: '#22c55e' }
  if (dist < 3.80) return { key: 'rural',      label: 'RURAL',      multiplier: 1.35, color: '#06b6d4' }
  return               { key: 'remote',     label: 'REMOTE',     multiplier: 1.60, color: '#a78bfa' }
}

// ── Props ──────────────────────────────────────────────────────────────────

interface HexPanelProps {
  hex: Phase1Hex;
  links: {
    erc721MetadataUrl: string;
    /** Pass null when the Cardano endpoint isn't live yet — renders a disabled pill. */
    cardanoReferenceNftUrl: string | null;
    purchaseAgreementUrl: string;
    termsAndConditionsUrl: string;
    tokenRewardsRiskUrl: string;
    zoneClassificationDocUrl: string;
    dataDemandScoreDocUrl: string;
    pricingMethodologyDocUrl: string;
  };
  onReserveClick?: (hex: Phase1Hex) => void;
  onClose?: () => void;
}

// ── Badge style helpers ────────────────────────────────────────────────────

function statusBadgeStyle(status: HexStatus) {
  const s = HEX_STATE_STYLES[status]
  return {
    background: status === 'reserved-founding' ? '#3a2a0a'
              : status === 'reserved'           ? '#3a1010'
              : status === 'available'          ? '#10243a'
              :                                   '#1f1f1f',
    color: s.fillColor,
    border: `1px solid ${s.borderColor ?? s.fillColor}`,
    borderRadius: 999,
    padding: '4px 10px',
    fontFamily: 'var(--font-mono, ui-monospace, "JetBrains Mono", monospace)',
    fontSize: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
  }
}

function classificationBadgeStyle(color: string) {
  return {
    background: `${color}18`,
    color,
    border: `1px solid ${color}40`,
    borderRadius: 999,
    padding: '4px 10px',
    fontFamily: 'var(--font-mono, ui-monospace, "JetBrains Mono", monospace)',
    fontSize: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
  }
}

// ── Main component ─────────────────────────────────────────────────────────

export function HexPanel({ hex, links, onReserveClick, onClose }: HexPanelProps) {
  const statusStyle = HEX_STATE_STYLES[hex.status]
  const isAvailable = hex.status === 'available'
  const isFounding  = hex.status === 'reserved-founding'
  const isReserved  = hex.status === 'reserved' || hex.status === 'activated'

  // Derived values
  const classification = classifyHex(hex.centroidLat, hex.centroidLng, hex.region)
  const areaSqKm       = Math.round(cellArea(hex.h3Index, 'km2'))
  const claimId        = `G200-${String(hex.nodeNumber).padStart(3, '0')}`
  const dds            = hex.dataDemandScore ?? 50
  const computedMlma   = Math.round(125_000 * 1.5 * classification.multiplier * (dds / 50))
  // Image URL for the NFT artwork preview (1080×1080 SVG)
  const nftImageUrl    = `/api/nft/${hex.nodeNumber}/image?hexId=${encodeURIComponent(hex.h3Index)}`

  return (
    <aside
      role="dialog"
      aria-label={`Hex Node ${hex.nodeNumber} · ${hex.region}`}
      style={{
        width: 380,
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#0f0f0f',
        color: '#e8e8e8',
        border: '1px solid #2a2a2a',
        borderRadius: 6,
        padding: 24,
        fontFamily: 'var(--font-sans, "Inter Tight", system-ui, sans-serif)',
        fontSize: 14,
        lineHeight: 1.55,
        position: 'relative',
      }}
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'transparent', border: 'none',
            color: '#888', cursor: 'pointer', fontSize: 20,
          }}
        >
          ×
        </button>
      )}

      {/* ── Header — region · claim ID · badges ── */}
      <header style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <h2 style={{
            fontFamily: 'var(--font-serif, "Fraunces", serif)',
            fontSize: 28, fontWeight: 400, margin: 0,
          }}>
            {hex.region}
          </h2>
          <span style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 11, color: '#555',
          }}>
            {claimId}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={statusBadgeStyle(hex.status)}>{statusStyle.label}</span>
          <span style={classificationBadgeStyle(classification.color)}>{classification.label}</span>
        </div>
      </header>

      {/* ── § License NFT — image preview + metadata links ── */}
      <Section title="License NFT">
        {/* NFT artwork preview */}
        <div style={{
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid #1e1e1e',
          marginBottom: 12,
          background: '#060e1a',
          aspectRatio: '1 / 1',
          lineHeight: 0,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={nftImageUrl}
            alt={`Genesis Node License ${claimId}`}
            width={332}
            height={332}
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            loading="lazy"
          />
        </div>
        <Links>
          <ExternalLink href={links.erc721MetadataUrl}>View ERC-721 metadata JSON</ExternalLink>
          {links.cardanoReferenceNftUrl
            ? <ExternalLink href={links.cardanoReferenceNftUrl}>View Cardano CIP-0068 reference NFT</ExternalLink>
            : <DisabledLink>Cardano CIP-0068 reference NFT · on-chain pending</DisabledLink>
          }
        </Links>
      </Section>

      {/* ── § Geographic boundary — H3 cell outline + location fields ── */}
      <Section title="Geographic boundary & location">
        {/* H3 cell boundary visualisation */}
        <div style={{
          borderRadius: 6,
          overflow: 'hidden',
          border: '1px solid #1a2535',
          marginBottom: 14,
          lineHeight: 0,
        }}>
          <HexBoundaryPreview h3Index={hex.h3Index} />
        </div>
        <Field label="Region">
          {[hex.locality, hex.administrativeArea, hex.postalCode, hex.country]
            .filter(Boolean).join(', ') || hex.region}
        </Field>
        <Field label="H3 cell">
          <code style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11 }}>
            {hex.h3Index}
          </code>
        </Field>
        <Field label="Resolution">
          H3 Res {hex.h3Resolution} · ~{areaSqKm} km² · cell {hex.nodeNumber} of 200
        </Field>
        <p style={{ fontSize: 11, color: '#555', marginTop: 8 }}>
          Boundary is the licensed H3 cell. Streets © Mapbox © OpenStreetMap.
        </p>
      </Section>

      {/* ── § Zone classification — always rendered (computed from coords) ── */}
      <Section title="Zone classification">
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: 2,
              background: classification.color,
            }} />
            <strong style={{ fontSize: 13 }}>{classification.label}</strong>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 12, color: '#c4f061',
          }}>
            {classification.multiplier.toFixed(2)}× multiplier
          </span>
        </div>
        <p style={{ fontSize: 11, color: '#444', margin: 0 }}>
          Derived from centroid distance to regional centre. Population-density
          classification is a future dataset integration.
        </p>
      </Section>

      {/* ── § Data Demand Score ── */}
      {hex.dataDemandScore != null && (
        <Section title="Data Demand Score">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{
              fontFamily: 'var(--font-serif, serif)',
              fontSize: 32, lineHeight: 1,
            }}>
              {hex.dataDemandScore}
            </span>
            <span style={{ color: '#888' }}>/ 100</span>
          </div>
          <ScoreBar value={hex.dataDemandScore} />
          <InternalLink href={links.dataDemandScoreDocUrl}>
            → How this score is calculated
          </InternalLink>
        </Section>
      )}

      {/* ── § Pricing ── */}
      <Section title="Pricing">
        <Field label="Listing (reference)">${hex.listingReferenceUsd.toLocaleString()}</Field>
        <Field label="Genesis reserve">${hex.genesisReserveUsd.toLocaleString()}</Field>
        <InternalLink href={links.pricingMethodologyDocUrl}>→ How pricing is set</InternalLink>
      </Section>

      {/* ── § Reward multiplier stack ── */}
      <Section title="Reward multiplier stack">
        <MultiplierRow label="Genesis Year 1 Multiplier" value="1.50×" color="#c4f061" />
        <MultiplierRow
          label="Hex Type Multiplier"
          value={`${classification.multiplier.toFixed(2)}×`}
          color={classification.color}
        />
        <MultiplierRow
          label="Data Demand Score"
          value={`${hex.dataDemandScore ?? '—'} / 100`}
          color="#e8e8e8"
        />
        <div style={{ borderTop: '1px dashed #2a2a2a', marginTop: 10, paddingTop: 10 }}>
          <Field label="Up to (computed)">
            <span style={{
              color: '#c4f061',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12,
            }}>
              {computedMlma.toLocaleString()} MLMA
            </span>
          </Field>
          <p style={{ fontSize: 11, color: '#444', margin: '6px 0 0' }}>
            = 125,000 × 1.5× Year 1 × {classification.multiplier.toFixed(2)}× hex ×
            (DDS ÷ 50). Earned across milestones; not guaranteed.
          </p>
        </div>
      </Section>

      {/* ── § What's included ── */}
      <Section title="What's included">
        <ul style={{ paddingLeft: 18, margin: 0, color: '#ffffff', fontSize: 13 }}>
          <li>One Hex Node hardware kit (ships end of December 2026)</li>
          <li>NFT-HEX geographic operating licence for this H3 cell</li>
          <li>Inclusion in the Genesis 200 programme</li>
          <li>1.5× Genesis Year 1 Multiplier on validation compensation</li>
          <li>
            Up to{' '}
            <strong style={{ color: '#c4f061' }}>{computedMlma.toLocaleString()} MLMA</strong>
            {' '}earned across operational milestones
          </li>
          <li>
            Hardware must be installed and registered within 90 days of
            delivery or Licence is forfeited
          </li>
          <li>
            Validation compensation begins after the Genesis Hex Sale audit
            (Oct 2026) confirms operational compliance
          </li>
        </ul>
      </Section>

      {/* ── § Terms of sale ── */}
      <Section title="Terms of sale">
        <ul style={{ paddingLeft: 18, margin: 0, color: '#ffffff', fontSize: 12, lineHeight: 1.55 }}>
          <li>
            One-time Genesis entry covers hardware kit and geographic licence for this H3 cell.
          </li>
          <li>
            125,000 MLMA per operator vested across milestones: 15% at hardware boot,
            15% at PONO 90-day credential, 20% at 6 months, 20% at 9 months, 30% at
            12 months. Milestones require continuous PONO credential, ≥99% uptime,
            and no tamper events.
          </li>
          <li>
            Hardware must be installed and registered within 90 days of delivery or
            Licence is forfeited.
          </li>
          <li>Validation compensation depends on network conditions and is not guaranteed.</li>
        </ul>
        <p style={{ fontSize: 12, color: '#888', marginTop: 12 }}>By reserving, you agree to:</p>
        <Links>
          <ExternalLink href={links.purchaseAgreementUrl}>
            Hex Node Purchase &amp; Preorder Agreement
          </ExternalLink>
          <ExternalLink href={links.termsAndConditionsUrl}>Terms and Conditions</ExternalLink>
          <ExternalLink href={links.tokenRewardsRiskUrl}>Token &amp; Rewards Risk Disclosure</ExternalLink>
        </Links>
      </Section>

      {/* ── CTA ── */}
      <div style={{ marginTop: 24 }}>
        {isAvailable && (
          <button
            onClick={() => onReserveClick?.(hex)}
            style={{
              width: '100%', padding: '14px 20px',
              background: '#3b82f6', color: '#0f0f0f',
              border: 'none', borderRadius: 4,
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              cursor: 'pointer',
            }}
          >
            Reserve this hex · ${hex.genesisReserveUsd.toLocaleString()}
          </button>
        )}
        {isReserved && !isFounding && (
          <div style={{
            padding: '14px 20px', background: '#1f1010', borderRadius: 4,
            textAlign: 'center', fontFamily: 'var(--font-mono, monospace)',
            fontSize: 12, color: '#fda4a4',
            textTransform: 'uppercase', letterSpacing: '0.12em',
          }}>
            Reserved · join waitlist for next wave
          </div>
        )}
        {isFounding && (
          <div style={{
            padding: '14px 20px', background: '#2a1f0a', borderRadius: 4,
            textAlign: 'center', fontFamily: 'var(--font-mono, monospace)',
            fontSize: 12, color: '#e8b04a',
            textTransform: 'uppercase', letterSpacing: '0.12em',
          }}>
            Held by Mālama Labs
          </div>
        )}
      </div>
    </aside>
  )
}

// ── Internal helpers ───────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px dashed #2a2a2a' }}>
      <h3 style={{
        fontFamily: 'var(--font-mono, monospace)', fontSize: 10,
        textTransform: 'uppercase', letterSpacing: '0.15em',
        color: '#888', margin: '0 0 12px 0', fontWeight: 500,
      }}>
        {title}
      </h3>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
      <span style={{ color: '#888' }}>{label}</span>
      <span style={{ color: '#e8e8e8', textAlign: 'right', maxWidth: '60%' }}>{children}</span>
    </div>
  )
}

function MultiplierRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
      <span style={{ color: '#888' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono, monospace)', color }}>{value}</span>
    </div>
  )
}

function Links({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>{children}</div>
}

/** Opens in a new tab — for API endpoints and external legal docs. */
function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: 'var(--font-mono, monospace)', fontSize: 11,
        color: '#c4f061', textDecoration: 'none',
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}
    >
      → {children}
    </a>
  )
}

/** Same-tab navigation — for internal /docs pages. */
function InternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        fontFamily: 'var(--font-mono, monospace)', fontSize: 11,
        color: '#c4f061', textDecoration: 'none',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        display: 'block', marginTop: 8,
      }}
    >
      {children}
    </a>
  )
}

/** Shown when a link target isn't live yet. */
function DisabledLink({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono, monospace)', fontSize: 11,
      color: '#333', textTransform: 'uppercase',
      letterSpacing: '0.08em', cursor: 'not-allowed',
    }}>
      → {children}
    </span>
  )
}

function ScoreBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1, height: 6,
            background: clamped >= (i + 1) * 20 ? '#c4f061' : '#2a2a2a',
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Renders the H3 cell boundary as a compact SVG — no external dependency.
 * Uses cellToBoundary() from h3-js and a simple plate-carée projection.
 * All Genesis 200 hexes are at Res 5, so the shape is a regular-ish hexagon.
 */
function HexBoundaryPreview({ h3Index }: { h3Index: string }) {
  const boundary = cellToBoundary(h3Index) // [[lat, lng], …]

  const W = 332, H = 160, pad = 22

  const lats = boundary.map(([lat]) => lat)
  const lngs = boundary.map(([, lng]) => lng)
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs)

  const lngRange = maxLng - minLng || 0.001
  const latRange = maxLat - minLat || 0.001

  function project(lat: number, lng: number): [number, number] {
    const x = pad + ((lng - minLng) / lngRange) * (W - pad * 2)
    // Invert Y: higher latitude = lower SVG y
    const y = pad + ((maxLat - lat) / latRange) * (H - pad * 2)
    return [x, y]
  }

  const projected   = boundary.map(([lat, lng]) => project(lat, lng))
  const polyPoints  = projected.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const cx          = (W / 2).toFixed(1)
  const cy          = (H / 2).toFixed(1)
  // Unique suffix for SVG defs IDs (avoids conflicts if multiple panels exist)
  const uid         = h3Index.slice(-6)

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', background: '#060e18' }}
      aria-label={`H3 cell boundary for ${h3Index}`}
    >
      <defs>
        {/* Fine grid */}
        <pattern id={`grid-${uid}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20,0 L0,0 0,20" fill="none" stroke="#0d1e30" strokeWidth="0.8" />
        </pattern>
        {/* Subtle radial glow behind the hex */}
        <radialGradient id={`aura-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#c4f061" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#c4f061" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background with grid */}
      <rect width={W} height={H} fill={`url(#grid-${uid})`} />

      {/* Glow aura */}
      <ellipse cx={cx} cy={cy} rx="70" ry="52" fill={`url(#aura-${uid})`} />

      {/* H3 cell polygon */}
      <polygon
        points={polyPoints}
        fill="#c4f06112"
        stroke="#c4f061"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Vertex dots */}
      {projected.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.5"
                fill="#c4f06199" stroke="#c4f061" strokeWidth="0.5" />
      ))}

      {/* Centre crosshair */}
      <circle cx={cx} cy={cy} r="3"   fill="#c4f061" />
      <circle cx={cx} cy={cy} r="7"   fill="none" stroke="#c4f061"
              strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1={cx} y1={String(Number(cy) - 11)} x2={cx} y2={String(Number(cy) - 7)}
            stroke="#c4f061" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1={cx} y1={String(Number(cy) + 7)}  x2={cx} y2={String(Number(cy) + 11)}
            stroke="#c4f061" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1={String(Number(cx) - 11)} y1={cy} x2={String(Number(cx) - 7)} y2={cy}
            stroke="#c4f061" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1={String(Number(cx) + 7)}  y1={cy} x2={String(Number(cx) + 11)} y2={cy}
            stroke="#c4f061" strokeWidth="0.8" strokeOpacity="0.5" />

      {/* H3 index label — bottom-left corner */}
      <text
        x={pad} y={H - 8}
        fontSize="8" fontFamily="monospace"
        fill="#c4f06145" letterSpacing="0.5"
      >
        {h3Index}
      </text>
    </svg>
  )
}
