import { describe, it, expect } from 'vitest'
import { classifyCellStatus, resolveCellStatus, cellStatusCta } from './cell-status'

describe('classifyCellStatus', () => {
  it('marks an unclaimed curated cell as curated-available', () => {
    expect(classifyCellStatus({ isNative: false, isCurated: true, isClaimed: false, isHeld: false }))
      .toBe('curated-available')
  })

  it('marks a claimed curated cell as curated-taken', () => {
    expect(classifyCellStatus({ isNative: false, isCurated: true, isClaimed: true, isHeld: false }))
      .toBe('curated-taken')
  })

  it('marks an unheld non-curated cell as global-available', () => {
    expect(classifyCellStatus({ isNative: false, isCurated: false, isClaimed: false, isHeld: false }))
      .toBe('global-available')
  })

  it('marks a held non-curated cell as global-held', () => {
    expect(classifyCellStatus({ isNative: false, isCurated: false, isClaimed: false, isHeld: true }))
      .toBe('global-held')
  })

  it('treats native cells as native regardless of any other flag', () => {
    expect(classifyCellStatus({ isNative: true, isCurated: true, isClaimed: true, isHeld: true }))
      .toBe('native')
  })

  it('rejects an invalid H3 cell instead of returning garbage', async () => {
    await expect(resolveCellStatus('not-a-hex')).rejects.toThrow()
  })
})

describe('cellStatusCta', () => {
  it('offers minting for an available curated cell', () => {
    const cta = cellStatusCta('curated-available')
    expect(cta.action).toBe('mint')
    expect(cta.enabled).toBe(true)
  })

  it('offers a hold for an available global cell', () => {
    const cta = cellStatusCta('global-available')
    expect(cta.action).toBe('hold')
    expect(cta.enabled).toBe(true)
  })

  it('disables taken and held cells', () => {
    expect(cellStatusCta('curated-taken').enabled).toBe(false)
    expect(cellStatusCta('curated-taken').action).toBe('none')
    expect(cellStatusCta('global-held').enabled).toBe(false)
  })

  it('disables native cells with a tribal-reservation label', () => {
    const cta = cellStatusCta('native')
    expect(cta.enabled).toBe(false)
    expect(cta.label).toMatch(/tribe|native|reserved/i)
  })
})
