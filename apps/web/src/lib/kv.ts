/**
 * KV client — Redis with in-memory fallback for local dev.
 *
 * Priority order:
 *   1. REDIS_URL  — standard redis:// or rediss:// connection string (node-redis).
 *      Works with Upstash, Railway, Redis Cloud, Render, or any Redis host.
 *   2. UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN  — Upstash HTTP REST API.
 *      Also accepts KV_REST_API_URL / KV_REST_API_TOKEN (Vercel Marketplace naming).
 *   3. In-memory fallback — local dev only; data lost on process restart.
 *
 * Quick setup (Upstash free tier via Vercel):
 *   1. vercel.com → project → Storage → Connect Store → Upstash Redis → Create & Connect
 *   2. vercel env pull apps/web/.env.development.local
 *   REDIS_URL will appear automatically after the integration is created.
 */

export interface KVClient {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: unknown, opts?: { ex?: number }): Promise<'OK'>
  incr(key: string): Promise<number>
  sadd(key: string, ...members: string[]): Promise<number>
  smembers(key: string): Promise<string[]>
  del(...keys: string[]): Promise<number>
}

// ── In-memory fallback (local dev / no Redis configured) ─────────────────────

const _strings = new Map<string, { value: string; expiresAt?: number }>()
const _sets = new Map<string, Set<string>>()

const memKv: KVClient = {
  async get<T>(key: string): Promise<T | null> {
    const entry = _strings.get(key)
    if (!entry) return null
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      _strings.delete(key)
      return null
    }
    return JSON.parse(entry.value) as T
  },
  async set(key: string, value: unknown, opts?: { ex?: number }): Promise<'OK'> {
    const expiresAt = opts?.ex ? Date.now() + opts.ex * 1000 : undefined
    _strings.set(key, { value: JSON.stringify(value), expiresAt })
    return 'OK'
  },
  async incr(key: string): Promise<number> {
    const entry = _strings.get(key)
    let cur = 0
    if (entry) {
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        _strings.delete(key)
      } else {
        try { cur = parseInt(JSON.parse(entry.value), 10) } catch { cur = 0 }
      }
    }
    const next = cur + 1
    _strings.set(key, { value: JSON.stringify(next) })
    return next
  },
  async sadd(key: string, ...members: string[]): Promise<number> {
    if (!_sets.has(key)) _sets.set(key, new Set())
    const s = _sets.get(key)!
    let added = 0
    for (const m of members) { if (!s.has(m)) { s.add(m); added++ } }
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

// ── node-redis adapter (REDIS_URL) ────────────────────────────────────────────

async function makeNodeRedisKv(url: string): Promise<KVClient> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('redis') as typeof import('redis')
  const client = createClient({ url })
  client.on('error', (err: unknown) => console.error('[kv:redis]', err))
  await client.connect()

  return {
    async get<T>(key: string): Promise<T | null> {
      const raw = await client.get(key)
      if (raw === null || raw === undefined) return null
      try { return JSON.parse(raw) as T } catch { return raw as unknown as T }
    },
    async set(key: string, value: unknown, opts?: { ex?: number }): Promise<'OK'> {
      const serialized = JSON.stringify(value)
      if (opts?.ex) {
        await client.set(key, serialized, { EX: opts.ex })
      } else {
        await client.set(key, serialized)
      }
      return 'OK'
    },
    async incr(key: string): Promise<number> {
      return client.incr(key)
    },
    async sadd(key: string, ...members: string[]): Promise<number> {
      if (!members.length) return 0
      return client.sAdd(key, members)
    },
    async smembers(key: string): Promise<string[]> {
      return client.sMembers(key)
    },
    async del(...keys: string[]): Promise<number> {
      if (!keys.length) return 0
      return client.del(keys)
    },
  }
}

// ── Upstash HTTP REST adapter ─────────────────────────────────────────────────

function makeUpstashKv(url: string, token: string): KVClient {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis } = require('@upstash/redis') as typeof import('@upstash/redis')
  const redis = new Redis({ url, token })

  return {
    get: <T>(key: string) => redis.get<T>(key),
    set: async (key: string, value: unknown, opts?: { ex?: number }): Promise<'OK'> => {
      if (opts?.ex) { await redis.set(key, value, { ex: opts.ex }) }
      else           { await redis.set(key, value) }
      return 'OK'
    },
    incr: (key: string) => redis.incr(key),
    sadd: async (key: string, ...members: string[]): Promise<number> => {
      if (!members.length) return 0
      return (await redis.sadd(key, members[0], ...members.slice(1))) as number
    },
    smembers: (key: string) => redis.smembers(key),
    del: async (...keys: string[]): Promise<number> => {
      if (!keys.length) return 0
      return (await redis.del(keys[0], ...keys.slice(1))) as number
    },
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────

function sanitize(v: string | undefined): string | undefined {
  if (!v) return v
  return v.trim().replace(/^["']|["']$/g, '').trim()
}

// Singleton promise — node-redis requires async connect(); we resolve once.
let _kvPromise: Promise<KVClient> | null = null

function makeKv(): Promise<KVClient> {
  if (_kvPromise) return _kvPromise

  _kvPromise = (async (): Promise<KVClient> => {
    // 1. Standard REDIS_URL (node-redis) — broadest provider compatibility
    const redisUrl = sanitize(process.env.REDIS_URL)
    if (redisUrl) {
      try {
        const client = await makeNodeRedisKv(redisUrl)
        console.log('[kv] connected via REDIS_URL (node-redis)')
        return client
      } catch (e) {
        console.warn('[kv] REDIS_URL connect failed — trying Upstash REST:', e)
      }
    }

    // 2. Upstash HTTP REST API
    const url = sanitize(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL)
    const token = sanitize(process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
    if (url && token) {
      try {
        const client = makeUpstashKv(url, token)
        console.log('[kv] connected via Upstash REST')
        return client
      } catch (e) {
        console.warn('[kv] @upstash/redis init failed — falling back to in-memory:', e)
      }
    }

    // 3. In-memory fallback
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[kv] No Redis credentials found — purchase state will NOT persist across deploys.\n' +
        '     Set REDIS_URL or connect Upstash via Vercel Storage dashboard.',
      )
    }
    return memKv
  })()

  return _kvPromise
}

// Lazy proxy — callers import `kv` and use it; the connection is established
// on first use so module load never blocks Next.js build or cold-start render.
export const kv: KVClient = new Proxy({} as KVClient, {
  get(_target, prop: string) {
    return async (...args: unknown[]) => {
      const client = await makeKv()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (client as any)[prop](...args)
    }
  },
})
