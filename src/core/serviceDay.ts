import { isHoliday } from '@holiday-jp/holiday_jp'

// The LOOP-X shuttle runs on weekdays only, and is closed on Japanese public
// holidays and over the year-end period (12/29–1/3). This module decides
// whether a given calendar day has service.

/** Stop scanning forward for the next service day after this many days. */
const MAX_LOOKAHEAD_DAYS = 14

/** True when the date falls inside the year-end closure (12/29–1/3). */
export function isYearEndClosure(date: Date): boolean {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return (month === 12 && day >= 29) || (month === 1 && day <= 3)
}

/**
 * Whether the shuttle runs on the given local date.
 * Closed on non-service weekdays, Japanese public holidays (incl. substitute
 * and citizens' holidays), and the year-end period.
 */
export function isServiceDay(
  date: Date,
  serviceWeekdays: readonly number[],
): boolean {
  if (!serviceWeekdays.includes(date.getDay())) return false
  if (isYearEndClosure(date)) return false
  if (isHoliday(date)) return false
  return true
}

/**
 * The first service day strictly after `from`.
 * Returns a date at local midnight. Falls back to the lookahead bound if no
 * service day is found (should not happen for a Mon–Fri schedule).
 */
export function nextServiceDate(
  from: Date,
  serviceWeekdays: readonly number[],
): Date {
  const date = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  for (let i = 0; i < MAX_LOOKAHEAD_DAYS; i += 1) {
    date.setDate(date.getDate() + 1)
    if (isServiceDay(date, serviceWeekdays)) {
      return new Date(date)
    }
  }
  return date
}
