import { describe, expect, test } from 'vitest'
import type { RouteDirection } from '../data/timetable.ts'
import { directionStatus } from './schedule.ts'

const WEEKDAYS = [1, 2, 3, 4, 5]

const DIRECTION: RouteDirection = {
  id: 'to-x',
  label: 'X 行き',
  origin: { name: 'A', icon: 'station' },
  destination: { name: 'X', icon: 'building' },
  departures: ['07:00', '08:00', '09:30', '22:00'],
}

// 2026-06-05 is a Friday (service day); 2026-06-06 is a Saturday (closed).
const friday = (h: number, m: number, s = 0) => new Date(2026, 5, 5, h, m, s)
const saturday = (h: number, m: number) => new Date(2026, 5, 6, h, m)

describe('directionStatus — running', () => {
  test('returns the next bus and following runs on a service day', () => {
    const status = directionStatus(friday(7, 30), DIRECTION, WEEKDAYS)
    expect(status.kind).toBe('running')
    if (status.kind !== 'running') return
    expect(status.departure.time).toBe('08:00')
    expect(status.secondsUntil).toBe(30 * 60)
    expect(status.following.map((d) => d.time)).toEqual(['09:30', '22:00'])
    expect(status.isLastToday).toBe(false)
  })

  test('flags the last bus of the day', () => {
    const status = directionStatus(friday(21, 0), DIRECTION, WEEKDAYS)
    expect(status.kind).toBe('running')
    if (status.kind !== 'running') return
    expect(status.departure.time).toBe('22:00')
    expect(status.isLastToday).toBe(true)
    expect(status.following).toEqual([])
  })
})

describe('directionStatus — finished', () => {
  test('after the last bus on a service day, points to the next service day', () => {
    const status = directionStatus(friday(23, 0), DIRECTION, WEEKDAYS)
    expect(status.kind).toBe('finished')
    if (status.kind === 'running') return
    expect(status.firstDeparture?.time).toBe('07:00')
    // Friday night → next service Monday 2026-06-08.
    expect(status.nextServiceDate.getDate()).toBe(8)
  })
})

describe('directionStatus — closed', () => {
  test('on a weekend, reports closed with the next service day', () => {
    const status = directionStatus(saturday(10, 0), DIRECTION, WEEKDAYS)
    expect(status.kind).toBe('closed')
    if (status.kind === 'running') return
    expect(status.firstDeparture?.time).toBe('07:00')
    expect(status.nextServiceDate.getDate()).toBe(8)
  })
})
