import { Link } from 'react-router-dom'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { TableSkeleton } from '../common/LoadingSkeleton'
import { CopyButton } from '../common/CopyButton'

export const LatestBlocksPreview = () => {
  const { latestBlocks, isLoading } = useDashboardStore()

  // Only show skeleton on initial load when there's no data
  if (isLoading && latestBlocks.length === 0) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Blocks</h2>
          <Link 
            to="/blocks"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
          >
            View All →
          </Link>
        </div>
        <TableSkeleton />
      </div>
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

  // Limit to 5 rows
  const blocks = latestBlocks.slice(0, 5)

  return (
    <div>
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Blocks</h2>
        </div>
        <div className="overflow-x-auto px-4">
        <Table 
            aria-label="Latest blocks preview table" 
            removeWrapper
            classNames={{
              wrapper: "bg-white dark:bg-zinc-900 min-w-full",
              th: "bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-300 whitespace-nowrap",
              tr: "border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50",
              td: "bg-white dark:bg-zinc-900 whitespace-nowrap",
              thead: "[&>tr]:first:rounded-b-none [&>tr>th]:first:rounded-bl-none [&>tr>th]:last:rounded-br-none"
            }}
          >
          <TableHeader>
            <TableColumn>Height</TableColumn>
            <TableColumn>Hash</TableColumn>
            <TableColumn>Timestamp</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No blocks found">
            {blocks.map((block, index) => (
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
                  <div className="flex items-center space-x-2 min-w-0">
                    <a 
                      href={`https://mempool.space/block/${block.block_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors truncate max-w-[200px]"
                      title={block.block_hash}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        <Link
          to="/blocks"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#F8AC28] hover:bg-[#E89C1F] text-sm font-semibold text-white transition-colors"
        >
          <span>View All</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  )
}

