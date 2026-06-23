import { describe, it, expect } from 'vitest'
import { getResolution } from 'h3-js'
import { resolveContainingCell } from './hex-lookup'

describe('resolveContainingCell', () => {
  it('returns the Res-4 cell that contains a coordinate', () => {
    // Los Angeles City Hall — its containing Res-4 cell is the Genesis West-Coast lab node.
    const cell = resolveContainingCell(34.0537, -118.2428)

    expect(cell).toBe('8429a1dffffffff')
    expect(getResolution(cell)).toBe(4)
  })

  it('resolves coordinates anywhere on Earth, not just the curated US set', () => {
    // Brandenburg Gate, Berlin — outside the curated 200, must still resolve.
    const cell = resolveContainingCell(52.5163, 13.3777)

    expect(cell).toBe('841f1d5ffffffff')
    expect(getResolution(cell)).toBe(4)
  })

  it('maps two addresses in the same vicinity to the same cell, and a distant one to a different cell', () => {
    const cityHall = resolveContainingCell(34.0537, -118.2428)
    const nearby = resolveContainingCell(34.056, -118.245) // ~500m away
    const distant = resolveContainingCell(52.5163, 13.3777) // Berlin

    expect(nearby).toBe(cityHall)
    expect(distant).not.toBe(cityHall)
  })
})
