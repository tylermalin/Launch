import { describe, it, expect } from 'vitest'
import { classifyCellStatus, resolveCellStatus } from './cell-status'

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
