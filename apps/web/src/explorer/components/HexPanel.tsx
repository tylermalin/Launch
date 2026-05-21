'use client';

import { HEX_STATE_STYLES, type HexStatus } from './hex-map.constants';
import type { Phase1Hex } from './hex-map.types';

interface HexPanelProps {
  hex: Phase1Hex;
  links: {
    erc721MetadataUrl: string;
    cardanoReferenceNftUrl: string;
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

function statusBadgeStyle(status: HexStatus) {
  const s = HEX_STATE_STYLES[status];
  return {
    background: status === 'reserved-founding' ? '#3a2a0a' : status === 'reserved' ? '#3a1010' : status === 'available' ? '#10243a' : '#1f1f1f',
    color: s.fillColor,
    border: `1px solid ${s.borderColor ?? s.fillColor}`,
    borderRadius: 999,
    padding: '4px 10px',
    fontFamily: 'var(--font-mono, ui-monospace, "JetBrains Mono", monospace)',
    fontSize: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
  };
}

export function HexPanel({ hex, links, onReserveClick, onClose }: HexPanelProps) {
  const statusStyle = HEX_STATE_STYLES[hex.status];
  const isAvailable = hex.status === 'available';
  const isFounding = hex.status === 'reserved-founding';
  const isReserved = hex.status === 'reserved' || hex.status === 'activated';

  return (
    <aside
      role="dialog"
      aria-label={`Hex Node ${hex.nodeNumber} — ${hex.region}`}
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
      }}
    >
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-serif, "Fraunces", serif)', fontSize: 28, fontWeight: 400, margin: 0 }}>
          {hex.region}
        </h2>
        <span style={statusBadgeStyle(hex.status)}>{statusStyle.label}</span>
      </header>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: 20 }}
        >
          ×
        </button>
      )}

      {/* License NFT */}
      <Section title="License NFT">
        <div style={{ fontSize: 13, color: '#c8c8c8' }}>
          Genesis NFT preview for{' '}
          <code style={{ fontFamily: 'var(--font-mono, monospace)', color: '#c4f061' }}>
            {hex.h3Index}
          </code>
        </div>
        <Links>
          <Link href={links.erc721MetadataUrl}>View ERC-721 metadata JSON</Link>
          <Link href={links.cardanoReferenceNftUrl}>View Cardano CIP-0068 reference NFT</Link>
        </Links>
      </Section>

      {/* Geographic boundary */}
      <Section title="Geographic boundary & location">
        <Field label={hex.administrativeArea ?? 'Region'}>
          {[hex.locality, hex.administrativeArea, hex.postalCode, hex.country].filter(Boolean).join(', ')}
        </Field>
        <Field label="H3 cell">
          <code style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12 }}>{hex.h3Index}</code>
        </Field>
        <Field label="Resolution">
          H3 Resolution {hex.h3Resolution} · ~250 km² · cell #{hex.nodeNumber} of 200
        </Field>
        <p style={{ fontSize: 11, color: '#888', marginTop: 8 }}>
          Streets © Mapbox © OpenStreetMap. Boundary is the licensed H3 cell.
        </p>
      </Section>

      {/* Zone classification */}
      {hex.zoneClassification && (
        <Section title="Zone classification">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <strong style={{ textTransform: 'capitalize' }}>{hex.zoneClassification.replace('-', ' ')}</strong>
            <span style={{ color: '#c4f061' }}>{hex.geographicMultiplier?.toFixed(1)}×</span>
          </div>
          <Link href={links.zoneClassificationDocUrl}>How zones are classified</Link>
        </Section>
      )}

      {/* Data demand score */}
      {hex.dataDemandScore != null && (
        <Section title="Data Demand Score">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 32, lineHeight: 1 }}>
              {hex.dataDemandScore}
            </span>
            <span style={{ color: '#888' }}>/ 100</span>
          </div>
          <ScoreBar value={hex.dataDemandScore} />
          <Link href={links.dataDemandScoreDocUrl}>How this score is calculated</Link>
        </Section>
      )}

      {/* Pricing */}
      <Section title="Pricing">
        <Field label="Listing (reference)">${hex.listingReferenceUsd.toLocaleString()}</Field>
        <Field label="Genesis reserve">${hex.genesisReserveUsd.toLocaleString()}</Field>
        <Link href={links.pricingMethodologyDocUrl}>How pricing is set</Link>
      </Section>

      {/* What's included */}
      <Section title="What's included">
        <ul style={{ paddingLeft: 18, margin: 0, color: '#c8c8c8', fontSize: 13 }}>
          <li>One Hex Node hardware kit (estimated ship Sep 2026)</li>
          <li>NFT-HEX geographic operating license for this H3 cell</li>
          <li>Inclusion in the Genesis 200 program</li>
          <li>1.5× Genesis Year 1 Multiplier on validation compensation</li>
          <li>Up to 125,000 MLMA compensation, milestone-vested over 12 months of verified service</li>
        </ul>
        <p style={{ fontSize: 12, color: '#888', marginTop: 12, lineHeight: 1.55 }}>
          Tokens are not granted at purchase. They are earned over twelve months as verification
          service is rendered. Validation compensation begins after the Genesis Hex Sale audit
          (Oct 2026) confirms operational compliance.
        </p>
      </Section>

      {/* Terms of sale */}
      <Section title="Terms of sale">
        <ul style={{ paddingLeft: 18, margin: 0, color: '#c8c8c8', fontSize: 12, lineHeight: 1.55 }}>
          <li>One-time Genesis entry covers hardware kit and geographic license for this H3 cell.</li>
          <li>125,000 MLMA per-operator compensation pool vests over 12 months of verified service.</li>
          <li>Hardware must be installed and registered within 90 days of delivery or License is forfeited.</li>
          <li>Validation compensation depends on network conditions and is not guaranteed.</li>
        </ul>
        <p style={{ fontSize: 12, color: '#888', marginTop: 12 }}>
          By reserving, you agree to:
        </p>
        <Links>
          <Link href={links.purchaseAgreementUrl}>Hex Node Purchase & Preorder Agreement</Link>
          <Link href={links.termsAndConditionsUrl}>Terms and Conditions</Link>
          <Link href={links.tokenRewardsRiskUrl}>Token & Rewards Risk Disclosure</Link>
        </Links>
      </Section>

      {/* CTA */}
      <div style={{ marginTop: 24 }}>
        {isAvailable && (
          <button
            onClick={() => onReserveClick?.(hex)}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: '#3b82f6',
              color: '#0f0f0f',
              border: 'none',
              borderRadius: 4,
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              cursor: 'pointer',
            }}
          >
            Reserve this hex — ${hex.genesisReserveUsd.toLocaleString()}
          </button>
        )}
        {isReserved && !isFounding && (
          <div style={{ padding: '14px 20px', background: '#1f1010', borderRadius: 4, textAlign: 'center', fontFamily: 'var(--font-mono, monospace)', fontSize: 12, color: '#fda4a4', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Reserved · join waitlist for next wave
          </div>
        )}
        {isFounding && (
          <div style={{ padding: '14px 20px', background: '#2a1f0a', borderRadius: 4, textAlign: 'center', fontFamily: 'var(--font-mono, monospace)', fontSize: 12, color: '#e8b04a', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Held by founding team
          </div>
        )}
      </div>
    </aside>
  );
}

// -------- Internal helpers ------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px dashed #2a2a2a' }}>
      <h3
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: '#888',
          margin: '0 0 12px 0',
          fontWeight: 500,
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
      <span style={{ color: '#888' }}>{label}</span>
      <span style={{ color: '#e8e8e8' }}>{children}</span>
    </div>
  );
}

function Links({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>{children}</div>;
}

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: 11,
        color: '#c4f061',
        textDecoration: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      → {children}
    </a>
  );
}

function ScoreBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = clamped >= (i + 1) * 20;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6,
              background: filled ? '#c4f061' : '#2a2a2a',
              borderRadius: 1,
            }}
          />
        );
      })}
    </div>
  );
}
