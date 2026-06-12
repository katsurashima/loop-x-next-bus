import type { RouteDirection } from '../data/timetable.ts'
import {
  firstDeparture,
  remainingToday,
  secondsOfDay,
  type Departure,
} from './nextBus.ts'
import { isServiceDay, nextServiceDate } from './serviceDay.ts'

/** How many subsequent departures to keep for the preview / expanded list. */
const PREVIEW_COUNT = 6

/** Service is running today and a bus is still to come. */
export interface RunningStatus {
  kind: 'running'
  /** The immediate next departure. */
  departure: Departure
  /** Whole seconds from now until it leaves (>= 0). */
  secondsUntil: number
  /** Following departures today (may be empty). */
  following: Departure[]
  /** True when `departure` is the last run of the day. */
  isLastToday: boolean
}

/**
 * No bus is coming today: either a service day whose runs are done
 * ('finished') or a non-service day ('closed').
 */
export interface IdleStatus {
  kind: 'finished' | 'closed'
  /** First service day after today. */
  nextServiceDate: Date
  /** That day's first departure, or null if the route has no data. */
  firstDeparture: Departure | null
}

export type DirectionStatus = RunningStatus | IdleStatus

/**
 * Resolve what to show for one direction at the given moment, honouring the
 * weekday-only / holiday-closed schedule.
 */
export function directionStatus(
  now: Date,
  direction: RouteDirection,
  serviceWeekdays: readonly number[],
): DirectionStatus {
  if (isServiceDay(now, serviceWeekdays)) {
    const remaining = remainingToday(now, direction.departures)
    if (remaining.length > 0) {
      const departure = remaining[0]
      return {
        kind: 'running',
        departure,
        secondsUntil: departure.secondsOfDay - secondsOfDay(now),
        following: remaining.slice(1, 1 + PREVIEW_COUNT),
        isLastToday: remaining.length === 1,
      }
    }
    // Service day, but the last bus has already left.
    return {
      kind: 'finished',
      nextServiceDate: nextServiceDate(now, serviceWeekdays),
      firstDeparture: firstDeparture(direction.departures),
    }
  }

  // Weekend, holiday, or year-end closure.
  return {
    kind: 'closed',
    nextServiceDate: nextServiceDate(now, serviceWeekdays),
    firstDeparture: firstDeparture(direction.departures),
  }
}
