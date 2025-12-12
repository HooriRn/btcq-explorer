import { Card, CardBody, Button } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { useDashboardStore } from '../../stores/dashboardStore'
import { CardSkeleton } from '../common/LoadingSkeleton'
import { MetricCardValue } from '../common/MetricCardValue'
import { Tooltip } from '../common/Tooltip'
import { HIGH_RISK_TYPES } from '../../utils/riskLevel'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

export const MetricsCards = () => {
  const { t } = useTranslation()
  const { metrics, supplyStats, bitcoinPrice, isLoadingMetrics } = useDashboardStore()
  
  const scriptTypeBalances = supplyStats.script_type_balances || {}
  const totalSupply = supplyStats.total_supply_sat || 0

  const fallbackExposedBalance = (() => {
    const riskyTypes = new Set([
      ...HIGH_RISK_TYPES.map(type => type.toLowerCase()),
      'unknown',
      'nonstandard'
    ])
    return Object.entries(scriptTypeBalances).reduce((sum, [type, balance]) => {
      if (riskyTypes.has(type.toLowerCase())) {
        return sum + (balance || 0)
      }
      return sum
    }, 0)
  })()

  const exposedBalance = metrics.exposedBalanceSat ?? fallbackExposedBalance
  
  // Format BTC value for display
  const formatBTC = (satoshi: number) => {
    if (satoshi === 0) return '0'
    const btc = satoshi / 100_000_000
    if (btc >= 1_000_000) {
      return `${(btc / 1_000_000).toFixed(2)}M`
    } else if (btc >= 1_000) {
      return `${(btc / 1_000).toFixed(2)}K`
    } else {
      return btc.toFixed(8)
    }
  }

  // Format USD value for display
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

  // Calculate percentage helper
  const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0
    return (value / total) * 100
  }

  // Calculate address-level rollups
  const totalAddressesIndexed = metrics.addressesIndexed || metrics.addressCount || 0
  const exposedAddresses = metrics.exposedAddressCount ?? 0
  const reusedAddresses = metrics.reusedAddressCount ?? 0
  const exposurePercentage = calculatePercentage(exposedAddresses, totalAddressesIndexed)
  const reusePercentage = calculatePercentage(reusedAddresses, totalAddressesIndexed)

  // Calculate supply percentages
  const exposedBalancePercentage = calculatePercentage(exposedBalance, totalSupply)

  if (isLoadingMetrics && Object.keys(metrics).length === 0) {
    // Show skeletons only on initial load when there's no data
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Address Exposure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Indexed Card */}
        <Card 
          className="border-2 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-shadow"
          classNames={{
            base: "bg-white dark:bg-zinc-900",
            body: "p-6"
          }}
        >
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('metrics.addressesIndexed')}</h3>
                <MetricCardValue 
                  value={totalAddressesIndexed}
                  colorClasses={{
                    default: 'text-blue-600 dark:text-blue-400',
                    highlight: 'text-blue-700 dark:text-blue-300'
                  }}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('metrics.addressesIndexedDesc')}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2h-3V3H9v2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2h-3v2H9v-2H6a2 2 0 01-2-2v-6m16 0H4" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>
        {/* Total Supply Card */}
        <Card 
          className="border-2 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-shadow"
          classNames={{
            base: "bg-white dark:bg-zinc-900",
            body: "p-6"
          }}
        >
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('metrics.totalSupply')}</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatBTC(totalSupply)} BTC
                  </p>
                </div>
                {bitcoinPrice > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatUSD(totalSupply)}
                  </p>
                )}
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exposed Addresses Card */}
        <Card 
          className="border-2 border-red-200 dark:border-red-700 hover:shadow-lg transition-shadow"
          classNames={{
            base: "bg-white dark:bg-zinc-900",
            body: "p-6"
          }}
        >
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('metrics.exposedAddresses')}</h3>
                  <Tooltip
                    content={
                      <div className="space-y-2">
                        <p className="text-xs">
                          {t('metrics.exposedAddressesDesc', { types: HIGH_RISK_TYPES.join(', ') })}
                        </p>
                      </div>
                    }
                    position="top"
                  >
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      className="text-gray-900 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <AiOutlineQuestionCircle className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                </div>
                <MetricCardValue 
                  value={exposedAddresses}
                  colorClasses={{
                    default: 'text-red-600 dark:text-red-400',
                    highlight: 'text-red-700 dark:text-red-300'
                  }}
                />
                {totalAddressesIndexed > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {exposurePercentage.toFixed(2)}% {t('metrics.ofTotal')}
                  </p>
                )}
                {reusedAddresses > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {reusedAddresses.toLocaleString()} {t('metrics.reused')} ({reusePercentage.toFixed(2)}%)
                  </p>
                )}
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full ml-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Exposed Balance Card */}
        <Card 
          className="border-2 border-red-200 dark:border-red-700 hover:shadow-lg transition-shadow"
          classNames={{
            base: "bg-white dark:bg-zinc-900",
            body: "p-6"
          }}
        >
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('metrics.exposedBalance')}</h3>
                  <Tooltip
                    content={
                      <div className="space-y-2">
                        <p className="text-xs">
                          {t('metrics.exposedBalanceDesc')}
                        </p>
                      </div>
                    }
                    position="top"
                  >
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      className="text-gray-900 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <AiOutlineQuestionCircle className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {formatBTC(exposedBalance)} BTC
                  </p>
                </div>
                {bitcoinPrice > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatUSD(exposedBalance)}
                  </p>
                )}
                {totalSupply > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {exposedBalancePercentage.toFixed(2)}% {t('metrics.ofTotal')}
                  </p>
                )}
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full ml-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
