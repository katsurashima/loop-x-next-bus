// Manual theme override on top of the OS preference. State is one of:
//   auto  — follow the device's prefers-color-scheme (default)
//   light — force light
//   dark  — force dark
// Persisted in localStorage; applied via a data-theme attribute on <html>.

export type Theme = 'auto' | 'light' | 'dark'

const STORAGE_KEY = 'loopx-theme'
const ORDER: readonly Theme[] = ['auto', 'light', 'dark']

const LABELS: Record<Theme, string> = {
  auto: 'テーマ: 自動（端末設定）',
  light: 'テーマ: ライト',
  dark: 'テーマ: ダーク',
}

const ICONS: Record<Theme, string> = {
  // Half-filled circle: "auto / adapts".
  auto: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/></svg>`,
  // Sun.
  light: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  // Moon.
  dark: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>`,
}

function readTheme(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark') return value
  } catch {
    // localStorage unavailable (private mode etc.): fall back to auto.
  }
  return 'auto'
}

function storeTheme(theme: Theme): void {
  try {
    if (theme === 'auto') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Persistence is best-effort; the in-memory state still applies this session.
  }
}

/** Apply a theme to the document by toggling the data-theme attribute. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  if (theme === 'auto') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)
}

/** Wire a button that cycles auto → light → dark and persists the choice. */
export function setupThemeToggle(button: HTMLButtonElement): void {
  let theme = readTheme()

  const sync = (): void => {
    applyTheme(theme)
    button.innerHTML = ICONS[theme]
    button.setAttribute('aria-label', LABELS[theme])
    button.setAttribute('title', LABELS[theme])
  }

  sync()

  button.addEventListener('click', () => {
    theme = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]
    storeTheme(theme)
    sync()
  })
}
