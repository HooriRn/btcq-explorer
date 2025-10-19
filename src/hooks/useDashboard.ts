import { useEffect } from 'react'
import { useDashboardStore } from '../stores/dashboardStore'

export const useDashboard = () => {
  const { fetchMetrics, fetchAddressesAtRisk, refreshData } = useDashboardStore()

  // Load initial data
  useEffect(() => {
    fetchMetrics()
    fetchAddressesAtRisk()
  }, [fetchMetrics, fetchAddressesAtRisk])

  return {
    refreshData
  }
}
