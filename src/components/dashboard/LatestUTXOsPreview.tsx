import { Link } from 'react-router-dom'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { useDashboardStore } from '../../stores/dashboardStore'
import { TableSkeleton } from '../common/LoadingSkeleton'
import { calculateUTXORiskLevel } from '../../utils/riskLevel'
import { CopyButton } from '../common/CopyButton'

export const LatestUTXOsPreview = () => {
  const { t } = useTranslation()
  const { latestUtxos, isLoading } = useDashboardStore()

  // Only show skeleton on initial load when there's no data
  if (isLoading && latestUtxos.length === 0) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('latest.latestUtxos')}</h2>
          <Link 
            to="/utxos"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
          >
            {t('latest.viewAll')}
          </Link>
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

  // Calculate risk levels and limit to 5 rows
  const utxosWithRisk = latestUtxos
    .slice(0, 5)
    .map(utxo => {
      const riskLevel = calculateUTXORiskLevel(utxo.script_pub_type, false)
      return { ...utxo, riskLevel }
    })

  return (
    <div>
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-[#E9ECF0] dark:border-zinc-800 shadow-[0_4px_14.2px_0_#3C465424] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest UTXOs</h2>
        </div>
        <div className="overflow-x-auto px-4">
        <Table 
            aria-label="Latest UTXOs preview table" 
            removeWrapper
            classNames={{
              wrapper: "bg-white dark:bg-zinc-900 min-w-full",
              th: "bg-white text-gray-500 dark:text-gray-300 whitespace-nowrap",
              tr: "border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50",
              td: "bg-white dark:bg-zinc-900 whitespace-nowrap",
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
                  <Chip
                    color={utxo.riskLevel === 'High' ? 'danger' : utxo.riskLevel === 'Medium' ? 'warning' : 'success'}
                    variant="flat"
                    size="sm"
                    classNames={{
                      base: `bubble-chip ${
                        utxo.riskLevel === 'High'
                          ? 'bubble-chip-danger'
                          : utxo.riskLevel === 'Medium'
                          ? 'bubble-chip-warning'
                          : 'bubble-chip-success'
                      }`
                    }}
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
        <Link
          to="/utxos"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#F8AC28] hover:bg-[#E89C1F] text-sm font-semibold text-white transition-colors"
        >
          <span>View All</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  )
}

