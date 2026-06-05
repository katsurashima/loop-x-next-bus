import './style.css'
import { nowInTokyo } from './core/clock.ts'
import { TIMETABLE } from './data/timetable.ts'
import { renderTimetable } from './ui/render.ts'
import { setupThemeToggle } from './ui/theme.ts'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) {
  throw new Error('Mount point #app not found')
}

// The toggle lives outside #app so the per-second re-render never recreates it.
const themeButton = document.querySelector<HTMLButtonElement>('#theme-toggle')
if (themeButton) {
  setupThemeToggle(themeButton)
}

// Re-render once per second so the countdown stays live. Time is pinned to JST
// so the result is correct regardless of the device's timezone setting.
const tick = () => {
  app.innerHTML = renderTimetable(nowInTokyo(), TIMETABLE)
}

tick()
setInterval(tick, 1000)
