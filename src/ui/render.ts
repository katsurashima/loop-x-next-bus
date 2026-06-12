import type { Departure } from '../core/nextBus.ts'
import { directionStatus, type DirectionStatus } from '../core/schedule.ts'
import { SITE } from '../data/site.ts'
import type { Place, RouteDirection, Timetable } from '../data/timetable.ts'
import { arrowIcon, busIcon, placeIcon } from './icons.ts'

/** Below this many seconds the countdown turns urgent. */
const SOON_THRESHOLD_SECONDS = 3 * 60
/** Departures shown inline (次 / その次) before the expander. */
const INLINE_FOLLOWING = 2

const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'] as const

/** Which direction tab is active and whether the full list is expanded. */
export interface ViewState {
  selectedId: string
  showAll: boolean
}

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

const tabBar = (timetable: Timetable, selectedId: string): string => {
  const items = timetable.directions
    .map((d) => {
      const selected = d.id === selectedId
      return `
        <button class="tab" type="button" role="tab" data-direction-tab="${escapeHtml(d.id)}" data-tone="${d.tone}" aria-selected="${selected}">
          <span class="tab-icon">${placeIcon(d.origin.icon)}</span>
          <span>${escapeHtml(d.origin.name)}から乗る</span>
        </button>`
    })
    .join('')
  return `<nav class="tabs" role="tablist">${items}</nav>`
}

const journeyStrip = (origin: Place, destination: Place): string => `
    <div class="journey" aria-hidden="true">
      <span class="endpoint">
        <span class="endpoint-icon">${placeIcon(origin.icon)}</span>
        <span class="endpoint-name">${escapeHtml(origin.name)}</span>
      </span>
      <span class="track">
        <span class="rail"></span>
        <span class="arrow-mid">${arrowIcon()}</span>
      </span>
      <span class="endpoint">
        <span class="endpoint-icon">${placeIcon(destination.icon)}</span>
        <span class="endpoint-name">${escapeHtml(destination.name)}</span>
      </span>
    </div>`

const runningCore = (
  status: Extract<DirectionStatus, { kind: 'running' }>,
): string => {
  const soon = status.secondsUntil <= SOON_THRESHOLD_SECONDS
  const lastTag = status.isLastToday ? '<span class="tag">本日最終</span>' : ''
  const inline = status.following.slice(0, INLINE_FOLLOWING)
  const followingLine = inline.length
    ? `<p class="following">${inline
        .map((d, i) => `${i === 0 ? '次' : 'その次'} ${escapeHtml(d.time)}`)
        .join('　／　')}</p>`
    : '<p class="following">本日これが最終便です</p>'
  return `
    <p class="next-label">次の出発 ${lastTag}</p>
    <p class="next-time"><time datetime="${escapeHtml(status.departure.time)}">${escapeHtml(status.departure.time)}</time></p>
    <p class="countdown${soon ? ' soon' : ''}">${escapeHtml(formatCountdown(status.secondsUntil))}</p>
    ${followingLine}`
}

const expander = (
  status: Extract<DirectionStatus, { kind: 'running' }>,
  showAll: boolean,
): string => {
  if (status.following.length === 0) return ''
  const list = showAll
    ? `<ul class="all-list">${status.following
        .map((d: Departure) => `<li>${escapeHtml(d.time)}</li>`)
        .join('')}</ul>`
    : ''
  return `
    <button class="show-all" type="button" data-toggle-all aria-expanded="${showAll}">
      ${showAll ? '閉じる' : 'ほかの便を見る'}<span class="chev">${showAll ? '▾' : '›'}</span>
    </button>
    ${list}`
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

const board = (
  now: Date,
  direction: RouteDirection,
  serviceWeekdays: readonly number[],
  showAll: boolean,
): string => {
  const status = directionStatus(now, direction, serviceWeekdays)
  const core = status.kind === 'running' ? runningCore(status) : idleBody(status)
  const more = status.kind === 'running' ? expander(status, showAll) : ''

  return `
    <section class="board" data-tone="${direction.tone}" data-direction="${escapeHtml(direction.id)}">
      <h2 class="route-head">
        ${escapeHtml(direction.origin.name)}<span class="route-arrow">→</span>${escapeHtml(direction.destination.name)}
      </h2>
      <span class="tagline">${escapeHtml(direction.tagline)}</span>
      ${core}
      ${journeyStrip(direction.origin, direction.destination)}
      ${more}
    </section>`
}

/** Build the full page markup for a given moment and view state. */
export function renderTimetable(
  now: Date,
  timetable: Timetable,
  view: ViewState,
): string {
  const clock = now.toLocaleTimeString('ja-JP', { hour12: false })
  const selected =
    timetable.directions.find((d) => d.id === view.selectedId) ??
    timetable.directions[0]

  return `
    <main class="app">
      <header class="app-head">
        <div class="brand"><span class="brand-bus">${busIcon()}</span>次のバス</div>
        <p class="clock">現在 ${escapeHtml(clock)}</p>
      </header>
      ${tabBar(timetable, selected.id)}
      ${board(now, selected, timetable.serviceWeekdays, view.showAll)}
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
