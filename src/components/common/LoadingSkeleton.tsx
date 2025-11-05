import { Skeleton } from '@heroui/react'

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export const LoadingSkeleton = ({ className = '', lines = 1 }: LoadingSkeletonProps) => {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 rounded ${index === lines - 1 ? 'w-3/4' : 'w-full'} ${index > 0 ? 'mt-2' : ''}`}
        />
      ))}
    </div>
  )
}

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-5 rounded w-32 mb-2" />
          <Skeleton className="h-8 rounded w-24" />
        </div>
        <Skeleton className="rounded-full w-14 h-14" />
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
