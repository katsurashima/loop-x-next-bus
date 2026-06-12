import './style.css'
import { nowInTokyo } from './core/clock.ts'
import { TIMETABLE } from './data/timetable.ts'
import { renderTimetable, type ViewState } from './ui/render.ts'
import { setupThemeToggle } from './ui/theme.ts'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) {
  throw new Error('Mount point #app not found')
}

const SELECTED_KEY = 'loopx-direction'

const isKnownDirection = (id: string | null | undefined): id is string =>
  id != null && TIMETABLE.directions.some((d) => d.id === id)

const readSelected = (): string | null => {
  try {
    return localStorage.getItem(SELECTED_KEY)
  } catch {
    return null
  }
}

const storeSelected = (id: string): void => {
  try {
    localStorage.setItem(SELECTED_KEY, id)
  } catch {
    // Persistence is best-effort.
  }
}

const stored = readSelected()
const view: ViewState = {
  selectedId: isKnownDirection(stored) ? stored : TIMETABLE.directions[0].id,
  showAll: false,
}

// Re-render once per second so the countdown stays live (time pinned to JST).
const tick = (): void => {
  app.innerHTML = renderTimetable(nowInTokyo(), TIMETABLE, view)
}

// Delegated so interactions survive the per-second re-render of #app.
app.addEventListener('click', (event) => {
  const target = event.target as HTMLElement

  const tab = target.closest<HTMLElement>('[data-direction-tab]')
  const tabId = tab?.dataset.directionTab
  if (isKnownDirection(tabId)) {
    if (view.selectedId !== tabId) {
      view.selectedId = tabId
      view.showAll = false
      storeSelected(view.selectedId)
      tick()
    }
    return
  }

  if (target.closest('[data-toggle-all]')) {
    view.showAll = !view.showAll
    tick()
  }
})

const themeButton = document.querySelector<HTMLButtonElement>('#theme-toggle')
if (themeButton) {
  setupThemeToggle(themeButton)
}

tick()
setInterval(tick, 1000)
