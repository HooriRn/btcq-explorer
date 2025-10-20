import { useDashboardStore } from '../../stores/dashboardStore'
import { CardSkeleton } from '../common/LoadingSkeleton'

export const LatestBlockInfo = () => {
  const { metrics, isLoading } = useDashboardStore()

  if (isLoading) {
    return (
      <div className="mt-8">
        <CardSkeleton />
      </div>
    )
  }

  const formatTime = (timestamp: string) => {
    if (!timestamp) return 'N/A'
    try {
      const date = new Date(timestamp)
      return date.toLocaleString()
    } catch {
      return timestamp
    }
  }

  const formatHash = (hash: string) => {
    if (!hash) return 'N/A'
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`
  }

  return (
    <div className="mt-8">
      <div className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Latest Block Information</h3>
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
            <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Block Height</label>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{(metrics.latestBlock?.height || 0).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Block Hash</label>
              <p className="text-sm font-mono text-blue-600 dark:text-blue-400 break-all">{formatHash(metrics.latestBlock?.hash || '')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Scanned At</label>
              <p className="text-sm text-gray-900 dark:text-white">{formatTime(metrics.latestBlock?.scannedAt || '')}</p>
            </div>
            <div className="flex space-x-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Exposed Count</label>
                <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">{metrics.latestBlock?.exposedCount || 0}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Revealed Count</label>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">{metrics.latestBlock?.revealedCount || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
