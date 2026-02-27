import { Link } from 'react-router-dom'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { useDashboardStore } from '../../stores/dashboardStore'
import { TableSkeleton } from '../common/LoadingSkeleton'
import { calculateUTXORiskLevel } from '../../utils/riskLevel'
import { CopyButton } from '../common/CopyButton'

export const LatestAddressesPreview = () => {
  const { t } = useTranslation()
  const { latestAddresses, isLoading } = useDashboardStore()

  // Only show skeleton on initial load when there's no data
  if (isLoading && latestAddresses.length === 0) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('latest.latestAddresses')}</h2>
          <Link 
            to="/addresses"
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
  const addressesWithRisk = latestAddresses
    .slice(0, 5)
    .map(address => {
      const riskLevel = calculateUTXORiskLevel(address.script_pub_type, address.reused || false)
      return { ...address, riskLevel }
    })

  return (
    <div className="mt-12">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Addresses</h2>
          <Link 
            to="/addresses"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table 
            aria-label="Latest addresses preview table" 
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
                    {formatValue(address.balance_sat)}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip color="primary" variant="flat" size="sm">
                    {address.script_pub_type}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  )
}

