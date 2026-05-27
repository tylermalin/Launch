<p align="center">
  <img src="apps/web/public/brand-logo-dark-bg.png" alt="Mālama Labs" width="320" />
</p>

# Mālama Labs

Mālama Labs is a DePIN (Decentralized Physical Infrastructure Network) startup building a cryptographic environmental data network. We utilize hardware-signed data from specialized sensors (ATECC608A + BME680) as the root of trust, completely removing human-in-the-loop oracles. The platform employs a dual-token model ($MALAMA and $LCO2/$VCO2) with transactions bridged seamlessly between Cardano (Aiken/CIP-68) and Base (EVM/LayerZero).

Our architecture provides a secure pipeline from data birth to multi-chain settlement. Sensor data forms a Merkle tree batch, is uploaded to IPFS (via Pinata), validated by an AI validator using Apache Kafka and OPA/Rego policies, and finally anchored on-chain every 4 hours. Every component is designed with strict invariants, and our Next.js frontend is built with the highest standards of modern UX.

## Architecture

```text
+--------------------+
|   Sensor Device    |
| (Py + ATECC608A +  |
|      BME680)       |
+---------+----------+
          | (Hardware Signed Data)
          v
+---------+----------+
|  Kafka / Pipeline  |
| (Merkle Batching)  |
+---------+----------+
          |
    +-----+-----+
    |           |
    v           v
+---+---+   +---+---+
| IPFS  |   |  OPA  |
|(Pinata|   | (Rego)|
+---+---+   +---+---+
    |           |
    +-----+-----+
          |
+---------+----------+
|    AI Validator    |
+---------+----------+
          | 
+---------+----------+
| Blockchain Anchor  |
| (Cardano / Base)  |
+--------------------+
```

## Quick Start

### Frontend (Next.js)

```bash
cd apps/web
npm install
npm run dev
```

### EVM Contracts (Base)

```bash
cd contracts/evm
npm install
npx hardhat test
```

### Validator Pipeline (Docker)

```bash
docker-compose up -d
```

### Cardano Contracts (Aiken)

```bash
cd contracts/cardano
aiken build
aiken check
```

---

## Launch Site — `launch.malamalabs.com`

> Branch: `hex-explorer` · Deployed on Vercel · Stack: Next.js 14 App Router, Mapbox GL JS, H3 geospatial, wagmi v2, MeshSDK, Vercel KV (Redis)

The Launch site is the public-facing presale and node-reservation platform for Genesis Node Licenses. It is a separate Next.js app inside the monorepo (`apps/web`) and is deployed independently of the core data pipeline.

---

### Pages & Features

#### `/` — Home
Marketing hero with animated Mālama Labs branding, mission statement, and links to the presale and docs.

#### `/presale` — Genesis Node License Presale
The primary conversion page. Embeds the `GenesisMint` component which guides a buyer through the full purchase wizard:

1. **Connect wallet** — Cardano (Lace / Eternl via CIP-30) or EVM (MetaMask / injected on Base Sepolia).
2. **Select a hex** — Opens the hex explorer; selected hex is passed back to the mint flow.
3. **Pay & mint** — EVM path: USDC approve → `secureNode()` on the Genesis ERC-721 contract. Cardano path: CIP-8 message signing → server-side treasury mint via Blockfrost.
4. **Success** — NFT image preview, links to Basescan / OpenSea (testnet), and map confirmation.

**Purchase flow resilience:**
- **409 resume**: If MetaMask hangs and the user retries, the second `POST /api/nft/claim` returns `409 { claimId, editionNumber, claimedOnChain }`. Rather than blocking with "Hex Already Claimed", the flow checks `claimedOnChain === 'base'` (same chain) and resumes from the USDC approve step — no data loss, no user confusion.
- **Lace MV3 timeout**: Lace's Manifest V3 service worker restarts periodically. A 12-second `Promise.race` timeout wraps every `enable()` call. On timeout: friendly "Lace is still starting up — click again in a moment" message. The second click almost always succeeds once the background reconnects.
- **Cross-chain conflict detection**: If a hex is already claimed on the other chain, the error is surfaced immediately with a clear message rather than silently failing.

