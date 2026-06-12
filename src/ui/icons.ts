import type { PlaceIcon } from '../data/timetable.ts'

// Inline, self-authored pictograms. They use `currentColor` so they follow the
// theme (light/dark). These are generic glyphs — never the operator's logo.

const STATION = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c-4 0-7 .5-7 4v9a3 3 0 0 0 3 3l-2 3h2.3l2-3h3.4l2 3H20l-2-3a3 3 0 0 0 3-3V6c0-3.5-3-4-7-4Zm-5 5h10v4H7V7Zm2.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/></svg>`

const BUILDING = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3h7a1 1 0 0 1 1 1v11H3Zm3-3h2v-2H6v2Zm0-4h2v-2H6v2Zm0-4h2V8H6v2Zm4 8h2v-2h-2v2Zm0-4h2v-2h-2v2Zm0-4h2V8h-2v2Zm6 8h2v-2h-2v2Zm0-4h2v-2h-2v2Z"/></svg>`

// Side view, facing right (the travel direction along the rail).
const BUS = `<svg viewBox="0 0 32 20" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M4 3.5A2.5 2.5 0 0 1 6.5 1h15.4c1.6 0 3 .9 3.7 2.3l2.5 5c.3.4.4.8.4 1.2v3.5a2.5 2.5 0 0 1-2.5 2.5h-.6a3.3 3.3 0 0 0-6.4 0h-6.6a3.3 3.3 0 0 0-6.4 0H6.5A2.5 2.5 0 0 1 4 13V3.5ZM7 4.5v3.4h4.2V4.5H7Zm6 0v3.4h4.2V4.5H13Zm6.2 0v3.4h4.6l-1.7-3.4h-2.9Z"/><circle cx="10" cy="16" r="2.2"/><circle cx="22.5" cy="16" r="2.2"/></svg>`

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
