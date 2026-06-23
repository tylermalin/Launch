import { describe, it, expect } from 'vitest'
import { parseForwardSuggestions } from './mapbox-geocode'

// Shape of a Mapbox Search API v6 forward-geocode feature.
const feature = (over: Record<string, unknown> = {}) => ({
  geometry: { type: 'Point', coordinates: [-118.2428, 34.0537] },
  properties: {
    mapbox_id: 'addr.123',
    name: '200 N Spring St',
    full_address: '200 N Spring St, Los Angeles, California 90012, United States',
    place_formatted: 'Los Angeles, California 90012, United States',
    ...over,
  },
})

describe('parseForwardSuggestions', () => {
  it('maps forward-geocode features to selectable suggestions with coordinates', () => {
    const [s] = parseForwardSuggestions({ features: [feature()] })

    expect(s.id).toBe('addr.123')
    expect(s.label).toBe('200 N Spring St')
    expect(s.sublabel).toBe('Los Angeles, California 90012, United States')
    expect(s.lat).toBeCloseTo(34.0537)
    expect(s.lng).toBeCloseTo(-118.2428)
  })

  it('drops features without point coordinates', () => {
    const broken = { geometry: null, properties: { mapbox_id: 'x', name: 'No geo' } }
    const result = parseForwardSuggestions({ features: [broken, feature()] })

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('addr.123')
  })

  it('returns an empty list when there are no features', () => {
    expect(parseForwardSuggestions({})).toEqual([])
    expect(parseForwardSuggestions({ features: [] })).toEqual([])
  })
})
