import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  apiBaseUrl: string
  setApiBaseUrl: (url: string) => void
  resetApiBaseUrl: () => void
  btcqIndexerUrl: string
  setBtcqIndexerUrl: (url: string) => void
  resetBtcqIndexerUrl: () => void
}

// Get default API base URL from environment variable, with fallback
const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.thegreatlich.xyz/'
const DEFAULT_BTCQ_INDEXER_URL = import.meta.env.VITE_BTCQ_INDEXER_URL || 'https://indexer.thegreatlich.xyz/'

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
      btcqIndexerUrl: DEFAULT_BTCQ_INDEXER_URL,
      setBtcqIndexerUrl: (url: string) => {
        const normalizedUrl = url.trim().endsWith('/') ? url.trim() : `${url.trim()}/`
        set({ btcqIndexerUrl: normalizedUrl })
      },
      resetBtcqIndexerUrl: () => {
        set({ btcqIndexerUrl: DEFAULT_BTCQ_INDEXER_URL })
      },
    }),
    {
      name: 'settings-storage',
    }
  )
)

