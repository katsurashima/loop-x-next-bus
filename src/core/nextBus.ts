// Pure time helpers for a single day's departures. No DOM, no globals.
// Service-day awareness (weekends, holidays, wrap to the next service day)
// lives in schedule.ts — this file only reasons about "today".

const TIME_PATTERN = /^([0-9]{2}):([0-9]{2})$/

/** A departure resolved to seconds since midnight. */
export interface Departure {
  /** Original "HH:MM". */
  time: string
  /** Seconds since local midnight, 0..86399. */
  secondsOfDay: number
}

/**
 * Parse "HH:MM" into seconds since midnight.
 * Throws on malformed input — timetable data is a system boundary.
 */
export function parseTime(hhmm: string): number {
  const match = TIME_PATTERN.exec(hhmm)
  if (!match) {
    throw new Error(`Invalid time "${hhmm}": expected "HH:MM"`)
  }
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid time "${hhmm}": out of range`)
  }
  return hours * 3600 + minutes * 60
}

/** Seconds since local midnight for a Date. */
export function secondsOfDay(now: Date): number {
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
}

/** Normalize raw "HH:MM" strings into sorted, de-duplicated departures. */
export function toDepartures(times: readonly string[]): Departure[] {
  const seen = new Set<number>()
  const result: Departure[] = []
  for (const time of times) {
    const seconds = parseTime(time)
    if (seen.has(seconds)) continue
    seen.add(seconds)
    result.push({ time, secondsOfDay: seconds })
  }
  return result.sort((a, b) => a.secondsOfDay - b.secondsOfDay)
}

/** The first scheduled departure of the day, or null when there are none. */
export function firstDeparture(times: readonly string[]): Departure | null {
  return toDepartures(times)[0] ?? null
}

/** Departures at or after `now`, today only, sorted ascending. */
export function remainingToday(now: Date, times: readonly string[]): Departure[] {
  const nowSeconds = secondsOfDay(now)
  return toDepartures(times).filter((d) => d.secondsOfDay >= nowSeconds)
}
