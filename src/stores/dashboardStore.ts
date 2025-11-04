import { create } from 'zustand'
import type { DashboardMetrics, UTXO, Block, Address } from '../types/dashboard'
import { api } from '../services/api'

interface DashboardState {
  metrics: DashboardMetrics
  latestUtxos: UTXO[]
  latestBlocks: Block[]
  latestAddresses: Address[]
  isLoading: boolean
  isLoadingMetrics: boolean
  lastUpdated: string
  fetchMetrics: () => Promise<void>
  fetchLatestUtxos: () => Promise<void>
  fetchLatestBlocks: () => Promise<void>
  fetchLatestAddresses: () => Promise<void>
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
      ScannedAt: '',
      exposedCount: 0,
      revealedCount: 0
    }
  },
  latestUtxos: [],
  latestBlocks: [],
  latestAddresses: [],
  isLoading: false,
  isLoadingMetrics: false,
  lastUpdated: '',

  fetchMetrics: async () => {
    set({ isLoading: true, isLoadingMetrics: true })
    try {
      const metrics = await api.fetchMetrics()
      set({ metrics, lastUpdated: new Date().toLocaleTimeString() })
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      set({ isLoading: false, isLoadingMetrics: false })
    }
  },

  fetchLatestUtxos: async () => {
    set({ isLoading: true })
    try {
      const response = await api.fetchLatestUtxos()
      set({ latestUtxos: response.results, lastUpdated: new Date().toLocaleTimeString() })
    } catch (error) {
      console.error('Failed to fetch latest UTXOs:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  fetchLatestBlocks: async () => {
    set({ isLoading: true })
    try {
      const response = await api.fetchLatestBlocks()
      set({ latestBlocks: response.results, lastUpdated: new Date().toLocaleTimeString() })
    } catch (error) {
      console.error('Failed to fetch latest blocks:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  fetchLatestAddresses: async () => {
    set({ isLoading: true })
    try {
      const response = await api.fetchLatestAddresses()
      set({ latestAddresses: response.results, lastUpdated: new Date().toLocaleTimeString() })
    } catch (error) {
      console.error('Failed to fetch latest addresses:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  refreshData: async () => {
    set({ isLoading: true, isLoadingMetrics: true })
    try {
      const [metrics, utxos, blocks, addresses] = await Promise.all([
        api.fetchMetrics(),
        api.fetchLatestUtxos(),
        api.fetchLatestBlocks(),
        api.fetchLatestAddresses()
      ])
      set({ 
        metrics,
        latestUtxos: utxos.results,
        latestBlocks: blocks.results,
        latestAddresses: addresses.results,
        lastUpdated: new Date().toLocaleTimeString() 
      })
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      set({ isLoading: false, isLoadingMetrics: false })
    }
  }
}))
