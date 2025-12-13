import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  getEffectiveTheme: () => 'light' | 'dark'
  toggleTheme: () => void
}

// Helper function to get system default theme
const getSystemDefaultTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getSystemDefaultTheme(),
      setTheme: (theme) => {
        set({ theme })
        const html = document.documentElement
        if (theme === 'system') {
          html.removeAttribute('data-theme')
        } else {
          html.setAttribute('data-theme', theme)
        }
      },
      getEffectiveTheme: () => {
        const { theme } = get()
        if (theme === 'system') {
          return getSystemDefaultTheme()
        }
        return theme
      },
      toggleTheme: () => {
        const { theme, getEffectiveTheme } = get()
        const currentEffectiveTheme = getEffectiveTheme()
        const newTheme = currentEffectiveTheme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        const html = document.documentElement
        if (state) {
          if (state.theme === 'system') {
            html.removeAttribute('data-theme')
          } else {
            html.setAttribute('data-theme', state.theme)
          }
        } else {
          const systemTheme = getSystemDefaultTheme()
          html.setAttribute('data-theme', systemTheme)
        }
      }
    }
  )
)
