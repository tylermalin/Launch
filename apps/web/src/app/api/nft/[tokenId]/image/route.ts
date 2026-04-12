import { NextResponse } from 'next/server'
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
  const claimIdQ = searchParams.get('claimId')
  const chain      = searchParams.get('chain') ?? 'base'

  let claim = claimIdQ ? getClaimByClaimId(claimIdQ) : undefined
  if (!claim && chain === 'base') {
    claim = getClaimForEvmToken(Number(tokenIdParam))
  }
  if (!claim && chain === 'cardano') {
    claim = getClaimByEdition(Number(tokenIdParam))
  }

  const hexId = claim?.hexId ?? searchParams.get('hexId') ?? `genesis-${tokenIdParam}`
  const parsed = Number(tokenIdParam)
  const editionNum = resolveNftDisplayEdition(hexId, claim, Number.isFinite(parsed) ? parsed : 0)
  const genesisNum = String(editionNum).padStart(3, '0')
  const claimIdLabel = claim?.claimId ?? claimIdQ ?? ''
  const zone = resolveNftZone(hexId)

  // Chain badge color
  const chainColor = chain === 'cardano' ? '#0033AD' : '#0052FF'
  const chainLabel = chain === 'cardano' ? 'CARDANO' : 'BASE L2'
  const chainIcon  = chain === 'cardano'
    ? `<text x="396" y="578" text-anchor="end" font-size="11" font-weight="900" fill="#4DA3FF" font-family="monospace" letter-spacing="1">ADA</text>`
    : `<text x="396" y="578" text-anchor="end" font-size="11" font-weight="900" fill="#4DA3FF" font-family="monospace" letter-spacing="1">USDC</text>`

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bg" x1="0" y1="0" x2="400" y2="600" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#0A1628"/>
      <stop offset="100%" stop-color="#061020"/>
    </linearGradient>
    <!-- Glow for teal elements -->
    <filter id="glow" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <!-- Subtle hex pattern -->
    <pattern id="hexPattern" x="0" y="0" width="40" height="46" patternUnits="userSpaceOnUse">
      <polygon points="20,2 38,12 38,34 20,44 2,34 2,12"
               fill="none" stroke="#10B98115" stroke-width="0.8"/>
    </pattern>
    <!-- Chain badge gradient -->
    <linearGradient id="chainGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${chainColor}30"/>
      <stop offset="100%" stop-color="${chainColor}10"/>
    </linearGradient>
    <!-- Teal accent gradient -->
    <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#14B8A6"/>
    </linearGradient>
    <!-- Card shine -->
    <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff08"/>
      <stop offset="100%" stop-color="#ffffff00"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="400" height="600" fill="url(#bg)" rx="16" ry="16"/>
  <!-- Hex pattern overlay -->
  <rect width="400" height="600" fill="url(#hexPattern)" rx="16" ry="16" opacity="0.6"/>
  <!-- Card shine overlay -->
  <rect width="400" height="300" fill="url(#shine)" rx="16" ry="16"/>
  <!-- Border -->
  <rect x="1" y="1" width="398" height="598" rx="15" ry="15"
        fill="none" stroke="#10B98130" stroke-width="1.5"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="400" height="4" fill="url(#tealGrad)" rx="2"/>

  <!-- Mālama Labs hex logo -->
  <g transform="translate(24, 24)">
    <polygon points="18,0 34,9 34,27 18,36 2,27 2,9"
             fill="none" stroke="#10B981" stroke-width="2" filter="url(#glow)"/>
    <polygon points="18,7 27,12 27,24 18,29 9,24 9,12"
             fill="#10B98120" stroke="#10B98160" stroke-width="1"/>
    <text x="18" y="22" text-anchor="middle" font-size="10" font-weight="900"
          fill="#10B981" font-family="monospace">M</text>
  </g>
  <text x="62" y="38" font-size="11" font-weight="700" fill="#10B981"
        font-family="sans-serif" letter-spacing="1">MĀLAMA LABS</text>

  <!-- Chain badge -->
  <rect x="280" y="20" width="100" height="26" rx="13"
        fill="url(#chainGrad)" stroke="${chainColor}60" stroke-width="1"/>
  <text x="330" y="37" text-anchor="middle" font-size="9" font-weight="900"
        fill="${chainColor === '#0033AD' ? '#4DA3FF' : '#6B9FFF'}"
        font-family="monospace" letter-spacing="1.5">${chainLabel}</text>

  <!-- ── Main Content ───────────────────────────────────────────────── -->

  <!-- Large hex icon -->
  <g transform="translate(200, 220)" filter="url(#glow)">
    <polygon points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45"
             fill="#10B98108" stroke="#10B981" stroke-width="2"/>
    <polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30"
             fill="#10B98115" stroke="#10B98150" stroke-width="1.5"/>
    <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15"
             fill="#10B98130" stroke="#10B98180" stroke-width="1"/>
    <!-- Node dot -->
    <circle cx="0" cy="0" r="8" fill="#10B981" filter="url(#glow)"/>
    <circle cx="0" cy="0" r="4" fill="white"/>
  </g>

  <!-- Edition badge -->
  <rect x="140" y="88" width="120" height="24" rx="12"
        fill="#10B98115" stroke="#10B98140" stroke-width="1"/>
  <text x="200" y="104" text-anchor="middle" font-size="9" font-weight="900"
        fill="#10B981" font-family="monospace" letter-spacing="2">GENESIS 200</text>

  <!-- Title -->
  <text x="200" y="148" text-anchor="middle" font-size="13" font-weight="900"
        fill="#ffffff" font-family="sans-serif" letter-spacing="1">HEX NODE LICENSE</text>

  <!-- Genesis number -->
  <text x="200" y="348" text-anchor="middle" font-size="52" font-weight="900"
        fill="#10B981" font-family="monospace" filter="url(#glow)">#${genesisNum}</text>

  <!-- Hex ID -->
  <text x="200" y="376" text-anchor="middle" font-size="8.5" font-weight="700"
        fill="#6B7280" font-family="monospace" letter-spacing="0.5">${hexId}</text>

  ${claimIdLabel ? `<!-- Claim ID -->
  <text x="200" y="392" text-anchor="middle" font-size="10" font-weight="900"
        fill="#34D399" font-family="monospace" letter-spacing="1.5">${claimIdLabel}</text>` : ''}

  <!-- Zone name -->
  <text x="200" y="${claimIdLabel ? '418' : '402'}" text-anchor="middle" font-size="22" font-weight="900"
        fill="#F1F5F9" font-family="sans-serif">${zone}</text>

  <!-- Divider -->
  <line x1="24" y1="${claimIdLabel ? '446' : '430'}" x2="376" y2="${claimIdLabel ? '446' : '430'}" stroke="#1F2937" stroke-width="1"/>

  <!-- Stats row -->
  <!-- MLMA -->
  <text x="70" y="456" text-anchor="middle" font-size="8" fill="#6B7280"
        font-family="monospace" letter-spacing="1">MLMA</text>
  <text x="70" y="474" text-anchor="middle" font-size="16" font-weight="900"
        fill="#10B981" font-family="monospace">125K</text>

  <!-- Divider 1 -->
  <line x1="123" y1="442" x2="123" y2="480" stroke="#1F2937" stroke-width="1"/>

  <!-- Price -->
  <text x="200" y="456" text-anchor="middle" font-size="8" fill="#6B7280"
        font-family="monospace" letter-spacing="1">ENTRY</text>
  <text x="200" y="474" text-anchor="middle" font-size="16" font-weight="900"
        fill="#F1F5F9" font-family="monospace">$2,000</text>

  <!-- Divider 2 -->
  <line x1="277" y1="442" x2="277" y2="480" stroke="#1F2937" stroke-width="1"/>

  <!-- Revenue start -->
  <text x="338" y="456" text-anchor="middle" font-size="8" fill="#6B7280"
        font-family="monospace" letter-spacing="1">REVENUE</text>
  <text x="338" y="474" text-anchor="middle" font-size="11" font-weight="900"
        fill="#F59E0B" font-family="monospace">OCT 26</text>

  <!-- Bottom strip -->
  <rect x="0" y="506" width="400" height="94" rx="0" fill="#060E1A"/>
  <rect x="0" y="596" width="400" height="4" rx="2" fill="url(#tealGrad)"/>

  <!-- Bottom text -->
  <text x="24" y="534" font-size="8" font-weight="700" fill="#6B7280"
        font-family="monospace" letter-spacing="1">VESTING SCHEDULE</text>
  <text x="24" y="552" font-size="10" font-weight="700" fill="#D1D5DB"
        font-family="monospace">25% at boot · 75% over 12 months</text>

  <text x="24" y="578" font-size="8" font-weight="700" fill="#6B7280"
        font-family="monospace" letter-spacing="1">PAYMENT</text>
  ${chainIcon}
  <text x="70" y="578" font-size="10" font-weight="700" fill="#D1D5DB"
        font-family="monospace">$2,000 USDC on ${chain === 'cardano' ? 'Cardano' : 'Base L2'}</text>
</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    }
  })
}
