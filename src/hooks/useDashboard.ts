import { useEffect } from 'react'
import { useDashboardStore } from '../stores/dashboardStore'

export const useDashboard = () => {
  const { fetchMetrics, fetchLatestUtxos, fetchLatestBlocks, refreshData } = useDashboardStore()

  // Load initial data
  useEffect(() => {
    fetchMetrics()
    fetchLatestUtxos()
    fetchLatestBlocks()
  }, [fetchMetrics, fetchLatestUtxos, fetchLatestBlocks])

  return {
    refreshData
  }
}
