import { latLngToCell } from 'h3-js'

/** The H3 resolution sold in the current funding round (~1,770 km² per cell). */
export const RES4 = 4

/** Resolve the canonical Res-4 H3 cell that contains the given coordinate. */
export function resolveContainingCell(lat: number, lng: number): string {
  return latLngToCell(lat, lng, RES4)
}
