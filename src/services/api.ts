import type { DashboardMetrics, SearchResponse, UTXOResponse, BlockResponse, AddressResponse } from '../types/dashboard'
import { getApiBaseUrl } from './config'
import { HIGH_RISK_TYPES, MEDIUM_RISK_TYPES } from '../utils/riskLevel'

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
      
      // Calculate high and medium risk counts from script_type_counts
      const scriptTypeCounts = data.script_type_counts || {}
      let highRiskCount = 0
      let mediumRiskCount = 0
      
      // Sum counts for high risk script types
      HIGH_RISK_TYPES.forEach(scriptType => {
        highRiskCount += scriptTypeCounts[scriptType] || 0
      })
      // Also include 'unknown' as high risk
      highRiskCount += scriptTypeCounts['unknown'] || 0
      
      // Sum counts for medium risk script types
      MEDIUM_RISK_TYPES.forEach(scriptType => {
        mediumRiskCount += scriptTypeCounts[scriptType] || 0
      })
      
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
          hash: data.latest_block.hash || '', // Use hash from API if available
          ScannedAt: data.latest_block.scanned_at, // ScannedAt may not be in the new API
          exposedCount: 0, // This field may not be available in new API
          revealedCount: 0 // This field may not be available in new API
        },
        addressCount: data.address_count,
        utxoCount: data.utxo_count,
        highRiskAddressCount: highRiskCount,
        mediumRiskAddressCount: mediumRiskCount
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
