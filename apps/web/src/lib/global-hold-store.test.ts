import { describe, it, expect } from 'vitest'
import { issueGlobalHold, getGlobalHold, releaseGlobalHold, listHoldsByEmail } from './global-hold-store'
import { getStats } from './genesis-claim-registry'

// Distinct global Res-4 cells per test — memKv persists in-process between tests,
// so each test owns a unique cell to stay isolated.
const BERLIN = '841f1d5ffffffff'

describe('global-hold-store', () => {
  it('places an exclusive hold on a global Res-4 cell and reads it back', async () => {
    const res = await issueGlobalHold({ hexId: BERLIN, email: 'a@example.com', lat: 52.5163, lng: 13.3777 })

    expect(res.ok).toBe(true)

    const hold = await getGlobalHold(BERLIN)
    expect(hold?.hexId).toBe(BERLIN)
    expect(hold?.email).toBe('a@example.com')
    expect(hold?.status).toBe('held')
    expect(hold?.resolution).toBe(4)
  })

  it('rejects a second hold on a cell already held by someone else', async () => {
    const NYC = '842a101ffffffff'
    const first = await issueGlobalHold({ hexId: NYC, email: 'a@example.com', lat: 40.7484, lng: -73.9857 })
    expect(first.ok).toBe(true)

    const second = await issueGlobalHold({ hexId: NYC, email: 'b@example.com', lat: 40.7484, lng: -73.9857 })
    expect(second.ok).toBe(false)
    if (!second.ok) {
      expect(second.error).toMatch(/already held/i)
      expect(second.existing?.email).toBe('a@example.com')
    }
  })

  it('lets a cell be re-held by someone else after the hold expires', async () => {
    const HON = '84464b9ffffffff'
    const t0 = Date.parse('2026-01-01T00:00:00Z')

    const first = await issueGlobalHold({ hexId: HON, email: 'a@example.com', lat: 21.3, lng: -157.8 }, { now: t0 })
    expect(first.ok).toBe(true)

    const past = t0 + 31 * 24 * 60 * 60 * 1000 // 31 days later — past the 30-day TTL
    expect(await getGlobalHold(HON, { now: past })).toBeNull()

    const reheld = await issueGlobalHold({ hexId: HON, email: 'b@example.com', lat: 21.3, lng: -157.8 }, { now: past })
    expect(reheld.ok).toBe(true)
    expect((await getGlobalHold(HON, { now: past }))?.email).toBe('b@example.com')
  })

  it('never consumes a Genesis edition — the 200-cap counter is untouched', async () => {
    const before = await getStats()
    await issueGlobalHold({ hexId: '842a107ffffffff', email: 'iso@example.com', lat: 40.67, lng: -73.98 })
    const after = await getStats()

    expect(after.issued).toBe(before.issued)
    expect(after.issued).toBe(0)
  })

  it('lets the owner release a hold (and refuses non-owners), freeing the cell', async () => {
    const LDN = '84194adffffffff'
    await issueGlobalHold({ hexId: LDN, email: 'owner@example.com', lat: 51.5, lng: -0.12 })

    const denied = await releaseGlobalHold(LDN, 'intruder@example.com')
    expect(denied.ok).toBe(false)
    expect(await getGlobalHold(LDN)).not.toBeNull()

    const released = await releaseGlobalHold(LDN, 'owner@example.com')
    expect(released.ok).toBe(true)
    expect(await getGlobalHold(LDN)).toBeNull()

    const reheld = await issueGlobalHold({ hexId: LDN, email: 'new@example.com', lat: 51.5, lng: -0.12 })
    expect(reheld.ok).toBe(true)
  })

  it('lists a user’s active holds', async () => {
    const TYO = '842f5a3ffffffff'
    const SF = '8428309ffffffff'
    await issueGlobalHold({ hexId: TYO, email: 'multi@example.com', lat: 35.6, lng: 139.6 })
    await issueGlobalHold({ hexId: SF, email: 'multi@example.com', lat: 37.7, lng: -122.4 })

    const holds = await listHoldsByEmail('multi@example.com')
    expect(holds.map((h) => h.hexId).sort()).toEqual([SF, TYO].sort())
    expect(holds.every((h) => h.email === 'multi@example.com')).toBe(true)
  })
})
