import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  getEffectiveTheme: () => 'light' | 'dark'
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme })
        // Update data-theme attribute on html tag
        const html = document.documentElement
        if (theme === 'system') {
          // Remove data-theme to use system preference
          html.removeAttribute('data-theme')
        } else {
          html.setAttribute('data-theme', theme)
        }
      },
      getEffectiveTheme: () => {
        const { theme } = get()
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return theme
      },
      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      }
    }),
    {
      name: 'theme-storage',
    }
  )
)
