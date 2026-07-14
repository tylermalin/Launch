import { latLngToCell, gridDisk } from 'h3-js'

/** The H3 resolution sold in the current funding round (~1,770 km² per cell). */
export const RES4 = 4

/** Resolve the canonical Res-4 H3 cell that contains the given coordinate. */
export function resolveContainingCell(lat: number, lng: number): string {
  return latLngToCell(lat, lng, RES4)
}

/** The ring of cells immediately surrounding a cell (excludes the cell itself). */
export function neighborCells(hexId: string): string[] {
  return gridDisk(hexId, 1).filter((id) => id !== hexId)
}
