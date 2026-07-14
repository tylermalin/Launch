# PRD: Address → Hex Lookup & Reserve (Res 4)

Status: Draft · Owner: Tyler · App: `apps/web` (launch.malamalabs.com)

## Context

Buyers should be able to type their address, see the exact H3 cell that contains it, and
reserve it to purchase. The current presale lets people claim from a **curated set of 200
Res-4 cells** (US-only, `regions.json`) selected on a Mapbox view — there is no way to look up
an arbitrary address and act on the cell that contains it.

We already run real Uber H3 (`h3-js@4.1.0`) and a race-safe reservation/mint stack. The
genuinely new piece is **forward** address lookup (address → lat/lng → containing cell) and a
path for cells **outside** the curated 200.

This is step one toward the larger goal: **a Res-4 owner can later fractionalize their cell
into its inner H3 children and resell them when the protocol makes a global resolution change
(Res 4 → 5 → 6 → 7).** Nothing built here may preclude that.

## Goal

Let a user enter any address worldwide, see the **Res-4** cell (1,770 km²) containing it, and:
- **If the cell is one of the curated 200 and available** → reserve + mint through the existing flow.
- **If the cell is outside the 200 (anywhere on Earth)** → place an off-chain **global hold**
  (exclusive, free, email-anchored, 30-day expiry). No mint yet.

## Non-goals (explicitly out of scope for this iteration)

- No changes to the deployed `GenesisValidator.sol` contract. It is **frozen**.
- No fractionalization / secondary resale of inner hexes (future iteration — but the data model must support it).
- No new funding-round pricing tiers (Res 5/6/7, $2,500–$3,500). Current round is **Res 4 only**.
- No payment/deposit for global holds (they cannot mint, so they are free interest+lock).

## Core model

| Address resolves to a Res-4 cell that is… | Behavior |
|---|---|
| In curated 200, available | **Reserve + mint** — existing `issueClaim` → contract `secureNode`/`adminSecureNode`. Unchanged. |
| Outside curated 200 (global) | **Global hold** — new KV store, separate namespace, no edition consumed, no mint. |
| Already claimed (200) or already held (global) | "Taken" — show owner-less status, offer nearby alternatives. |
| Native/tribal (`NATIVE_HEX_SET`) | Blocked, as today. |

**Invariants**
- The 200 Genesis editions and the on-chain `MAX_GENESIS_SUPPLY = 200` cap are untouched.
- Global holds live in their **own** KV namespace — never increment `genesis:issued`.
- Every mint **and** every hold is stored keyed by its **canonical Res-4 H3 index + owner**,
  so a future global res change enables `cellToChildren(res4Index, n)` → fractionalize/resell.

## User flow

1. User opens the address-lookup surface (new component, e.g. `AddressHexLookup.tsx`).
2. Types an address → **Mapbox forward geocoding** autocomplete (Search Box / Geocoding v6
   forward; reuses `NEXT_PUBLIC_MAPBOX_TOKEN`). Picks a result → `{ lat, lng }`.
3. `latLngToCell(lat, lng, 4)` → canonical Res-4 index. Map flies to it; `cellToBoundary` draws it.
4. Status resolved via a single endpoint (curated-available / curated-taken / global-available /
   global-held / native). Price via existing `calculateGenesisListingPriceDeterministic` (already global).
5. CTA depends on status:
   - curated-available → enter existing presale/checkout with `?hex=<index>`.
   - global-available → "Reserve this cell" → email → creates an exclusive global hold.
   - taken/native → disabled + nearby suggestions (`gridDisk(index, 1)` filtered to available).

## Data model — new `global-hold-store.ts` (KV, mirrors `genesis-claim-registry.ts`)

```
GlobalHold {
  hexId: string          // canonical Res-4 H3 index (the fractionalization anchor)
  resolution: 4
  email: string          // owner identity (reuses email session)
  lat, lng: number       // geocoded centroid of the address (for display)
  status: 'held'
  heldAt: ISO            // created
  expiresAt: ISO         // heldAt + 30d
  referrerId?: string    // KOL attribution, same as claims
}

KV keys (separate namespace — never touches genesis:*):
  hold:res4:<hexId>        -> GlobalHold        (exclusive: setNX / atomic guard)
  hold:email:<email>       -> Set<hexId>        (a user's holds)
  hold:index               -> Set<hexId>        (all active holds, for map overlay)
```

Exclusivity via atomic set-if-absent (mirror the `sadd`/lock pattern in
`genesis-claim-registry.ts` / `custodial-store.ts`). Expiry via stored `expiresAt` +
lazy reclaim on read (same idea as the 20-min orphaned-claim sweep).

## Reuse (do not rebuild)

- `h3-js`: `latLngToCell`, `cellToBoundary`, `cellToLatLng`, `gridDisk`, `cellToChildren` (future).
- Pricing: `calculateGenesisListingPriceDeterministic(lat, lng, hexId)` in `lib/h3.ts` — already global.
- Curated availability: `genesis-claim-registry.ts`, `regions.json`, `NATIVE_HEX_SET`.
- Map: `HexBoundaryPreview.tsx` (already renders a single cell + reverse-geocodes), `explorer` H3 utils.
- Checkout: existing presale/`create-session` for curated cells (relax nothing on-chain).

## Vertical slices (candidate issues)

1. **Forward geocode + resolve cell (read-only):** address autocomplete → `latLngToCell(…,4)` →
   render the containing cell on the map. No reservation. Ships standalone value.
2. **Cell status endpoint:** `GET /api/hexes/resolve?hex=<index>` → curated-available |
   curated-taken | global-available | global-held | native, + price + centroid.
3. **Global hold store + API:** `global-hold-store.ts` + `POST/GET/DELETE /api/holds` (exclusive,
   email-anchored, 30-day expiry). Separate KV namespace; unit-tested for the race + cap-isolation.
4. **Lookup UI wiring:** `AddressHexLookup.tsx` — status-driven CTA (mint route vs hold vs taken),
   nearby suggestions via `gridDisk`.
5. **Global holds on the map (optional):** overlay active holds as a distinct layer on `/map` / `/explorer`.

## Risks / edge cases

- Address geocodes to ocean/unpopulated cell → allow (it's still a valid Res-4 index) but flag water via existing `hex-geo` sampling.
- Curated cell membership is currently checked only in `create-session` — confirm we don't accidentally let a global cell enter the *mint* path (it must route to holds, not `issueClaim`).
- Resolution drift: assert `getResolution(index) === 4` everywhere a Res-4 index is expected.
- Hold → future mint conversion is out of scope, but store enough (`hexId`, `email`, `referrerId`) to convert later without data loss.

## Verification

- Unit: `global-hold-store` — exclusive lock under concurrent holds; expiry reclaim; never touches `genesis:issued`.
- Integration: resolve endpoint returns correct status for (a) a known curated cell, (b) a known
  taken cell, (c) an arbitrary global address (e.g. Berlin), (d) a native cell.
- Manual (run the app): type a US curated address → reserve+mint path; type an overseas address →
  global hold path; re-enter the same overseas address from another email → "taken."
- Regression: existing presale/mint flow for the curated 200 is byte-for-byte unchanged.
