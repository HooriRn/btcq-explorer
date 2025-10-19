interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export const LoadingSkeleton = ({ className = '', lines = 1 }: LoadingSkeletonProps) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 dark:bg-gray-600 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          } ${index > 0 ? 'mt-2' : ''}`}
        />
      ))}
    </div>
  )
}

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
        </div>
        <div className="bg-gray-200 dark:bg-gray-600 p-3 rounded-full w-14 h-14"></div>
      </div>
    </div>
  )
}

export const TableSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-8 text-center">
        <LoadingSkeleton lines={2} className="max-w-md mx-auto" />
      </div>
    </div>
  )
}