**Wallet picker:** When multiple Cardano wallets are detected via `window.cardano`, an inline picker is rendered below the button (not an absolute dropdown — avoids overflow clipping in the modal).

#### `/explorer` — Hex Map Explorer
Global interactive map of all Genesis Node hex cells (H3 Resolution 4, ~1,770 km² each) built on Mapbox GL JS.

**Three-tier color system:**
| Color | Status | Meaning |
|-------|--------|---------|
| 🟢 Green (`#22c55e`) | `available` | Open for reservation |
| 🔴 Red (`#ef4444`) | `reserved` | Claimed by another buyer |
| 🟡 Yellow (`#eab308`) | `reserved-user` | Claimed by the currently signed-in user |

**Features:**
- Click any hex to open the **Node Details Panel** (`HexPanel`) — environmental zone classification, estimated water coverage, region, edition number, H3 index, and a "Reserve Node" CTA.
- `?hex=<h3Index>` URL parameter: deep-link to a specific hex. On load the map flies to the cell and opens its details panel. Used by the dashboard "View on Map" action.
- User's own hexes are overlaid in yellow by fetching `/api/user` on mount and merging the result into the manifest before rendering Mapbox paint expressions.
- All fill-color, fill-opacity, line-color, and line-width are driven by Mapbox GL expressions keyed on `HexStatus` — no per-feature DOM manipulation.

#### `/auth` — Sign In / Register
Dedicated auth page with three sign-in methods:

| Method | Implementation |
|--------|---------------|
| **Email** | `POST /api/auth/email-session` — creates or retrieves account, sets HTTP-only session cookie |
| **Cardano** | `window.cardano[walletKey].enable()` with 12s timeout, wallet picker for multi-wallet installs |
| **EVM / Base** | wagmi `useConnect()` + `injected()` connector, auto-redirects on `evmConnected` |

If the user is already authenticated (checked via `GET /api/auth/session` on mount), they are immediately redirected to `/dashboard` with `router.replace`.

#### `/dashboard` — Node Command Center
Auth-gated page showing the user's purchased Genesis Node Licenses.

- **Authentication guard**: on load, fetches `/api/auth/session`. If unauthenticated after a 1.5-second grace period (for wallet reconnection), redirects to `/auth`.
- **Hex inventory**: each owned hex is displayed as a card with region, H3 index, edition number, and status badge.
- **Inline Node Details**: clicking "See Details" expands an accordion panel *below* the hex card (no modal overlay — no double scroll, no duplicate close buttons). The expansion loads `HexPanel` via dynamic import and constructs the full `Phase1Hex` object from the H3 index using `cellToLatLng`, `getResolution`, `classifyZone`, `estimateWaterCoverage`, and `detectRegion`.
- **View on Map**: navigates to `/explorer?hex=<h3Index>`, which triggers the map flyTo + auto-open.
- **Sign out**: clears the session cookie and fires the `malama:auth` cross-component event.

---

### Auth State Synchronization

The Navbar, Dashboard, and Auth page must stay in sync without a global state store. The solution is a lightweight browser event:

```typescript
window.dispatchEvent(new Event('malama:auth'))
```

Fired by: the Auth page (after sign-in), the Dashboard (after sign-in and sign-out), and any wallet connection handler.

The Navbar listens for this event and re-fetches `/api/auth/session` on demand, in addition to re-fetching whenever the Next.js `pathname` changes. This gives instant UI feedback across navigation without polling.

