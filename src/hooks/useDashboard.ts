import { useEffect } from 'react'
import { useDashboardStore } from '../stores/dashboardStore'

const REFRESH_INTERVAL_MS = 30000 // 30 seconds

export const useDashboard = () => {
  const { fetchMetrics, fetchSupplyStats, fetchBitcoinPrice, fetchLatestUtxos, fetchLatestBlocks, fetchLatestAddresses, refreshData } = useDashboardStore()

  // Load initial data
  useEffect(() => {
    fetchMetrics()
    fetchSupplyStats()
    fetchBitcoinPrice()
    fetchLatestUtxos()
    fetchLatestBlocks()
    fetchLatestAddresses()
  }, [fetchMetrics, fetchSupplyStats, fetchBitcoinPrice, fetchLatestUtxos, fetchLatestBlocks, fetchLatestAddresses])

  // Periodically refresh all data
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, REFRESH_INTERVAL_MS)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [refreshData])

  return {
    refreshData
  }
}
