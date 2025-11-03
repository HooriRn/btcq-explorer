import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  apiBaseUrl: string
  setApiBaseUrl: (url: string) => void
  resetApiBaseUrl: () => void
}

// Get default API base URL from environment variable, with fallback
const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.thegreatlich.xyz/'

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiBaseUrl: DEFAULT_API_BASE_URL,
      setApiBaseUrl: (url: string) => {
        // Ensure URL ends with a slash
        const normalizedUrl = url.trim().endsWith('/') ? url.trim() : `${url.trim()}/`
        set({ apiBaseUrl: normalizedUrl })
      },
      resetApiBaseUrl: () => {
        set({ apiBaseUrl: DEFAULT_API_BASE_URL })
      },
    }),
    {
      name: 'settings-storage',
    }
  )
)

