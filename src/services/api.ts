import type { DashboardMetrics, SearchResponse, UTXOResponse, BlockResponse, AddressResponse } from '../types/dashboard'
import { getApiBaseUrl } from './config'

const mockMetrics: DashboardMetrics = {
  addressesIndexed: 1_234_567,
  addressesAtRisk: 89_156,
  currentBitcoinHeight: 850_000,
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
}

// API functions
export const api = {
  fetchMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const response = await fetch(`${getApiBaseUrl()}stats/overview`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      // Transform API response to our DashboardMetrics format
      return {
        addressesIndexed: data.address_count || 0, // Use address_count from API
        addressesAtRisk: 0, // This field may not be available in new API
        currentBitcoinHeight: data.latest_block.height,
        trackedExposed: 0, // This field may not be available in new API
        trackedRevealed: 0, // This field may not be available in new API
        scannedBlocks: 0, // Not used anymore
        latestBlock: {
          height: data.latest_block.height,
          hash: '', // Hash may not be in the new API
          ScannedAt: data.latest_block.scanned_at, // ScannedAt may not be in the new API
          exposedCount: 0, // This field may not be available in new API
          revealedCount: 0 // This field may not be available in new API
        },
        addressCount: data.address_count,
        utxoCount: data.utxo_count,
        highRiskAddressCount: data.high_risk_address_count,
        mediumRiskAddressCount: data.medium_risk_address_count
      }
    } catch (error) {
      console.error('Failed to fetch metrics from API:', error)
      // Fallback to mock data if API fails
      return { ...mockMetrics }
    }
  },

  searchAddress: async (query: string): Promise<SearchResponse> => {
    try {
      const response = await fetch(`${getApiBaseUrl()}search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to search address:', error)
      // Return empty results if API fails
      return { results: [] }
    }
  },

  fetchLatestUtxos: async (): Promise<UTXOResponse> => {
    try {
      const response = await fetch(`${getApiBaseUrl()}latest/utxos`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch latest UTXOs:', error)
      return { results: [] }
    }
  },

  fetchLatestBlocks: async (): Promise<BlockResponse> => {
    try {
      const response = await fetch(`${getApiBaseUrl()}latest/blocks`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch latest blocks:', error)
      return { results: [] }
    }
  },

  fetchLatestAddresses: async (): Promise<AddressResponse> => {
    try {
      const response = await fetch(`${getApiBaseUrl()}latest/addresses`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch latest addresses:', error)
      return { results: [] }
    }
  }
}
