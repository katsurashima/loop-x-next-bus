import './style.css'
import { nowInTokyo } from './core/clock.ts'
import { TIMETABLE } from './data/timetable.ts'
import { renderTimetable } from './ui/render.ts'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) {
  throw new Error('Mount point #app not found')
}

// Re-render once per second so the countdown stays live. Time is pinned to JST
// so the result is correct regardless of the device's timezone setting.
const tick = () => {
  app.innerHTML = renderTimetable(nowInTokyo(), TIMETABLE)
}

tick()
setInterval(tick, 1000)
