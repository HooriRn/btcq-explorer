import { useEffect } from 'react'
import { useDashboardStore } from '../stores/dashboardStore'

const REFRESH_INTERVAL_MS = 30000 // 30 seconds

export const useDashboard = () => {
  const { fetchMetrics, fetchLatestUtxos, fetchLatestBlocks, refreshData } = useDashboardStore()

  // Load initial data
  useEffect(() => {
    fetchMetrics()
    fetchLatestUtxos()
    fetchLatestBlocks()
  }, [fetchMetrics, fetchLatestUtxos, fetchLatestBlocks])

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
