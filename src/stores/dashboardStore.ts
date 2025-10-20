import { create } from 'zustand'
import type { AddressAtRisk, DashboardMetrics } from '../types/dashboard'
import { api } from '../services/api'

interface DashboardState {
  metrics: DashboardMetrics
  addressesAtRisk: AddressAtRisk[]
  isLoading: boolean
  lastUpdated: string
  fetchMetrics: () => Promise<void>
  fetchAddressesAtRisk: () => Promise<void>
  refreshData: () => Promise<void>
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: {
    addressesIndexed: 0,
    addressesAtRisk: 0,
    currentBitcoinHeight: 0,
    trackedExposed: 0,
    trackedRevealed: 0,
    scannedBlocks: 0,
    latestBlock: {
      height: 0,
      hash: '',
      scannedAt: '',
      exposedCount: 0,
      revealedCount: 0
    }
  },
  addressesAtRisk: [],
  isLoading: false,
  lastUpdated: '',

  fetchMetrics: async () => {
    set({ isLoading: true })
    try {
      const metrics = await api.fetchMetrics()
      set({ metrics, lastUpdated: new Date().toLocaleTimeString() })
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  fetchAddressesAtRisk: async () => {
    set({ isLoading: true })
    try {
      const addresses = await api.fetchAddressesAtRisk()
      set({ addressesAtRisk: addresses, lastUpdated: new Date().toLocaleTimeString() })
    } catch (error) {
      console.error('Failed to fetch addresses at risk:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  refreshData: async () => {
    set({ isLoading: true })
    try {
      const [metrics, addresses] = await Promise.all([
        api.fetchMetrics(),
        api.fetchAddressesAtRisk()
      ])
      set({ 
        metrics, 
        addressesAtRisk: addresses, 
        lastUpdated: new Date().toLocaleTimeString() 
      })
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      set({ isLoading: false })
    }
  }
}))
