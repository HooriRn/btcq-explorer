import { Button, Spinner, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { TableSkeleton } from '../common/LoadingSkeleton'
import { calculateUTXORiskLevel } from '../../utils/riskLevel'
import { CopyButton } from '../common/CopyButton'

export const LatestAddresses = () => {
  const { latestAddresses, isLoading, lastUpdated, fetchLatestAddresses } = useDashboardStore()

  // Only show skeleton on initial load when there's no data
  if (isLoading && latestAddresses.length === 0) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Addresses</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
            <Spinner size="sm" />
          </div>
        </div>
        
        <TableSkeleton />
      </div>
    )
  }

  const formatValue = (valueSat: number) => {
    return (valueSat / 100_000_000).toFixed(8)
  }

  const formatTimestamp = (timestamp: number) => {
    try {
      if (!timestamp || timestamp === 0) {
        return 'N/A'
      }
      return new Date(timestamp / 1_000_000).toLocaleString()
    } catch {
      return 'N/A'
    }
  }

  // Calculate risk levels for all addresses
  const addressesWithRisk = latestAddresses.map(address => {
    const riskLevel = calculateUTXORiskLevel(address.script_pub_type, false)
    return { ...address, riskLevel }
  })

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Addresses</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated || 'Never'}
          </span>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={fetchLatestAddresses}
            title="Refresh list"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <Table 
          aria-label="Latest addresses table" 
          removeWrapper
          classNames={{
            wrapper: "bg-white dark:bg-gray-800",
            th: "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300",
            tr: "border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50",
            td: "bg-white dark:bg-gray-800",
            thead: "[&>tr]:first:rounded-b-none [&>tr>th]:first:rounded-bl-none [&>tr>th]:last:rounded-br-none"
          }}
        >
          <TableHeader>
            <TableColumn>Address</TableColumn>
            <TableColumn>Balance (BTC)</TableColumn>
            <TableColumn>UTXO Count</TableColumn>
            <TableColumn>TX Count</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Risk</TableColumn>
            <TableColumn>First Seen</TableColumn>
            <TableColumn>Last Seen</TableColumn>
          </TableHeader>
          <TableBody>
            {addressesWithRisk.map((address, index) => (
              <TableRow key={`${address.address}-${index}`}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <a 
                      href={`https://mempool.space/address/${address.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                      {address.address}
                    </a>
                    <CopyButton text={address.address} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {formatValue(address.balance_sat)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {address.utxo_count.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {(address.tx_count ?? address.appearances ?? 0).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip color="primary" variant="flat" size="sm">
                    {address.script_pub_type}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    color={address.riskLevel === 'High' ? 'danger' : address.riskLevel === 'Medium' ? 'warning' : 'success'}
                    variant="flat"
                    size="sm"
                  >
                    {address.riskLevel}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{address.first_seen_block.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(address.first_seen_block_timestamp)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{address.last_seen_block.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(address.last_seen_block_timestamp)}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