---

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/session` | GET | Returns `{ auth: 'email' \| null, email }` — reads HTTP-only session cookie |
| `/api/auth/email-session` | POST | Creates or retrieves user account by email; sets session cookie |
| `/api/auth/logout` | POST | Clears session cookie |
| `/api/nft/claim` | POST | Atomically reserves a hex in Redis for a given chain + buyer address |
| `/api/nft/claim` | PATCH | Binds the on-chain `txHash` + `tokenId` to an existing claim (post-mint) |
| `/api/nft/claim` | GET | Returns existing claim data for a hexId |
| `/api/nft/mint-cardano` | POST | Server-side treasury mint via Blockfrost — pays ADA fees, sends NFT to buyer |
| `/api/user` | GET | Returns the authenticated user's account including owned hex inventory |
| `/api/nft/[tokenId]/image` | GET | Generates dynamic NFT image for a given tokenId + hexId |

**Claim registry (Redis):**
The hex claim registry uses `SADD` for atomic reservation. Each claim stores: `hexId`, `chain`, `buyerAddress`, `claimId` (UUID), `editionNumber`, and optionally `txHash` once the mint completes. The 409 resume logic checks `claimedOnChain` to distinguish "same-chain retry" (safe to resume) from "cross-chain conflict" (block).

---

### Key Dependencies (`apps/web`)

| Package | Role |
|---------|------|
| `next` 14 | App Router, RSC, API routes |
| `mapbox-gl` | Interactive hex map rendering |
| `h3-js` | H3 geospatial indexing (Resolution 4 cells) |
| `wagmi` v2 + `viem` | EVM wallet connection, contract calls, tx receipts |
| `@meshsdk/react` | Cardano wallet connection (MeshSDK CIP-30 wrapper) |
| `@vercel/kv` | Redis-backed claim registry + user accounts |
| `lucide-react` | Icon set throughout the UI |

---

### Environment Variables (`apps/web`)

> All secrets live in `.env.local` (gitignored). Configure on Vercel per-project.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | ✅ | Mapbox GL public token |
| `NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS` | ✅ | Deployed Genesis ERC-721 address on Base |
| `NEXT_PUBLIC_USDC_CONTRACT_ADDRESS` | ✅ | USDC contract address on Base |
| `NEXT_PUBLIC_APP_BASE_URL` | ✅ | Public origin (e.g. `https://launch.malamalabs.com`) |
| `KV_REST_API_URL` | ✅ | Vercel KV endpoint |
| `KV_REST_API_TOKEN` | ✅ | Vercel KV auth token |
| `REDIS_URL` | optional | Redis URL fallback (node-redis adapter) |
| `BLOCKFROST_PROJECT_ID` | ✅ (Cardano) | Blockfrost API key for Cardano treasury minting |
| `TREASURY_CARDANO_ADDRESS` | ✅ (Cardano) | Treasury wallet address for ADA fee payments |
| `SESSION_SECRET` | ✅ | Secret for signing HTTP-only session cookies |
| `STRIPE_SECRET_KEY` | optional | Stripe key for fiat card checkout path |

---

### Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — auto-deploys to `launch.malamalabs.com` |
| `hex-explorer` | Active feature branch — explorer, dashboard, auth, mint flow. **Do not merge to main without explicit sign-off.** |

All current Launch site work lives on `hex-explorer`. The branch is deployed to a Vercel preview URL for QA before any production promotion.

---

## Documentation

- [Audit Invariants](docs/audit/invariants.md)
- [Protocol Specifications](docs/protocol/specs.md)
- [Hardware Setup](docs/hardware/setup.md)

## Deployment (Vercel)

The frontend ([apps/web](apps/web)) deploys to Vercel. There are currently two Vercel projects linked to this repository:

- `malamalaunch` — primary project, auto-deploys from `main`
- `launch-malamalabs-com` — project owning the `launch.malamalabs.com` custom domain

**Required Vercel dashboard configuration for both projects:**

1. **Root Directory:** `apps/web`
2. **Framework Preset:** Next.js (auto-detected)
3. **Build Command:** (leave blank — use framework default `next build`)
4. **Output Directory:** (leave blank — use framework default `.next`)
5. **Install Command:** (leave blank — use framework default `npm install`)

With both projects configured this way, no `vercel.json` is required at the repo root. Next.js auto-detection handles everything.

If either project is misconfigured with Root Directory set to repo root, the build will fail with *"The Next.js output directory '.next' was not found"* because the monorepo root has no Next.js app. Fix via Project Settings → General → Root Directory.

