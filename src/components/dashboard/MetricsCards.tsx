import { useDashboardStore } from '../../stores/dashboardStore'

export const MetricsCards = () => {
  const { metrics, isLoading } = useDashboardStore()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="bg-gray-200 p-3 rounded-full w-14 h-14"></div>
          </div>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="bg-gray-200 p-3 rounded-full w-14 h-14"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Addresses Indexed Card */}
      <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Addresses Indexed</h3>
            <p className="text-3xl font-bold text-blue-600">{metrics.addressesIndexed.toLocaleString()}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Addresses at-risk Card */}
      <div className="bg-white border-2 border-yellow-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Addresses at-risk</h3>
            <p className="text-3xl font-bold text-yellow-600">{metrics.addressesAtRisk.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-full">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
