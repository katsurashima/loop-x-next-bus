import { describe, expect, test } from 'vitest'
import { inTokyo } from './clock.ts'

// These assertions hold regardless of the machine timezone the tests run on,
// because inTokyo rebuilds the date from Tokyo wall-clock fields.

describe('inTokyo', () => {
  test('shifts a UTC instant to JST wall-clock fields (UTC+9)', () => {
    // 2026-06-05T13:44:00Z → 2026-06-05 22:44:00 JST (Friday).
    const tokyo = inTokyo(new Date(Date.UTC(2026, 5, 5, 13, 44, 0)))
    expect(tokyo.getFullYear()).toBe(2026)
    expect(tokyo.getMonth() + 1).toBe(6)
    expect(tokyo.getDate()).toBe(5)
    expect(tokyo.getHours()).toBe(22)
    expect(tokyo.getMinutes()).toBe(44)
    expect(tokyo.getDay()).toBe(5) // Friday
  })

  test('rolls the date forward across the JST midnight boundary', () => {
    // 2026-06-05T15:30:00Z → 2026-06-06 00:30:00 JST (Saturday).
    const tokyo = inTokyo(new Date(Date.UTC(2026, 5, 5, 15, 30, 0)))
    expect(tokyo.getDate()).toBe(6)
    expect(tokyo.getHours()).toBe(0)
    expect(tokyo.getDay()).toBe(6) // Saturday
  })
})
