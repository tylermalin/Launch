# Mālama Labs Genesis 200 Hex Node Sale: Technical Specification

**Version 1.0 | April 16, 2026**

## 1. Overview

The Genesis 200 Hex Node Sale is the initial release of Mālama's decentralized
validator infrastructure. 200 Hex Nodes will be made available to early
operators, seeding the network with geographic coverage and enabling the first
wave of real-world impact data to flow through the Mālama dMRV pipeline.

Each Hex Node is an exclusive license to validate environmental data within a
specific H3 geospatial cell. Operators earn token rewards for accurate data
validation and uptime, with the ability to increase yield through staking and
governance participation.

## 2. Hex Allocation & Nomenclature

Mālama divides the earth's surface into hexagonal cells using the H3 spatial
index (Uber, 2018). At H3 resolution 5, each cell is approximately 8.544 km²
in area.

The Genesis 200 sale allocates 200 of these cells across 5 key regions:

- **Idaho:** 50 hexes (enhanced rock weathering focus)
- **Los Angeles:** 20 hexes (urban carbon monitoring)
- **New York City:** 20 hexes (corporate carbon data pipeline)
- **London:** 20 hexes (voluntary carbon market integration)
- **Tokyo:** 20 hexes (Asia-Pacific climate data markets)
- **Other strategic locations:** 70 hexes

Selection drivers: existing project pipelines, buyer demand, jurisdictional
fit, methodology fit.

## 3. Hardware Specifications

Each Genesis Hex Node operator receives **1 × Mālama Genesis 200 Hardware Kit**:

- Raspberry Pi Zero 2 W (1 GHz quad-core, 512 MB RAM)
- Waveshare SIM7600G 4G LTE & GNSS Hat (region-unlocked)
- ATECC608B secure element for ECDSA signing
- RS485 probe array (soil moisture, temperature, pH, EC, NPK)
- MH-Z19 CO₂ sensor (NDIR 0–5000 ppm)
- SHT31 temperature & humidity sensor
- 5V 20W solar panel + 3000 mAh LiPo battery
- IP67 polycarbonate weatherproof enclosure
- Custom Genesis 200 firmware image on 32 GB SD card

Retail equivalent: ~$750–$1000 USD. Operators may self-host or opt for
Mālama's managed hosting (TBD, est. $10–20/mo).

**Self-hosting requirements:**
- 24/7 uptime, 99%+ availability
- 1 Mbps up/down minimum internet
- Outdoor mount within the designated hex
- Monthly inspections + basic maintenance
- Hardware returned to Mālama on network exit

## 4. Operator Rewards & Incentives

Operators earn MLMA for (1) data validation and (2) data transport. Reward
vectors:

- **Base validation reward:** per SaveCard minted. Each hex has a base mint
  rate keyed to land cover, carbon-project density, and historical signal.
- **Proof-of-Location multiplier:**
    - Tier 1 Urban — 0.5×
    - Tier 2 Suburban — 1.0×
    - Tier 3 Rural — 1.5×
    - Tier 4 Frontier — 2.0×
    - Tier 5 Strategic — 3.0×
- **Uptime multiplier:** 1.5× for 99%+ monthly uptime.
- **Staking boost:** up to 2× (tiers TBD).
- **Governance rewards:** active proposal/vote participation (flat rate TBD).

Early modeling: $400–$1000/mo per active Genesis operator, with MLMA price /
utilization upside.

## 5. Tokenomics & Governance

MLMA powers the Mālama economy — staking, governance, fees, revenue share,
geowealth.

**Genesis allocation:** 100,000 MLMA per node.
- 25% released at node activation
- 75% linear monthly over 6 months
- 1-year lockup on operator MLMA (post-lockup, transferable)

Governance handles:
- New methodology & sensor integrations
- Validation fee rates
- Treasury allocation
- Slashing & dispute resolution

## 6. Hardware Pricing & Delivery

**One-time fee:** $2000 per node, covering Genesis 200 kit, lifetime Hex
license (non-transferable), 1 year of 4G LTE data (5GB/mo cap), onboarding &
tech support.

**Delivery:** Aug–Sept 2026; all Genesis nodes live on Cardano mainnet by
EOY 2026.

## 7. Sale Mechanics & Timeline

Dutch auction, 2 weeks in May 2026:

- **Sale window:** 2026-05-01 00:00 UTC → 2026-05-14 23:59 UTC
- **Starting price:** $5000 / node
- **Floor price:** $2000 / node
- **Decrement:** $100 per 8 hours
- **Payment:** USDC on Base or Cardano

Fully on-chain via a custom smart contract. Price decrements algorithmically
every 8 hours until all 200 sell or the floor is reached. Ties break by
earliest bid. Max one hex per operator; bids allowed on multiple hexes.

## 8. Fulfillment & Onboarding

Winners receive a POAP NFT representing their Hex. Over the next 2 months they
complete KYC/AML, dashboard setup, hosting qualification, delivery scheduling,
test deployment, and vesting-contract initiation. Mālama provides docs,
tutorials, and 1:1 support. Target: entire Genesis 200 cohort live before the
EOY 2026 community summit.

## 9. Technical Support & Warranty

- 1-year hardware warranty (excludes obvious physical damage).
- Support channels: AI chatbot (24/7), email (12h SLA), engineering office
  hours (2×/week), private Discord.
- Automatic firmware updates.
- ≥3 replicas of node data — individual node downtime does not put dMRV
  assurance at risk.

## 10. Operator Offboarding

Available after the 1-year MLMA lockup expires. Process:

1. Operator notifies Mālama + preferred timeline.
2. Mālama disables validation keys at next epoch boundary.
3. Operator ships hardware back to Mālama.
4. On inspection, Mālama releases any unvested MLMA.
5. Mālama offers the hex to waitlist / governance-defined rollover.
6. New operator gets the existing hardware with reset data and fresh keys.

Exiting operators forfeit unvested MLMA if they don't initiate hardware return
within 14 days. Specifics subject to governance.

## 11. Roadmap

- 2026–2027: flagship projects (soil carbon, reforestation, blue carbon).
- 2027: expand to 1000+ global Hex Nodes.
- 2028: permissionless Hex staking & fluid markets.
- 2029: governance exit to MaDAO.

Long-term vision: an open data market where any environmental sensor can sell
to any buyer, with Mālama as security + settlement layer.

## 12. Principles

- Scientific integrity above ideology
- Local agency above centralized control
- Open standards above walled gardens
- Skin in the game above idle speculation
- Regenerative economics above extractive presumptions

**Contact:** operators@malamalabs.com

---

### Key Documents & Resources

- Mālama Technical Lightpaper v2.1 — _TBD_
- Sensor & Registry Partner Overview — _TBD_
- Interactive Hex Map Explorer — _TBD_
- MLMA Token Economics Whitepaper — _TBD_
- Operator Terms & Conditions — _TBD_
- FAQ & Knowledge Base — _TBD_
