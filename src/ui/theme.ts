// Manual light/dark toggle. First visit follows the OS preference; tapping the
// button switches explicitly and persists the choice in localStorage.
// A two-state toggle (no separate "auto") avoids landing on a theme that looks
// identical to the previous step when the OS is already dark or light.

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'loopx-theme'

const LABELS: Record<Theme, string> = {
  light: 'テーマ: ライト（タップでダーク）',
  dark: 'テーマ: ダーク（タップでライト）',
}

const ICONS: Record<Theme, string> = {
  // Sun.
  light: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  // Moon.
  dark: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>`,
}

function systemTheme(): Theme {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark') return value
  } catch {
    // localStorage unavailable: treat as no stored preference.
  }
  return null
}

function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Persistence is best-effort; the in-memory state still applies this session.
  }
}

/** Force a theme by setting the data-theme attribute on <html>. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
}

/**
 * Wire a button that toggles light ⇄ dark.
 * Until the first tap, no attribute is forced so the page keeps following the
 * OS preference live; the button still reflects the current effective theme.
 */
export function setupThemeToggle(button: HTMLButtonElement): void {
  let theme: Theme = readStored() ?? systemTheme()

  const render = (): void => {
    button.innerHTML = ICONS[theme]
    button.setAttribute('aria-label', LABELS[theme])
    button.setAttribute('title', LABELS[theme])
  }

  render()

  button.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark'
    storeTheme(theme)
    applyTheme(theme)
    render()
  })
}
