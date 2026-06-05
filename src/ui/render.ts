import type { Departure } from '../core/nextBus.ts'
import { directionStatus, type DirectionStatus } from '../core/schedule.ts'
import { SITE } from '../data/site.ts'
import type { Place, RouteDirection, Timetable } from '../data/timetable.ts'
import { busIcon, placeIcon } from './icons.ts'

/** Below this many seconds the countdown turns urgent. */
const SOON_THRESHOLD_SECONDS = 3 * 60

const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'] as const

/** Format whole seconds as a human countdown, e.g. "あと 3分20秒". */
export function formatCountdown(secondsUntil: number): string {
  const totalMinutes = Math.floor(secondsUntil / 60)
  const seconds = secondsUntil % 60
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `あと ${hours}時間${minutes}分`
  }
  if (totalMinutes >= 1) {
    return `あと ${totalMinutes}分${String(seconds).padStart(2, '0')}秒`
  }
  return `あと ${seconds}秒`
}

/** Format a service date as "6/8(月)". */
export function formatServiceDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}(${WEEKDAY_JP[date.getDay()]})`
}

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      default: return '&#39;'
    }
  })

const previewList = (departures: Departure[]): string => {
  if (departures.length === 0) return ''
  const items = departures
    .map((d) => `<li>${escapeHtml(d.time)}</li>`)
    .join('')
  return `<ul class="preview" aria-label="後続便">${items}</ul>`
}

const runningBody = (
  status: Extract<DirectionStatus, { kind: 'running' }>,
): string => {
  const soon = status.secondsUntil <= SOON_THRESHOLD_SECONDS
  const lastTag = status.isLastToday
    ? '<span class="tag">本日最終</span>'
    : ''
  return `
    <p class="next-time">
      <time datetime="${escapeHtml(status.departure.time)}">${escapeHtml(status.departure.time)}</time>
      ${lastTag}
    </p>
    <p class="countdown${soon ? ' soon' : ''}">${escapeHtml(formatCountdown(status.secondsUntil))}</p>
    ${previewList(status.following)}`
}

const idleBody = (
  status: Extract<DirectionStatus, { kind: 'finished' | 'closed' }>,
): string => {
  const heading = status.kind === 'finished'
    ? '本日の運行は終了しました'
    : '本日は運休です'
  const detail = status.firstDeparture
    ? `次の運行: ${formatServiceDate(status.nextServiceDate)} ${status.firstDeparture.time} 〜`
    : '運行データがありません'
  return `
    <p class="status">${heading}</p>
    <p class="status-detail">${escapeHtml(detail)}</p>`
}

// The bus always travels origin (left) → destination (right), so the arrow and
// animation point right in both cards. Decorative: the card label already names
// the direction for screen readers.
const journeyStrip = (origin: Place, destination: Place): string => `
    <div class="journey" aria-hidden="true">
      <span class="endpoint">
        <span class="endpoint-icon">${placeIcon(origin.icon)}</span>
        <span class="endpoint-name">${escapeHtml(origin.name)}</span>
      </span>
      <span class="track">
        <span class="rail"></span>
        <span class="bus">${busIcon()}</span>
      </span>
      <span class="endpoint">
        <span class="endpoint-icon">${placeIcon(destination.icon)}</span>
        <span class="endpoint-name">${escapeHtml(destination.name)}</span>
      </span>
    </div>`

const directionCard = (
  now: Date,
  direction: RouteDirection,
  serviceWeekdays: readonly number[],
): string => {
  const status = directionStatus(now, direction, serviceWeekdays)
  const body = status.kind === 'running'
    ? runningBody(status)
    : idleBody(status)

  return `
    <article class="card" data-direction="${escapeHtml(direction.id)}">
      <header class="card-head">
        <span class="label">${escapeHtml(direction.label)}</span>
      </header>
      ${journeyStrip(direction.origin, direction.destination)}
      ${body}
    </article>`
}

/** Build the full page markup for a given moment. */
export function renderTimetable(now: Date, timetable: Timetable): string {
  const clock = now.toLocaleTimeString('ja-JP', { hour12: false })
  const cards = timetable.directions
    .map((direction) => directionCard(now, direction, timetable.serviceWeekdays))
    .join('')

  return `
    <main class="app">
      <header class="app-head">
        <h1>${escapeHtml(timetable.routeName)}</h1>
        <p class="clock">現在 ${escapeHtml(clock)}</p>
      </header>
      <section class="cards">${cards}</section>
      <footer class="app-foot">
        <p>${escapeHtml(timetable.operator)} / ${escapeHtml(timetable.checkedOn)} 時点</p>
        <p class="note">表示はお使いの端末の時計に基づきます。実際の運行は<a href="${escapeHtml(timetable.sourceUrl)}" target="_blank" rel="noopener">事業者の最新案内</a>を確認してください。</p>
        <p class="note">${escapeHtml(SITE.disclaimer)}</p>
        ${SITE.contactFormUrl
          ? `<p class="note"><a href="${escapeHtml(SITE.contactFormUrl)}" target="_blank" rel="noopener">ご意見・関係者の方のお問い合わせはこちら</a></p>`
          : ''}
      </footer>
    </main>`
}
