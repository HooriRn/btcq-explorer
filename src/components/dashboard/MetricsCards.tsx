import { useDashboardStore } from '../../stores/dashboardStore'
import { CardSkeleton } from '../common/LoadingSkeleton'

export const MetricsCards = () => {
  const { metrics, isLoading } = useDashboardStore()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Address Count Card */}
      <div className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Addresses</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{(metrics.addressCount || 0).toLocaleString()}</p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
            <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* UTXO Count Card */}
      <div className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">UTXOs</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{(metrics.utxoCount || 0).toLocaleString()}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Scanned Blocks Card */}
      <div className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Scanned Blocks</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{(metrics.scannedBlocks || 0).toLocaleString()}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>

      {/* Latest Block Height Card */}
      <div className="bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-700 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Latest Block</h3>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{(metrics.latestBlock?.height || 0).toLocaleString()}</p>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
