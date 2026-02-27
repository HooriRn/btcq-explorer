// API Configuration
// This function ensures we always get the current API base URL from the store
// Note: This is called at runtime, so it will always use the latest value from localStorage
import { useSettingsStore } from '../stores/settingsStore'

export const getApiBaseUrl = (): string => {
  return useSettingsStore.getState().apiBaseUrl
}

export const getBtcqIndexerUrl = (): string => {
  return useSettingsStore.getState().btcqIndexerUrl
}

