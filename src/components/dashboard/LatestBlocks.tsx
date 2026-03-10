import { Button, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { TableSkeleton } from '../common/LoadingSkeleton'
import { CopyButton } from '../common/CopyButton'

export const LatestBlocks = () => {
  const { latestBlocks, isLoading, lastUpdated, fetchLatestBlocks } = useDashboardStore()

  // Only show skeleton on initial load when there's no data
  if (isLoading && latestBlocks.length === 0) {
    return (
      <>
        <section className="pb-4 mb-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Blocks</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
              <Spinner size="sm" />
            </div>
          </div>
        </section>
        <TableSkeleton />
      </>
    )
  }

  const formatTimestamp = (timestamp: number) => {
    try {
      return new Date(timestamp / 1_000_000).toLocaleString()
    } catch {
      return 'N/A'
    }
  }

  const formatHash = (hash: string) => {
    if (!hash) return 'N/A'
    return `${hash.slice(0, 16)}...${hash.slice(-8)}`
  }

  return (
    <>
      <section className="pb-4 mb-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Blocks</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated || 'Never'}
            </span>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={fetchLatestBlocks}
              title="Refresh list"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
          </div>
        </div>
      </section>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table 
          aria-label="Latest blocks table" 
          removeWrapper
          classNames={{
            wrapper: "bg-white dark:bg-zinc-900",
            th: "bg-gray-50 dark:bg-zinc-800 text-gray-400 dark:text-gray-300",
            tr: "border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50",
            td: "bg-white dark:bg-zinc-900",
            thead: "[&>tr]:first:rounded-b-none [&>tr>th]:first:rounded-bl-none [&>tr>th]:last:rounded-br-none"
          }}
        >
          <TableHeader>
            <TableColumn>Height</TableColumn>
            <TableColumn>Hash</TableColumn>
            <TableColumn>Timestamp</TableColumn>
            <TableColumn>Scanned At</TableColumn>
          </TableHeader>
          <TableBody>
            {latestBlocks.map((block, index) => (
              <TableRow key={`${block.block_height}-${index}`}>
                <TableCell>
                  <a 
                    href={`https://mempool.space/block/${block.block_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                  >
                    {block.block_height.toLocaleString()}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <a 
                      href={`https://mempool.space/block/${block.block_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                      {formatHash(block.block_hash)}
                    </a>
                    <CopyButton text={block.block_hash} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {formatTimestamp(block.block_timestamp)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(block.scanned_at).toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

