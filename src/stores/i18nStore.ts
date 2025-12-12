import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '../i18n/config'

type Language = 'en' | 'es' | 'fr'

interface I18nState {
  language: Language
  setLanguage: (language: Language) => void
  getCurrentLanguage: () => Language
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => {
      // Initialize language from i18next or default to 'en'
      const initialLanguage = (i18n.language?.split('-')[0] as Language) || 'en'
      const validLanguage = ['en', 'es', 'fr'].includes(initialLanguage) ? initialLanguage : 'en'
      
      // Set initial language
      i18n.changeLanguage(validLanguage)
      document.documentElement.lang = validLanguage
      
      return {
        language: validLanguage,
        setLanguage: (language: Language) => {
          set({ language })
          i18n.changeLanguage(language)
          // Update html lang attribute
          document.documentElement.lang = language
        },
        getCurrentLanguage: () => {
          return get().language
        }
      }
    },
    {
      name: 'i18n-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Sync with i18next on rehydration
          i18n.changeLanguage(state.language)
          document.documentElement.lang = state.language
        } else {
          // If no state, initialize with detected language
          const detectedLang = (i18n.language?.split('-')[0] as Language) || 'en'
          const validLang = ['en', 'es', 'fr'].includes(detectedLang) ? detectedLang : 'en'
          i18n.changeLanguage(validLang)
          document.documentElement.lang = validLang
        }
      }
    }
  )
)

