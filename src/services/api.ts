import type { DashboardMetrics, SearchResponse, UTXOResponse, BlockResponse, AddressResponse, SupplyStatsResponse, AddressStatsResponse, ScriptTypeExposureStat, BtcqBlocksResponse, BtcqBlock } from '../types/dashboard'
import { getApiBaseUrl, getBtcqIndexerUrl } from './config'
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
  },
  exposedAddressCount: 0,
  notExposedAddressCount: 0,
  reusedAddressCount: 0,
  exposedBalanceSat: 0,
  safeBalanceSat: 0,
  scriptTypeExposureStats: []
}

// API functions
export const api = {
  fetchMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const overviewResponse = await fetch(`${getApiBaseUrl()}stats/overview`)
      if (!overviewResponse.ok) {
        throw new Error(`HTTP error! status: ${overviewResponse.status}`)
      }
      const data = await overviewResponse.json()

      let addressStatsResults: AddressStatsResponse['results'] = []
      try {
        const addressStatsResponse = await fetch(`${getApiBaseUrl()}address/stats`)
        if (addressStatsResponse.ok) {
          const statsData: AddressStatsResponse = await addressStatsResponse.json()
          addressStatsResults = statsData.results || []
        } else {
          console.warn('address/stats responded with non-OK status:', addressStatsResponse.status)
        }
      } catch (statsError) {
        console.error('Failed to fetch address stats:', statsError)
      }

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

      const badTypeSet = new Set([
        ...HIGH_RISK_TYPES.map(type => type.toLowerCase()),
        'unknown',
        'nonstandard'
      ])

      let scriptTypeExposureStats: ScriptTypeExposureStat[] = []

      if (addressStatsResults.length > 0) {
        scriptTypeExposureStats = addressStatsResults.map(entry => {
          const scriptType = entry.script_pub_type || 'unknown'
          const totalCount = entry.count || 0
          const reusedCount = entry.reused_count || 0
          const totalSat = entry.total_sat || 0
          const reusedSat = entry.reused_sat || 0
          const typeKey = scriptType.toLowerCase()
          const isBadType = badTypeSet.has(typeKey)
          const exposedCount = isBadType ? totalCount : Math.min(reusedCount, totalCount)
          const exposedSat = isBadType ? totalSat : Math.min(reusedSat, totalSat)
          const safeCount = Math.max(totalCount - exposedCount, 0)
          const safeSat = Math.max(totalSat - exposedSat, 0)
          const exposureCategory: ScriptTypeExposureStat['exposureCategory'] = isBadType
            ? 'bad_type'
            : (exposedCount > 0 ? 'reuse' : 'none')

          return {
            scriptType,
            totalCount,
            reusedCount,
            totalSat,
            reusedSat,
            exposedCount,
            safeCount,
            exposedSat,
            safeSat,
            exposureCategory
          }
        })
      }

      let addressesIndexedTotal = 0
      let exposedAddressCount = 0
      let reusedAddressCount = 0
      let exposedBalanceSat = 0
      let safeBalanceSat = 0

      if (scriptTypeExposureStats.length > 0) {
        scriptTypeExposureStats.forEach(stat => {
          addressesIndexedTotal += stat.totalCount
          exposedAddressCount += stat.exposedCount
          reusedAddressCount += stat.reusedCount
          exposedBalanceSat += stat.exposedSat
          safeBalanceSat += stat.safeSat
        })
      }

      if (scriptTypeExposureStats.length === 0) {
        addressesIndexedTotal = data.address_count || 0
        exposedAddressCount = highRiskCount
        reusedAddressCount = 0
        exposedBalanceSat = 0
        safeBalanceSat = data.total_supply_sat || 0
      }

      if (addressesIndexedTotal === 0) {
        addressesIndexedTotal = data.address_count || 0
      }

      const notExposedAddressCount = Math.max(addressesIndexedTotal - exposedAddressCount, 0)
      if (safeBalanceSat === 0) {
        const overviewSupply = data.total_supply_sat || 0
        safeBalanceSat = Math.max(overviewSupply - exposedBalanceSat, 0)
      }
      
      // Transform API response to our DashboardMetrics format
      return {
        addressesIndexed: addressesIndexedTotal,
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
        addressCount: addressesIndexedTotal,
        utxoCount: data.utxo_count,
        highRiskAddressCount: highRiskCount,
        mediumRiskAddressCount: mediumRiskCount,
        scriptTypeCounts: scriptTypeCounts,
        exposedAddressCount,
        notExposedAddressCount,
        reusedAddressCount,
        exposedBalanceSat,
        safeBalanceSat,
        scriptTypeExposureStats
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
  },

  fetchSupplyStats: async (): Promise<SupplyStatsResponse> => {
    try {
      const response = await fetch(`${getApiBaseUrl()}stats/supply`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch supply stats:', error)
      return { total_supply_sat: 0, script_type_balances: {} }
    }
  },

  fetchBitcoinPrice: async (): Promise<number> => {
    try {
      // Primary source: Coinbase spot price (typically very responsive)
      const coinbaseRes = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot')
      if (coinbaseRes.ok) {
        const coinbaseData = await coinbaseRes.json()
        const amount = Number(coinbaseData?.data?.amount)
        if (!Number.isNaN(amount) && amount > 0) {
          return amount
        }
      } else {
        console.warn('Coinbase price API responded with non-OK status:', coinbaseRes.status)
      }

      // Fallback: CoinGecko free API (no API key required)
      const coingeckoRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      )
      if (!coingeckoRes.ok) {
        throw new Error(`HTTP error from CoinGecko! status: ${coingeckoRes.status}`)
      }
      const cgData = await coingeckoRes.json()
      return cgData.bitcoin?.usd || 0
    } catch (error) {
      console.error('Failed to fetch Bitcoin price from all sources:', error)
      return 0
    }
  },

  fetchBtcqBlocks: async (): Promise<BtcqBlocksResponse> => {
    try {
      const base = getBtcqIndexerUrl().replace(/\/$/, '')
      const response = await fetch(`${base}/v2/blocks`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (Array.isArray(data)) return data
      if (data && Array.isArray(data.blocks)) return data.blocks
      if (data && typeof data.height === 'number' && data.hash) return [data]
      return []
    } catch (error) {
      console.error('Failed to fetch BTCQ blocks:', error)
      return []
    }
  },

  fetchBtcqBlock: async (id: string): Promise<BtcqBlock | null> => {
    try {
      const base = getBtcqIndexerUrl().replace(/\/$/, '')
      const response = await fetch(`${base}/v2/blocks?height=${encodeURIComponent(id)}`)
      if (!response.ok) return null
      const data = await response.json()
      if (data && typeof data.height === 'number' && data.hash) return data as BtcqBlock
      if (Array.isArray(data) && data.length > 0 && data[0].height != null && data[0].hash)
        return data[0] as BtcqBlock
      const blocks = await api.fetchBtcqBlocks()
      const idNum = Number(id)
      const found = blocks.find(
        (b) => b.height === idNum || String(b.height) === id || b.hash === id
      )
      return found ?? null
    } catch (error) {
      console.error('Failed to fetch BTCQ block:', error)
      return null
    }
  }
}
