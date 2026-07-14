import { describe, it, expect } from 'vitest'
import { GET } from './route'
import { issueGlobalHold } from '@/lib/global-hold-store'

// In-process test — a single Vitest process shares one memKv, so this exercises the
// real route handler end-to-end (live dev can't, because memKv doesn't persist across
// Next's per-request module boundaries without Redis configured).
describe('GET /api/hexes/holds', () => {
  it('serves active holds as a GeoJSON FeatureCollection', async () => {
    const SYD = '84be0e3ffffffff'
    await issueGlobalHold({ hexId: SYD, email: 'overlay@example.com', lat: -33.87, lng: 151.21 })

    const res = await GET()
    const body = (await res.json()) as {
      type: string
      features: Array<{ geometry: { type: string }; properties: { id: string; status: string } }>
    }

    expect(body.type).toBe('FeatureCollection')
    const feature = body.features.find((f) => f.properties.id === SYD)
    expect(feature).toBeDefined()
    expect(feature?.geometry.type).toBe('Polygon')
    expect(feature?.properties.status).toBe('held')
  })
})
