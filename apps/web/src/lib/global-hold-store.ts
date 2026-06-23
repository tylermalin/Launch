/**
 * KV-backed store for GLOBAL hex holds — off-chain, exclusive reservations of
 * Res-4 cells OUTSIDE the curated Genesis 200. These never mint and never consume
 * a Genesis edition; they live in their own `hold:*` namespace so the live mint
 * path (`genesis:*`) is completely untouched.
 *
 * Atomicity mirrors genesis-claim-registry: sadd(K.held, hexId) is a single Redis
 * command (1 on first insert, 0 if already held), making holds race-safe.
 *
 * Every hold is keyed by its canonical Res-4 H3 index + owner email, so a future
 * global resolution change can fractionalize the cell via cellToChildren().
 */

import { kv } from '@/lib/kv'
import { RES4 } from '@/lib/hex-lookup'

export const HOLD_TTL_DAYS = 30
const HOLD_TTL_MS = HOLD_TTL_DAYS * 24 * 60 * 60 * 1000

export type GlobalHold = {
  hexId: string
  resolution: typeof RES4
  email: string
  lat: number
  lng: number
  status: 'held'
  heldAt: string
  expiresAt: string
  referrerId?: string
}

// ── KV key schema (separate `hold:*` namespace — never touches `genesis:*`) ──────
// hold:held           → Set<hexId>   (atomic exclusivity via sadd)
// hold:detail:<hexId> → GlobalHold
// hold:email:<email>  → Set<hexId>
// hold:index          → Set<hexId>   (all holds, for the map overlay)
const K = {
  held:   'hold:held',
  index:  'hold:index',
  detail: (hexId: string) => `hold:detail:${hexId}`,
  email:  (email: string) => `hold:email:${email}`,
}

export type IssueHoldInput = {
  hexId: string
  email: string
  lat: number
  lng: number
  referrerId?: string
}

/** `now` is injectable so expiry is deterministically testable; defaults to wall clock. */
type ClockOpts = { now?: number }

/** Read a hold only if it hasn't expired as of `now`. Pure read, no mutation. */
async function readLiveHold(hexId: string, now: number): Promise<GlobalHold | null> {
  const hold = await kv.get<GlobalHold>(K.detail(hexId))
  if (!hold) return null
  return Date.parse(hold.expiresAt) <= now ? null : hold
}

export async function issueGlobalHold(
  input: IssueHoldInput,
  opts?: ClockOpts,
): Promise<{ ok: true; hold: GlobalHold } | { ok: false; error: string; existing?: GlobalHold }> {
  const now = opts?.now ?? Date.now()

  // sadd is atomic: 0 means the cell was already in the held-set.
  const added = await kv.sadd(K.held, input.hexId)
  if (added === 0) {
    const live = await readLiveHold(input.hexId, now)
    if (live) return { ok: false, error: 'Cell already held', existing: live }
    // Expired or orphaned — reclaim in place (the set member is already present).
  }

  const hold: GlobalHold = {
    hexId: input.hexId,
    resolution: RES4,
    email: input.email,
    lat: input.lat,
    lng: input.lng,
    status: 'held',
    heldAt: new Date(now).toISOString(),
    expiresAt: new Date(now + HOLD_TTL_MS).toISOString(),
    referrerId: input.referrerId,
  }

  await Promise.all([
    kv.set(K.detail(input.hexId), hold),
    kv.sadd(K.email(input.email), input.hexId),
    kv.sadd(K.index, input.hexId),
  ])

  return { ok: true, hold }
}

/** All of a user's currently-active holds (expired ones are filtered and cleaned). */
export async function listHoldsByEmail(email: string, opts?: ClockOpts): Promise<GlobalHold[]> {
  const ids = await kv.smembers(K.email(email))
  const holds = await Promise.all(ids.map((id) => getGlobalHold(id, opts)))
  return holds.filter((h): h is GlobalHold => h !== null)
}

/** Release a hold. Only the owning email may release it. */
export async function releaseGlobalHold(
  hexId: string,
  email: string,
): Promise<{ ok: boolean; reason?: string }> {
  const existing = await kv.get<GlobalHold>(K.detail(hexId))
  if (existing && existing.email !== email) {
    return { ok: false, reason: 'Only the holder can release this cell' }
  }
  await Promise.all([
    kv.srem(K.held, hexId),
    kv.del(K.detail(hexId)),
    kv.srem(K.index, hexId),
    ...(existing ? [kv.srem(K.email(existing.email), hexId)] : []),
  ])
  return { ok: true }
}

export async function getGlobalHold(hexId: string, opts?: ClockOpts): Promise<GlobalHold | null> {
  const now = opts?.now ?? Date.now()
  const live = await readLiveHold(hexId, now)
  if (live) return live

  // Expired record lingering in KV — lazily clean up every index so the cell frees.
  const stale = await kv.get<GlobalHold>(K.detail(hexId))
  if (stale) {
    await Promise.all([
      kv.srem(K.held, hexId),
      kv.del(K.detail(hexId)),
      kv.srem(K.email(stale.email), hexId),
      kv.srem(K.index, hexId),
    ])
  }
  return null
}
