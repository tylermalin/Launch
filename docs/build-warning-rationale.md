# Build Warning Rationale

Tracked disposition for every warning that appears in Vercel build output.
Last reviewed: 2026-05-23.

---

## ✅ FIXED — `"vercel" found in project dependencies and will be ignored`

**Was:** `vercel ^51.2.1` listed under `dependencies` in root `package.json`.  
**Fix:** Moved to `devDependencies`. Vercel CLI is a build/deploy tool, not a runtime
dependency. Moving it eliminates the Vercel platform warning and correctly signals
that it should not be bundled into the app output.  
**Commit:** this PR.

---

## ✅ FIXED — `@upstash/redis init failed — falling back to in-memory store`

**Was:** The `UPSTASH_REDIS_REST_URL` env var was stored in Vercel with surrounding
quote characters (e.g. `"https://steady-pup-72434.upstash.io"` instead of
`https://steady-pup-72434.upstash.io`). Upstash's URL validator saw the leading `"`
and rejected the URL as "not starting with https".  
**Fix 1:** Added `sanitizeEnvString()` in `apps/web/src/lib/kv.ts` that strips
surrounding quotes and whitespace before passing the URL/token to the Redis client.  
**Fix 2:** Re-set the env var in Vercel Dashboard without surrounding quotes.  
**Commit:** this PR.

> **ACTION REQUIRED:** Go to Vercel → malamalaunch → Settings → Environment Variables.
> Edit `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` and confirm there are
> no leading/trailing quote characters. Re-deploy once corrected.

---

## 🚫 NOT FIXED — `prebuild-install@7.1.3` deprecated

**Owner:** Transitive dependency pulled by a native-addon builder (likely via MetaMask
SDK or a contract toolchain package).  
**Risk:** Low — `prebuild-install` handles native binary fetching at install time only.
No runtime exposure. No known CVEs.  
**Rationale:** Updating requires bumping the upstream package that depends on it. That
upstream (most likely `@metamask/sdk` → `node-hid` or similar) controls when they
migrate to `node-gyp-build`. This is out of our direct control.  
**Resolution path:** Monitor MetaMask SDK release notes; update `@metamask/sdk` when a
version drops the `prebuild-install` chain.

---

## 🚫 NOT FIXED — `lodash.isequal@4.5.0` deprecated

**Owner:** Transitive — not a direct dependency.  
**Risk:** Very low. `lodash.isequal` is functionally complete; "deprecated" means the
Lodash maintainers stopped publishing individual function packages (not a security
issue). Node's `util.isDeepStrictEqual` is the modern replacement.  
**Rationale:** Whoever uses this in our dep tree would need to update. Our code doesn't
call `lodash.isequal` directly.  
**Resolution path:** Will self-resolve when the upstream package (likely a React testing
or UI library) updates. No action required.

---

## 🚫 NOT FIXED — `inflight@1.0.6` deprecated

**Owner:** Transitive from legacy build tooling (often via `glob@7`).  
**Risk:** Low — memory leak in theory, but only relevant during long-lived processes
that do many concurrent file I/O operations. Vercel build containers are ephemeral.  
**Rationale:** Pinned deep in old toolchain chains. Resolves automatically as ecosystem
migrates away from `glob@7`.  
**Resolution path:** Blocked on upstream (same as `glob` entries below).

---

## 🚫 NOT FIXED — `node-domexception@1.0.0` deprecated

**Owner:** Transitive from `node-fetch` or similar fetch polyfill.  
**Risk:** Zero — only affects environments without native `DOMException`. Vercel runs on
Node 18+ where `DOMException` is global.  
**Rationale:** Will self-resolve as upstreams switch to Node 18+ native globals.

---

## 🚫 NOT FIXED — `@paulmillr/qr@0.2.1` → now `qr`

**Owner:** Transitive from a wallet or QR-code library.  
**Risk:** None — purely a package rename, no API change.  
**Rationale:** Upstream needs to update their dependency declaration. Not our code.

---

## 🚫 NOT FIXED — `@metamask/sdk-analytics@0.0.5` deprecated

**Owner:** Transitive from `@metamask/sdk` (our direct dependency).  
**Risk:** Low — analytics package; no functional impact if it stops working.  
**Rationale:** MetaMask published `@metamask/connect-analytics` as the successor.
This will be resolved when we update `@metamask/sdk` to a version that uses the new
analytics package. Track MetaMask SDK changelog.

---

## 🚫 NOT FIXED — `@basementuniverse/commonjs@1.2.10` deprecated

**Owner:** Unknown transitive (small utility package).  
**Risk:** Zero — package is frozen/complete, not broken.  
**Rationale:** Purely cosmetic deprecation notice. Package still works.

---

## 🚫 NOT FIXED — `glob@5.0.15 / 7.1.7 / 7.2.3 / 8.1.0` deprecated

**Owner:** Transitive from build tooling. `glob@5` and `7.x` are pulled by old versions
of `rimraf`, `chokidar`, and similar. `glob@8` is pulled by some Next.js or contract
tooling.  
**Risk:** The deprecation notice mentions "widely publicized security vulnerabilities" —
however, these are **DoS via ReDoS** in `glob`'s regex patterns, which are only
exploitable if user-controlled strings are passed to glob. In a build context, all paths
are controlled by us.  
**Rationale:** Fixing requires coordinated updates across multiple upstream packages
(rimraf, fast-glob, etc.). Next.js itself is migrating away from these. Will self-resolve
on next major Next.js upgrade.  
**Resolution path:** `npm update rimraf chokidar` can help; run after validating no
breaking changes.

---

## 🚫 NOT FIXED — `@walletconnect/sign-client@2.21.1` deprecated

**Owner:** Direct or near-direct via `@web3modal/wagmi` or similar.  
**Risk:** "Reliability and performance improvements" in newer version — no security
advisories.  
**Rationale:** Updating WalletConnect sign-client requires careful testing of the entire
Cardano + Base wallet connection flows. Scheduled for the next wallet integration sprint.  
**Resolution path:** `npm update @walletconnect/sign-client` — test with Lace and
MetaMask before deploying.

---

## 🐛 TRACKED — Hex marked reserved on failed payment (not yet fixed)

**Description:** When a Stripe checkout session is created (before payment), the hex is
immediately locked via `lockHexForMagicCheckout()`. If the user cancels or the
transaction fails (e.g., MetaMask gas rejection), the lock is not released and the hex
appears reserved to other users until the session expires.  
**Expected behaviour:** A hex should only be marked reserved after confirmed payment
(`fulfill-card-purchase.ts` → `issueClaim()`). Pending checkout should use a TTL'd soft
lock that auto-expires.  
**Fix plan:**
1. Add a TTL to `lockHexForMagicCheckout` (e.g., 30 min) using Upstash KV `ex` option.
2. On Stripe `checkout.session.expired` webhook, explicitly release the lock.
3. The `/api/hexes` endpoint should treat a TTL'd lock as "pending" (distinct from
   "reserved") and filter it out for display, OR show a "checkout in progress" state.
**Severity:** Medium — workaround is to contact support; hex lock expires naturally on
Stripe session timeout (~30 min).

---

## 🐛 TRACKED — Explorer list view (restored this PR)

**Description:** The Hex Explorer previously had a list/grid view alongside the map view.
It was lost when the map-only layout was implemented.  
**Fix:** Added `HexListView` component and a Map/List toggle button to
`apps/web/src/app/explorer/page.tsx`. The list view shows all 200 hexes with status,
region, data demand score, and price. Selecting a row opens the HexPanel inline.  
**Commit:** this PR.
