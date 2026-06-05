import { describe, expect, test } from 'vitest'
import { isServiceDay, isYearEndClosure, nextServiceDate } from './serviceDay.ts'

const WEEKDAYS = [1, 2, 3, 4, 5]
const date = (y: number, m: number, d: number) => new Date(y, m - 1, d)

describe('isYearEndClosure', () => {
  test('covers 12/29–12/31 and 1/1–1/3', () => {
    expect(isYearEndClosure(date(2026, 12, 29))).toBe(true)
    expect(isYearEndClosure(date(2026, 12, 31))).toBe(true)
    expect(isYearEndClosure(date(2027, 1, 3))).toBe(true)
  })

  test('excludes 12/28 and 1/4', () => {
    expect(isYearEndClosure(date(2026, 12, 28))).toBe(false)
    expect(isYearEndClosure(date(2027, 1, 4))).toBe(false)
  })
})

describe('isServiceDay', () => {
  test('runs on an ordinary weekday', () => {
    // 2026-06-08 is a Monday.
    expect(isServiceDay(date(2026, 6, 8), WEEKDAYS)).toBe(true)
  })

  test('closed on weekends', () => {
    // 2026-06-06 Saturday, 2026-06-07 Sunday.
    expect(isServiceDay(date(2026, 6, 6), WEEKDAYS)).toBe(false)
    expect(isServiceDay(date(2026, 6, 7), WEEKDAYS)).toBe(false)
  })

  test('closed on a weekday public holiday', () => {
    // 2026-05-06 is a substitute holiday (Wed).
    expect(isServiceDay(date(2026, 5, 6), WEEKDAYS)).toBe(false)
    // 2026-02-23 天皇誕生日 (Mon).
    expect(isServiceDay(date(2026, 2, 23), WEEKDAYS)).toBe(false)
  })

  test('closed during the year-end period even on a weekday', () => {
    // 2026-12-31 is a Thursday.
    expect(isServiceDay(date(2026, 12, 31), WEEKDAYS)).toBe(false)
  })
})

describe('nextServiceDate', () => {
  test('Friday rolls over the weekend to Monday', () => {
    // 2026-06-05 is a Friday → next service day Monday 2026-06-08.
    const next = nextServiceDate(date(2026, 6, 5), WEEKDAYS)
    expect([next.getFullYear(), next.getMonth() + 1, next.getDate()]).toEqual([
      2026, 6, 8,
    ])
  })

  test('skips a weekday holiday', () => {
    // 2026-02-22 Sunday → 2/23 is 天皇誕生日 → next service 2/24 Tue.
    const next = nextServiceDate(date(2026, 2, 22), WEEKDAYS)
    expect([next.getMonth() + 1, next.getDate()]).toEqual([2, 24])
  })

  test('is always strictly after the input day', () => {
    // Monday input must not return the same Monday.
    const next = nextServiceDate(date(2026, 6, 8), WEEKDAYS)
    expect(next.getDate()).toBe(9)
  })
})
