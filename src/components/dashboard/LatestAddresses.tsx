import { Button, Spinner, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { useDashboardStore } from '../../stores/dashboardStore'
import { TableSkeleton } from '../common/LoadingSkeleton'
import { calculateUTXORiskLevel } from '../../utils/riskLevel'
import { CopyButton } from '../common/CopyButton'

export const LatestAddresses = () => {
  const { t } = useTranslation()
  const { latestAddresses, isLoading, lastUpdated, fetchLatestAddresses } = useDashboardStore()

  // Only show skeleton on initial load when there's no data
  if (isLoading && latestAddresses.length === 0) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('latest.latestAddresses')}</h2>
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

  const formatTimestamp = (timestamp: string | number | undefined) => {
    try {
      if (!timestamp || timestamp === '0' || timestamp === 0 || timestamp === '') {
        return 'N/A'
      }
      // Handle string timestamps (nanoseconds)
      const timestampStr = typeof timestamp === 'string' ? timestamp : String(timestamp)
      if (!timestampStr || timestampStr.trim() === '') {
        return 'N/A'
      }
      const timestampNum = BigInt(timestampStr)
      // Convert nanoseconds to milliseconds
      const milliseconds = Number(timestampNum / BigInt(1_000_000))
      return new Date(milliseconds).toLocaleString()
    } catch {
      return 'N/A'
    }
  }

  const formatAddress = (address: string, maxLength: number = 20) => {
    if (!address) return ''
    if (address.length <= maxLength) return address
    return `${address.slice(0, maxLength - 3)}...`
  }

  // Calculate risk levels for all addresses
  const addressesWithRisk = latestAddresses.map(address => {
    const riskLevel = calculateUTXORiskLevel(address.script_pub_type || 'unknown', address.reused || false)
    return { ...address, riskLevel }
  })

  // Debug: Log addresses data
  if (addressesWithRisk.length > 0) {
    console.log('Addresses data sample:', addressesWithRisk[0])
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Addresses</h2>
        <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
            {t('header.lastUpdated')} {lastUpdated || t('header.never')}
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
      
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table 
            aria-label="Latest addresses table" 
            removeWrapper
            classNames={{
              wrapper: "bg-white dark:bg-zinc-900 min-w-full",
              th: "bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-300 whitespace-nowrap",
              tr: "border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50",
              td: "bg-white dark:bg-zinc-900 whitespace-nowrap",
              thead: "[&>tr]:first:rounded-b-none [&>tr>th]:first:rounded-bl-none [&>tr>th]:last:rounded-br-none"
            }}
          >
          <TableHeader>
            <TableColumn>{t('tables.address')}</TableColumn>
            <TableColumn>{t('tables.balanceBtc')}</TableColumn>
            <TableColumn>{t('tables.type')}</TableColumn>
            <TableColumn>{t('tables.reused')}</TableColumn>
            <TableColumn>{t('tables.risk')}</TableColumn>
            <TableColumn>{t('tables.createdBlock')}</TableColumn>
          </TableHeader>
          <TableBody emptyContent={t('tables.noAddressesFound')}>
            {addressesWithRisk.map((address, index) => (
              <TableRow key={`${address.address}-${index}`}>
                <TableCell>
                  <div className="flex items-center space-x-2 min-w-0">
                    <a 
                      href={`https://mempool.space/address/${address.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors truncate max-w-[200px]"
                      title={address.address}
                    >
                      {formatAddress(address.address, 20)}
                    </a>
                    <CopyButton text={address.address} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {formatValue(address.balance_sat ?? 0)}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip color="primary" variant="flat" size="sm">
                    {address.script_pub_type || t('common.unknown')}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    color={address.reused ? 'warning' : 'success'}
                    variant="flat"
                    size="sm"
                  >
                    {address.reused ? t('searchResults.reused') : t('searchResults.notReused')}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    color={address.riskLevel === 'High' ? 'danger' : address.riskLevel === 'Medium' ? 'warning' : 'success'}
                    variant="flat"
                    size="sm"
                  >
                    {address.riskLevel === 'High' ? t('searchResults.highRisk') : address.riskLevel === 'Medium' ? t('searchResults.mediumRisk') : t('searchResults.lowRisk')}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{(address.created_block ?? 0).toLocaleString()}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(address.created_block_timestamp)}
                    </span>
                  </div>
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

