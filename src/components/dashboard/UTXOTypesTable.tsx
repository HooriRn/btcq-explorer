import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { useDashboardStore } from '../../stores/dashboardStore'

type ExposureCategory = 'bad_type' | 'reuse' | 'none'

const EXPOSURE_COLORS: Record<ExposureCategory, 'danger' | 'warning' | 'success'> = {
  bad_type: 'danger',
  reuse: 'warning',
  none: 'success'
}

export const UTXOTypesTable = () => {
  const { t } = useTranslation()
  const { metrics, bitcoinPrice } = useDashboardStore()
  const scriptTypeStats = metrics.scriptTypeExposureStats || []
  const excludedTypes = new Set(['unknown', 'op_return', 'nonstandard', 'bech32'])
  const filteredStats = scriptTypeStats.filter(
    stat => !excludedTypes.has((stat.scriptType || '').toLowerCase())
  )

  const EXPOSURE_LABELS: Record<ExposureCategory, string> = {
    bad_type: t('charts.exposedBadType'),
    reuse: t('charts.exposedReuse'),
    none: t('charts.notExposed')
  }

  if (filteredStats.length === 0) {
    return null
  }

  const totalAddresses = filteredStats.reduce((sum, stat) => sum + stat.totalCount, 0)
  const totalBalance = filteredStats.reduce((sum, stat) => sum + stat.totalSat, 0)
  const sortedStats = [...filteredStats].sort((a, b) => b.totalCount - a.totalCount)

  const formatCount = (count: number) => {
    if (count === 0) {
      return t('common.na')
    }
    return count.toLocaleString()
  }

  const formatBalance = (satoshi: number) => {
    if (satoshi === 0) return '0'
    const btc = satoshi / 100_000_000
    if (btc >= 1_000_000) {
      return `${(btc / 1_000_000).toFixed(2)}M BTC`
    } else if (btc >= 1_000) {
      return `${(btc / 1_000).toFixed(2)}K BTC`
    } else {
      return `${btc.toFixed(8)} BTC`
    }
  }

  const formatUSD = (satoshi: number) => {
    if (satoshi === 0 || bitcoinPrice === 0) return '$0'
    const btc = satoshi / 100_000_000
    const usd = btc * bitcoinPrice
    if (usd >= 1_000_000_000) {
      return `$${(usd / 1_000_000_000).toFixed(2)}B`
    } else if (usd >= 1_000_000) {
      return `$${(usd / 1_000_000).toFixed(2)}M`
    } else if (usd >= 1_000) {
      return `$${(usd / 1_000).toFixed(2)}K`
    } else {
      return `$${usd.toFixed(2)}`
    }
  }

  const calculatePercentage = (value: number, total: number) => {
    if (value === 0 || total === 0) {
      return t('common.na')
    }
    return ((value / total) * 100).toFixed(2)
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        {totalBalance > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Tracked Balance: </span>
            <span className="font-mono">{formatBalance(totalBalance)}</span>
            {bitcoinPrice > 0 && (
              <span className="ml-2">• {formatUSD(totalBalance)}</span>
            )}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            aria-label="UTXO types table"
            removeWrapper
            classNames={{
              wrapper: 'bg-white dark:bg-gray-800 min-w-full',
              th: 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 whitespace-nowrap',
              tr: 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50',
              td: 'bg-white dark:bg-gray-800 whitespace-nowrap',
              thead: '[&>tr]:first:rounded-b-none [&>tr>th]:first:rounded-bl-none [&>tr>th]:last:rounded-br-none'
            }}
          >
            <TableHeader>
              <TableColumn>{t('tables.scriptType')}</TableColumn>
              <TableColumn>{t('tables.totalAddresses')}</TableColumn>
              <TableColumn>{t('tables.exposedCount')}</TableColumn>
              <TableColumn>{t('tables.safeCount')}</TableColumn>
              <TableColumn>{t('tables.totalBalance')}</TableColumn>
              <TableColumn>{t('tables.exposedBalance')}</TableColumn>
              <TableColumn>{t('searchResults.status')}</TableColumn>
            </TableHeader>
            <TableBody emptyContent={t('tables.noAddressesFound')}>
              {sortedStats.map(stat => {
                const exposureLabel = EXPOSURE_LABELS[stat.exposureCategory]
                const exposureColor = EXPOSURE_COLORS[stat.exposureCategory]
                const scriptTypeShare = calculatePercentage(stat.totalCount, totalAddresses)
                const exposedShareOfType = calculatePercentage(stat.exposedCount, stat.totalCount)
                const safeShareOfType = calculatePercentage(stat.safeCount, stat.totalCount)
                const exposedBalanceShare = calculatePercentage(stat.exposedSat, stat.totalSat)
                const safeBalanceShare = calculatePercentage(stat.safeSat, stat.totalSat)

                return (
                  <TableRow key={stat.scriptType}>
                    <TableCell>
                      <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                        {stat.scriptType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {formatCount(stat.totalCount)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {scriptTypeShare === 'N/A' ? '0.00' : scriptTypeShare}% of all addresses
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                          {formatCount(stat.exposedCount)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {exposedShareOfType === 'N/A' ? '0.00' : exposedShareOfType}% of this type
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCount(stat.safeCount)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {safeShareOfType === 'N/A' ? '0.00' : safeShareOfType}% of this type
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {formatBalance(stat.totalSat)}
                        </span>
                        {bitcoinPrice > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatUSD(stat.totalSat)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                          {formatBalance(stat.exposedSat)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {exposedBalanceShare === 'N/A' ? '0.00' : exposedBalanceShare}% of this type&apos;s balance
                        </span>
                        {stat.safeSat > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Safe: {formatBalance(stat.safeSat)} ({safeBalanceShare === 'N/A' ? '0.00' : safeBalanceShare}%)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip color={exposureColor} variant="flat" size="sm">
                        {exposureLabel}
                      </Chip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

