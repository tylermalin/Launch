/**
 * Parsing for the Mapbox Search API v6 forward-geocode response.
 * Network I/O lives in the component; this module only shapes the response
 * into selectable address suggestions, so it can be unit-tested in isolation.
 */

export type AddressSuggestion = {
  /** Mapbox feature id (stable key for the list). */
  id: string
  /** Primary line, e.g. the street address or place name. */
  label: string
  /** Secondary line, e.g. "Los Angeles, California 90012, United States". */
  sublabel: string
  lat: number
  lng: number
}

type V6ForwardFeature = {
  geometry?: { type?: string; coordinates?: number[] } | null
  properties?: {
    mapbox_id?: string
    name?: string
    full_address?: string
    place_formatted?: string
  }
}

export function parseForwardSuggestions(data: { features?: V6ForwardFeature[] }): AddressSuggestion[] {
  const features = data?.features ?? []
  const out: AddressSuggestion[] = []

  for (const f of features) {
    const coords = f.geometry?.coordinates
    if (!coords || coords.length < 2) continue

    const props = f.properties ?? {}
    out.push({
      id: props.mapbox_id || props.full_address || props.name || `${coords[1]},${coords[0]}`,
      label: props.name || props.full_address || 'Unknown location',
      sublabel: props.place_formatted || props.full_address || '',
      lng: coords[0],
      lat: coords[1],
    })
  }

  return out
}
