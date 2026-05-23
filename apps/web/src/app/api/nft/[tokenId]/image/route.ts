import {
  getClaimByClaimId,
  getClaimByEdition,
  getClaimForEvmToken,
} from '@/lib/genesis-claim-registry'
import { resolveNftDisplayEdition, resolveNftZone } from '@/lib/nft-zone'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId: tokenIdParam } = await params
  const { searchParams } = new URL(req.url)
  const claimIdQ   = searchParams.get('claimId')
  const chain      = searchParams.get('chain') ?? 'base'

  let claim = claimIdQ ? getClaimByClaimId(claimIdQ) : undefined
  if (!claim && chain === 'base')    claim = getClaimForEvmToken(Number(tokenIdParam))
  if (!claim && chain === 'cardano') claim = getClaimByEdition(Number(tokenIdParam))

  const hexId        = claim?.hexId ?? searchParams.get('hexId') ?? `genesis-${tokenIdParam}`
  const parsed       = Number(tokenIdParam)
  const editionNum   = resolveNftDisplayEdition(hexId, claim, Number.isFinite(parsed) ? parsed : 0)
  const genesisNum   = String(editionNum).padStart(3, '0')
  const claimIdLabel = claim?.claimId ?? claimIdQ ?? ''
  const zone         = resolveNftZone(hexId)

  // Chain theming
  const chainColor   = chain === 'cardano' ? '#0033AD' : '#0052FF'
  const chainLabel   = chain === 'cardano' ? 'CARDANO' : 'BASE L2'
  const chainNetwork = chain === 'cardano' ? 'Cardano' : 'Base L2'
  const chainAccent  = chain === 'cardano' ? '#60A5FA' : '#7BA3FF'

  // Vertical offset — when a Claim ID badge is present it occupies 32 px
  // and everything below it shifts down by that amount.
  const Y = claimIdLabel ? 32 : 0

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080"
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- ── Backgrounds ── -->
    <radialGradient id="bg" cx="50%" cy="42%" r="72%">
      <stop offset="0%"   stop-color="#0E1F3C"/>
      <stop offset="55%"  stop-color="#071020"/>
      <stop offset="100%" stop-color="#03080E"/>
    </radialGradient>
    <radialGradient id="hexAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#10B981" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
    </radialGradient>

    <!-- ── Accent gradients ── -->
    <linearGradient id="tealH" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#059669"/>
      <stop offset="50%"  stop-color="#34D399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="tealV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#6EE7B7"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="numGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#A7F3D0"/>
      <stop offset="60%"  stop-color="#34D399"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
    <linearGradient id="chainGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${chainColor}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${chainColor}" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="shine" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.045"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottomStrip" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#04090F"/>
      <stop offset="100%" stop-color="#020609"/>
    </linearGradient>

    <!-- ── Hex tile background pattern ── -->
    <pattern id="hexPat" x="0" y="0" width="64" height="74" patternUnits="userSpaceOnUse">
      <polygon points="32,4 60,20 60,54 32,70 4,54 4,20"
               fill="none" stroke="#10B981" stroke-width="0.7" stroke-opacity="0.07"/>
    </pattern>

    <!-- ── Glow filters ── -->
    <filter id="glow" color-interpolation-filters="sRGB"
            x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softGlow" color-interpolation-filters="sRGB"
            x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="bigGlow" color-interpolation-filters="sRGB"
            x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="28" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="numGlow" color-interpolation-filters="sRGB"
            x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- ── Card clip ── -->
    <clipPath id="card">
      <rect width="1080" height="1080" rx="24"/>
    </clipPath>
  </defs>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!--  CARD BODY                                                   -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <g clip-path="url(#card)">

    <!-- Layered backgrounds -->
    <rect width="1080" height="1080" fill="url(#bg)"/>
    <rect width="1080" height="1080" fill="url(#hexPat)"/>
    <rect width="1080" height="1080" fill="url(#shine)"/>

    <!-- ── TOP ACCENT BAR ── -->
    <rect x="0" y="0" width="1080" height="6" fill="url(#tealH)"/>

    <!-- ── BRAND HEADER ── -->
    <g transform="translate(48, 42)" filter="url(#softGlow)">
      <polygon points="24,0 46,13 46,37 24,50 2,37 2,13"
               fill="none" stroke="#10B981" stroke-width="2.5"/>
      <polygon points="24,10 36,17 36,33 24,40 12,33 12,17"
               fill="#10B98125" stroke="#10B98158" stroke-width="1.5"/>
      <text x="24" y="30" text-anchor="middle" font-size="14" font-weight="900"
            fill="#10B981" font-family="monospace">M</text>
    </g>
    <text x="108" y="72" font-size="15" font-weight="700" fill="#10B981"
          font-family="monospace" letter-spacing="2.5">MĀLAMA LABS</text>

    <!-- ── CHAIN BADGE ── -->
    <rect x="810" y="42" width="222" height="44" rx="22"
          fill="url(#chainGrad)" stroke="${chainColor}" stroke-width="1.2"
          stroke-opacity="0.55"/>
    <text x="921" y="69" text-anchor="middle" font-size="12" font-weight="900"
          fill="${chainAccent}" font-family="monospace" letter-spacing="2.5">${chainLabel}</text>

    <!-- ── EDITION BADGE ── -->
    <rect x="388" y="110" width="304" height="42" rx="21"
          fill="#10B98118" stroke="#10B98148" stroke-width="1.5"/>
    <text x="540" y="136" text-anchor="middle" font-size="12" font-weight="900"
          fill="#10B981" font-family="monospace" letter-spacing="4">GENESIS 200</text>

    <!-- ── CARD TITLE ── -->
    <text x="540" y="200" text-anchor="middle" font-size="19" font-weight="900"
          fill="#E2E8F0" font-family="sans-serif" letter-spacing="4">HEX NODE LICENSE</text>

    <!-- Thin rule under title -->
    <line x1="200" y1="218" x2="880" y2="218"
          stroke="#10B981" stroke-width="0.6" stroke-opacity="0.2"/>

    <!-- ── HEX ART — ambient aura (rendered behind rings) ── -->
    <ellipse cx="540" cy="418" rx="295" ry="268" fill="url(#hexAura)"/>

    <!-- Outer ghost ring (big-glow only, no fill) -->
    <g transform="translate(540, 418)" filter="url(#bigGlow)">
      <polygon points="0,-272 235,-136 235,136 0,272 -235,136 -235,-136"
               fill="none" stroke="#10B981" stroke-width="1" stroke-opacity="0.15"/>
    </g>

    <!-- ── HEX ART — main rings ── -->
    <g transform="translate(540, 418)">
      <!-- Ring 3 — outer structural (unglowed) -->
      <polygon points="0,-228 197,-114 197,114 0,228 -197,114 -197,-114"
               fill="none" stroke="#10B981" stroke-width="1.5" stroke-opacity="0.20"/>
      <!-- Ring 3 corner ticks -->
      <line x1="0" y1="-228" x2="0" y2="-214" stroke="#10B981" stroke-width="1.5" stroke-opacity="0.4"/>
      <line x1="197" y1="-114" x2="185" y2="-107" stroke="#10B981" stroke-width="1.5" stroke-opacity="0.4"/>
      <line x1="197" y1="114" x2="185" y2="107" stroke="#10B981" stroke-width="1.5" stroke-opacity="0.4"/>
      <line x1="0" y1="228" x2="0" y2="214" stroke="#10B981" stroke-width="1.5" stroke-opacity="0.4"/>
      <line x1="-197" y1="114" x2="-185" y2="107" stroke="#10B981" stroke-width="1.5" stroke-opacity="0.4"/>
      <line x1="-197" y1="-114" x2="-185" y2="-107" stroke="#10B981" stroke-width="1.5" stroke-opacity="0.4"/>

      <!-- Ring 2 — mid filled, soft-glowed -->
      <polygon points="0,-172 149,-86 149,86 0,172 -149,86 -149,-86"
               fill="#10B98107" stroke="#10B981" stroke-width="2"
               stroke-opacity="0.45" filter="url(#softGlow)"/>

      <!-- Ring 1 — inner bright, glowed -->
      <polygon points="0,-110 95,-55 95,55 0,110 -95,55 -95,-55"
               fill="#10B98118" stroke="#10B981" stroke-width="2.5"
               filter="url(#glow)"/>

      <!-- Core hex -->
      <polygon points="0,-56 48,-28 48,28 0,56 -48,28 -48,-28"
               fill="#10B98132" stroke="#10B981" stroke-width="2.5"
               filter="url(#glow)"/>

      <!-- Center node -->
      <circle cx="0" cy="0" r="16" fill="url(#tealV)" filter="url(#glow)"/>
      <circle cx="0" cy="0" r="8"  fill="#ECFDF5"/>

      <!-- Vertex dots on ring 1 -->
      <circle cx="0"   cy="-110" r="5" fill="#34D399" filter="url(#softGlow)"/>
      <circle cx="95"  cy="-55"  r="5" fill="#34D399" filter="url(#softGlow)"/>
      <circle cx="95"  cy="55"   r="5" fill="#34D399" filter="url(#softGlow)"/>
      <circle cx="0"   cy="110"  r="5" fill="#34D399" filter="url(#softGlow)"/>
      <circle cx="-95" cy="55"   r="5" fill="#34D399" filter="url(#softGlow)"/>
      <circle cx="-95" cy="-55"  r="5" fill="#34D399" filter="url(#softGlow)"/>

      <!-- Mid-ring accent dots -->
      <circle cx="0"    cy="-172" r="3" fill="#10B981" stroke="#10B981" stroke-width="1"
              stroke-opacity="0.5" filter="url(#softGlow)"/>
      <circle cx="149"  cy="-86"  r="3" fill="#10B981" filter="url(#softGlow)"/>
      <circle cx="149"  cy="86"   r="3" fill="#10B981" filter="url(#softGlow)"/>
      <circle cx="0"    cy="172"  r="3" fill="#10B981" filter="url(#softGlow)"/>
      <circle cx="-149" cy="86"   r="3" fill="#10B981" filter="url(#softGlow)"/>
      <circle cx="-149" cy="-86"  r="3" fill="#10B981" filter="url(#softGlow)"/>
    </g>

    <!-- ── GENESIS NUMBER — centred in hex ── -->
    <text x="540" y="432" text-anchor="middle"
          font-size="88" font-weight="900" fill="url(#numGrad)"
          font-family="monospace" filter="url(#numGlow)">#${genesisNum}</text>

    <!-- ── HEX ID ── -->
    <text x="540" y="664" text-anchor="middle"
          font-size="12" font-weight="600" fill="#374151"
          font-family="monospace" letter-spacing="0.8">${hexId}</text>

    ${claimIdLabel
      ? `<!-- Claim ID badge -->
    <rect x="390" y="678" width="300" height="32" rx="16"
          fill="#064E3B" stroke="#34D399" stroke-width="1" stroke-opacity="0.6"/>
    <text x="540" y="699" text-anchor="middle"
          font-size="13" font-weight="900" fill="#34D399"
          font-family="monospace" letter-spacing="2.5">${claimIdLabel}</text>`
      : ''}

    <!-- ── ZONE / REGION NAME ── -->
    <text x="540" y="${726 + Y}" text-anchor="middle"
          font-size="38" font-weight="900" fill="#F1F5F9"
          font-family="sans-serif">${zone}</text>

    <!-- ── STATS DIVIDER (top) ── -->
    <line x1="80"  y1="${768 + Y}" x2="1000" y2="${768 + Y}" stroke="#0F172A" stroke-width="2"/>
    <line x1="80"  y1="${769 + Y}" x2="1000" y2="${769 + Y}"
          stroke="#10B981" stroke-width="0.8" stroke-opacity="0.28"/>

    <!-- ── STATS ROW ── -->
    <!-- MLMA -->
    <text x="196" y="${806 + Y}" text-anchor="middle"
          font-size="11" fill="#4B5563" font-family="monospace" letter-spacing="2.5">MLMA</text>
    <text x="196" y="${845 + Y}" text-anchor="middle"
          font-size="34" font-weight="900" fill="#10B981"
          font-family="monospace" filter="url(#softGlow)">125K</text>

    <!-- Vertical dividers -->
    <line x1="372" y1="${782 + Y}" x2="372" y2="${860 + Y}" stroke="#0F172A" stroke-width="2"/>
    <line x1="708" y1="${782 + Y}" x2="708" y2="${860 + Y}" stroke="#0F172A" stroke-width="2"/>

    <!-- ENTRY -->
    <text x="540" y="${806 + Y}" text-anchor="middle"
          font-size="11" fill="#4B5563" font-family="monospace" letter-spacing="2.5">ENTRY</text>
    <text x="540" y="${845 + Y}" text-anchor="middle"
          font-size="34" font-weight="900" fill="#F1F5F9" font-family="monospace">$2,000</text>

    <!-- REVENUE -->
    <text x="884" y="${806 + Y}" text-anchor="middle"
          font-size="11" fill="#4B5563" font-family="monospace" letter-spacing="2.5">REVENUE</text>
    <text x="884" y="${845 + Y}" text-anchor="middle"
          font-size="22" font-weight="900" fill="#F59E0B" font-family="monospace">BEGINS 2027</text>

    <!-- ── STATS DIVIDER (bottom) ── -->
    <line x1="80" y1="${874 + Y}" x2="1000" y2="${874 + Y}" stroke="#0F172A" stroke-width="2"/>

    <!-- ── BOTTOM STRIP ── -->
    <rect x="0" y="${892 + Y}" width="1080" height="${188 - Y}" fill="url(#bottomStrip)"/>

    <text x="80" y="${936 + Y}" font-size="11" font-weight="700" fill="#374151"
          font-family="monospace" letter-spacing="2.5">VESTING SCHEDULE</text>
    <text x="80" y="${966 + Y}" font-size="15" font-weight="700" fill="#D1D5DB"
          font-family="monospace">15% Boot · 15% PONO · 20 / 20 / 30 at 6 / 9 / 12 mo</text>

    <text x="80" y="${1002 + Y}" font-size="11" font-weight="700" fill="#374151"
          font-family="monospace" letter-spacing="2.5">PAYMENT</text>
    <text x="80" y="${1032 + Y}" font-size="15" font-weight="700" fill="#D1D5DB"
          font-family="monospace">$2,000 USDC · ${chainNetwork}</text>

    <!-- Chain accent pill — bottom right of strip -->
    <rect x="920" y="${1012 + Y}" width="112" height="34" rx="17"
          fill="url(#chainGrad)" stroke="${chainColor}" stroke-width="1" stroke-opacity="0.4"/>
    <text x="976" y="${1034 + Y}" text-anchor="middle"
          font-size="10" font-weight="900" fill="${chainAccent}"
          font-family="monospace" letter-spacing="1.5">${chainLabel}</text>

    <!-- ── BOTTOM ACCENT BAR ── -->
    <rect x="0" y="1074" width="1080" height="6" fill="url(#tealH)"/>

  </g>

  <!-- ── OUTER BORDER (rendered outside clip so corners are crisp) ── -->
  <rect x="1.5" y="1.5" width="1077" height="1077" rx="23"
        fill="none" stroke="#10B981" stroke-width="1.5" stroke-opacity="0.28"/>
</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
