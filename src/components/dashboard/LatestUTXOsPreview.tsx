import { Link } from 'react-router-dom'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@heroui/react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { TableSkeleton } from '../common/LoadingSkeleton'
import { calculateUTXORiskLevel } from '../../utils/riskLevel'
import { CopyButton } from '../common/CopyButton'

export const LatestUTXOsPreview = () => {
  const { latestUtxos, isLoading } = useDashboardStore()

  // Only show skeleton on initial load when there's no data
  if (isLoading && latestUtxos.length === 0) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest UTXOs</h2>
          <Link 
            to="/utxos"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
          >
            View All →
          </Link>
        </div>
        <TableSkeleton />
      </div>
    )
  }

  const formatValue = (valueSat: number) => {
    return (valueSat / 100_000_000).toFixed(8)
  }

  // Calculate risk levels and limit to 5 rows
  const utxosWithRisk = latestUtxos
    .slice(0, 5)
    .map(utxo => {
      const riskLevel = calculateUTXORiskLevel(utxo.script_pub_type, false)
      return { ...utxo, riskLevel }
    })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest UTXOs</h2>
        <Link 
          to="/utxos"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
        >
          View All →
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <Table 
          aria-label="Latest UTXOs preview table" 
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
            <TableColumn>TXID</TableColumn>
            <TableColumn>Address</TableColumn>
            <TableColumn>Value (BTC)</TableColumn>
            <TableColumn>Risk</TableColumn>
            <TableColumn>Block</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No UTXOs found">
            {utxosWithRisk.map((utxo, index) => (
              <TableRow key={`${utxo.txid}-${utxo.vout}-${index}`}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <a 
                      href={`https://mempool.space/tx/${utxo.txid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                      {utxo.txid.slice(0, 16)}...
                    </a>
                    <CopyButton text={utxo.txid} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <a 
                      href={`https://mempool.space/address/${utxo.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                      {utxo.address.slice(0, 16)}...
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
  )
}

