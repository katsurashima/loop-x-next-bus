import type { PlaceIcon } from '../data/timetable.ts'

// Inline pictograms using `currentColor` so they follow the theme / direction
// color. Station + building glyphs are from Material Design Icons
// (Pictogrammers, Apache-2.0); the bus + arrow are self-authored generic glyphs.
// None are the operator's logo.

// mdi:train
const STATION = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c-4 0-8 .5-8 4v9.5A3.5 3.5 0 0 0 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19a3.5 3.5 0 0 0 3.5-3.5V6c0-3.5-3.58-4-8-4M7.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 14A1.5 1.5 0 0 1 9 15.5A1.5 1.5 0 0 1 7.5 17m3.5-7H6V6h5zm2 0V6h5v4zm3.5 7a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5"/></svg>`

// mdi:office-building
const BUILDING = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3v18h6v-3.5h2V21h6V3zm2 2h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm8 0h2v2h-2z"/></svg>`

// mdi:bus (front view) — used as the header mark.
const BUS = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 11H6V6h12m-1.5 11a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-9 0A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 14A1.5 1.5 0 0 1 9 15.5A1.5 1.5 0 0 1 7.5 17M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4z"/></svg>`

const PLACE_ICON: Record<PlaceIcon, string> = {
  station: STATION,
  building: BUILDING,
}

/** SVG markup for an endpoint pictogram. */
export function placeIcon(icon: PlaceIcon): string {
  return PLACE_ICON[icon]
}

/** SVG markup for the bus glyph that travels along the route. */
export function busIcon(): string {
  return BUS
}

// Bold right-pointing arrow shown in the middle of the journey strip.
const ARROW = `<svg viewBox="0 0 36 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h27M22 5l8 7-8 7"/></svg>`

/** SVG markup for the direction arrow (origin → destination). */
export function arrowIcon(): string {
  return ARROW
}
