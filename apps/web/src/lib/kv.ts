/**
 * KV client — Upstash Redis with in-memory fallback for local dev.
 *
 * Uses @upstash/redis when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set.
 * The Vercel Marketplace Upstash integration also sets KV_REST_API_URL / KV_REST_API_TOKEN
 * (same values, different names) — we check both.
 *
 * Setup (one-time, ~2 min):
 *   1. Go to https://vercel.com/formlesscreature/malamalaunch/stores
 *   2. Click "Create Database" → Upstash Redis → create
 *   3. Run: vercel env pull apps/web/.env.local
 *   KOL referral data will then persist across all deployments.
 */

export interface KVClient {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: unknown, opts?: { ex?: number }): Promise<'OK'>
  incr(key: string): Promise<number>
  sadd(key: string, ...members: string[]): Promise<number>
  smembers(key: string): Promise<string[]>
  del(...keys: string[]): Promise<number>
}

// ── In-memory fallback (local dev / no KV configured) ────────────────────────

const _strings = new Map<string, string>()
const _sets = new Map<string, Set<string>>()

const memKv: KVClient = {
  async get<T>(key: string): Promise<T | null> {
    const v = _strings.get(key)
    return v !== undefined ? (JSON.parse(v) as T) : null
  },
  async set(key: string, value: unknown): Promise<'OK'> {
    _strings.set(key, JSON.stringify(value))
    return 'OK'
  },
  async incr(key: string): Promise<number> {
    const cur = parseInt(_strings.get(key) ?? '0', 10)
    const next = cur + 1
    _strings.set(key, String(next))
    return next
  },
  async sadd(key: string, ...members: string[]): Promise<number> {
    if (!_sets.has(key)) _sets.set(key, new Set())
    const s = _sets.get(key)!
    let added = 0
    for (const m of members) {
      if (!s.has(m)) {
        s.add(m)
        added++
      }
    }
    return added
  },
  async smembers(key: string): Promise<string[]> {
    return Array.from(_sets.get(key) ?? [])
  },
  async del(...keys: string[]): Promise<number> {
    let n = 0
    for (const k of keys) {
      if (_strings.delete(k)) n++
      if (_sets.delete(k)) n++
    }
    return n
  },
}

// ── Upstash Redis adapter ─────────────────────────────────────────────────────

function makeUpstashKv(url: string, token: string): KVClient {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis } = require('@upstash/redis') as typeof import('@upstash/redis')
  const redis = new Redis({ url, token })

  return {
    get: <T>(key: string) => redis.get<T>(key),
    set: async (key: string, value: unknown, opts?: { ex?: number }): Promise<'OK'> => {
      if (opts?.ex) {
        await redis.set(key, value, { ex: opts.ex })
      } else {
        await redis.set(key, value)
      }
      return 'OK'
    },
    incr: (key: string) => redis.incr(key),
    sadd: async (key: string, ...members: string[]): Promise<number> => {
      if (!members.length) return 0
      const result = await redis.sadd(key, members[0], ...members.slice(1))
      return result as number
    },
    smembers: (key: string) => redis.smembers(key),
    del: async (...keys: string[]): Promise<number> => {
      if (!keys.length) return 0
      const result = await redis.del(keys[0], ...keys.slice(1))
      return result as number
    },
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────

function makeKv(): KVClient {
  // Accept both Vercel Marketplace naming and direct Upstash naming
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN

  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[kv] No Upstash Redis credentials found — KOL referral data will NOT persist across ' +
          'serverless invocations. Add Upstash Redis at: ' +
          'https://vercel.com/formlesscreature/malamalaunch/stores'
      )
    }
    return memKv
  }

  try {
    return makeUpstashKv(url, token)
  } catch (e) {
    console.warn('[kv] @upstash/redis init failed — falling back to in-memory store:', e)
    return memKv
  }
}

export const kv: KVClient = makeKv()
