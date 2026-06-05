import { describe, expect, test } from 'vitest'
import {
  firstDeparture,
  parseTime,
  remainingToday,
  secondsOfDay,
  toDepartures,
} from './nextBus.ts'

// Build a local-time Date for the current day at HH:MM:SS.
const at = (h: number, m: number, s = 0) => new Date(2026, 5, 5, h, m, s)

const SAMPLE = ['07:00', '08:00', '09:30', '22:20']

describe('parseTime', () => {
  test('converts HH:MM to seconds since midnight', () => {
    expect(parseTime('00:00')).toBe(0)
    expect(parseTime('01:30')).toBe(5400)
    expect(parseTime('23:59')).toBe(86340)
  })

  test('throws on malformed input', () => {
    expect(() => parseTime('7:00')).toThrow()
    expect(() => parseTime('0700')).toThrow()
    expect(() => parseTime('')).toThrow()
  })

  test('throws on out-of-range values', () => {
    expect(() => parseTime('24:00')).toThrow()
    expect(() => parseTime('12:60')).toThrow()
  })
})

describe('secondsOfDay', () => {
  test('counts seconds since local midnight', () => {
    expect(secondsOfDay(at(0, 0, 0))).toBe(0)
    expect(secondsOfDay(at(1, 1, 1))).toBe(3661)
  })
})

describe('toDepartures', () => {
  test('sorts and de-duplicates', () => {
    const result = toDepartures(['09:30', '07:00', '07:00', '08:00'])
    expect(result.map((d) => d.time)).toEqual(['07:00', '08:00', '09:30'])
  })
})

describe('firstDeparture', () => {
  test('returns the earliest run', () => {
    expect(firstDeparture(SAMPLE)?.time).toBe('07:00')
  })

  test('returns null for an empty timetable', () => {
    expect(firstDeparture([])).toBeNull()
  })
})

describe('remainingToday', () => {
  test('returns departures at or after now', () => {
    const result = remainingToday(at(8, 0), SAMPLE)
    expect(result.map((d) => d.time)).toEqual(['08:00', '09:30', '22:20'])
  })

  test('a departure one second past is excluded', () => {
    const result = remainingToday(at(8, 0, 1), SAMPLE)
    expect(result.map((d) => d.time)).toEqual(['09:30', '22:20'])
  })

  test('is empty after the last bus', () => {
    expect(remainingToday(at(23, 0), SAMPLE)).toEqual([])
  })
})
