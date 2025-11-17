import { Button, Spinner, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { TableSkeleton } from '../common/LoadingSkeleton'
import { calculateUTXORiskLevel } from '../../utils/riskLevel'
import { CopyButton } from '../common/CopyButton'

export const LatestUTXOs = () => {
  const { latestUtxos, isLoading, lastUpdated, fetchLatestUtxos } = useDashboardStore()

  // Only show skeleton on initial load when there's no data
  if (isLoading && latestUtxos.length === 0) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest UTXOs</h2>
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

  const formatAddress = (address: string, maxLength: number = 20) => {
    if (!address) return ''
    if (address.length <= maxLength) return address
    return `${address.slice(0, maxLength - 3)}...`
  }

  // Calculate risk levels for all UTXOs
  const utxosWithRisk = latestUtxos.map(utxo => {
    const riskLevel = calculateUTXORiskLevel(utxo.script_pub_type, false)
    return { ...utxo, riskLevel }
  })

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest UTXOs</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated || 'Never'}
          </span>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={fetchLatestUtxos}
            title="Refresh list"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table 
            aria-label="Latest UTXOs table" 
            removeWrapper
            classNames={{
              wrapper: "bg-white dark:bg-gray-800 min-w-full",
              th: "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 whitespace-nowrap",
              tr: "border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50",
              td: "bg-white dark:bg-gray-800 whitespace-nowrap",
              thead: "[&>tr]:first:rounded-b-none [&>tr>th]:first:rounded-bl-none [&>tr>th]:last:rounded-br-none"
            }}
          >
          <TableHeader>
            <TableColumn>TXID</TableColumn>
            <TableColumn>VOUT</TableColumn>
            <TableColumn>Address</TableColumn>
            <TableColumn>Value (BTC)</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Risk</TableColumn>
            <TableColumn>Block</TableColumn>
          </TableHeader>
          <TableBody>
            {utxosWithRisk.map((utxo, index) => (
              <TableRow key={`${utxo.txid}-${utxo.vout}-${index}`}>
                <TableCell>
                  <div className="flex items-center space-x-2 min-w-0">
                    <a 
                      href={`https://mempool.space/tx/${utxo.txid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors truncate max-w-[180px]"
                      title={utxo.txid}
                    >
                      {formatAddress(utxo.txid, 20)}
                    </a>
                    <CopyButton text={utxo.txid} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {utxo.vout}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2 min-w-0">
                    <a 
                      href={`https://mempool.space/address/${utxo.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors truncate max-w-[200px]"
                      title={utxo.address}
                    >
                      {formatAddress(utxo.address, 20)}
                    </a>
                    <CopyButton text={utxo.address} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {formatValue(utxo.value_sat)}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip color="primary" variant="flat" size="sm">
                    {utxo.script_pub_type}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    color={utxo.riskLevel === 'High' ? 'danger' : utxo.riskLevel === 'Medium' ? 'warning' : 'success'}
                    variant="flat"
                    size="sm"
                  >
                    {utxo.riskLevel}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {utxo.created_block.toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  )
}

