// The shuttle runs on Japan time. To stay correct regardless of the device's
// timezone setting, we evaluate "now" as Tokyo wall-clock time. Japan has no
// DST, but using Intl keeps this robust without hardcoding the +9 offset.

const TOKYO_PARTS = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

const part = (
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): number => Number(parts.find((p) => p.type === type)?.value)

/**
 * Re-express an instant as a Date whose *local* fields (getHours, getDate,
 * getDay…) hold the Tokyo wall-clock values. The downstream schedule logic
 * reads those local fields, so this pins all calculations to JST.
 */
export function inTokyo(instant: Date): Date {
  const parts = TOKYO_PARTS.formatToParts(instant)
  // hour12:false can render midnight as "24"; normalize to 0.
  const hour = part(parts, 'hour') % 24
  return new Date(
    part(parts, 'year'),
    part(parts, 'month') - 1,
    part(parts, 'day'),
    hour,
    part(parts, 'minute'),
    part(parts, 'second'),
  )
}

/** The current moment expressed as Tokyo wall-clock time. */
export function nowInTokyo(): Date {
  return inTokyo(new Date())
}
