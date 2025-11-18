import { Card, CardBody, Button } from '@heroui/react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { CardSkeleton } from '../common/LoadingSkeleton'
import { MetricCardValue } from '../common/MetricCardValue'
import { Tooltip } from '../common/Tooltip'
import { HIGH_RISK_TYPES, MEDIUM_RISK_TYPES } from '../../utils/riskLevel'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

export const MetricsCards = () => {
  const { metrics, supplyStats, bitcoinPrice, isLoadingMetrics } = useDashboardStore()
  
  // Calculate high risk and medium risk balances
  const scriptTypeBalances = supplyStats.script_type_balances || {}
  const totalSupply = supplyStats.total_supply_sat || 0
  
  let highRiskBalance = 0
  HIGH_RISK_TYPES.forEach(scriptType => {
    highRiskBalance += scriptTypeBalances[scriptType] || 0
  })
  // Also include 'unknown' as high risk
  highRiskBalance += scriptTypeBalances['unknown'] || 0
  
  let mediumRiskBalance = 0
  MEDIUM_RISK_TYPES.forEach(scriptType => {
    mediumRiskBalance += scriptTypeBalances[scriptType] || 0
  })
  
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

  if (isLoadingMetrics && Object.keys(metrics).length === 0) {
    // Show skeletons only on initial load when there's no data
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* UTXO Count Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* UTXO Count Card */}
      <Card 
        className="border-2 border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow"
        classNames={{
          base: "bg-white dark:bg-gray-800",
          body: "p-6"
        }}
      >
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Indexed UTXO</h3>
              <MetricCardValue 
                value={metrics.utxoCount || 0}
                colorClasses={{
                  default: 'text-green-600 dark:text-green-400',
                  highlight: 'text-green-700 dark:text-green-300'
                }}
              />
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* High Risk Addresses Card */}
      <Card 
        className="border-2 border-red-200 dark:border-red-700 hover:shadow-lg transition-shadow"
        classNames={{
          base: "bg-white dark:bg-gray-800",
          body: "p-6"
        }}
      >
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">High Risk UTXO</h3>
                <Tooltip
                  content={
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold mb-1">Types:</p>
                        <p className="text-xs">{HIGH_RISK_TYPES.join(', ')}</p>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Why at risk:</p>
                        <p className="text-xs">
                          Exposes public keys directly. Vulnerable to quantum computers that can derive private keys from public keys.
                        </p>
                      </div>
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
                value={metrics.highRiskAddressCount || 0}
                colorClasses={{
                  default: 'text-red-600 dark:text-red-400',
                  highlight: 'text-red-700 dark:text-red-300'
                }}
              />
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full ml-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Medium Risk Addresses Card */}
      <Card 
        className="border-2 border-orange-200 dark:border-orange-700 hover:shadow-lg transition-shadow"
        classNames={{
          base: "bg-white dark:bg-gray-800",
          body: "p-6"
        }}
      >
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Medium Risk UTXO</h3>
                <Tooltip
                  content={
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold mb-1">Types:</p>
                        <p className="text-xs">{MEDIUM_RISK_TYPES.join(', ')}</p>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Why at risk:</p>
                        <p className="text-xs">
                          Uses hashed public keys. Vulnerable when addresses are reused, exposing public keys through transactions.
                        </p>
                      </div>
                    </div>
                  }
                  position="top"
                >
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    className="text-gray-900 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                  >
                    <AiOutlineQuestionCircle className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </div>
              <MetricCardValue 
                value={metrics.mediumRiskAddressCount || 0}
                colorClasses={{
                  default: 'text-orange-600 dark:text-orange-400',
                  highlight: 'text-orange-700 dark:text-orange-300'
                }}
              />
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full ml-4">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </CardBody>
      </Card>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Supply Card */}
        <Card 
          className="border-2 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-shadow"
          classNames={{
            base: "bg-white dark:bg-gray-800",
            body: "p-6"
          }}
        >
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Total Supply</h3>
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

        {/* High Risk Balance Card */}
        <Card 
          className="border-2 border-red-200 dark:border-red-700 hover:shadow-lg transition-shadow"
          classNames={{
            base: "bg-white dark:bg-gray-800",
            body: "p-6"
          }}
        >
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">High Risk Balance</h3>
                  <Tooltip
                    content={
                      <div className="space-y-2">
                        <div>
                          <p className="font-semibold mb-1">Types:</p>
                          <p className="text-xs">{HIGH_RISK_TYPES.join(', ')}, unknown</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Why at risk:</p>
                          <p className="text-xs">
                            Exposes public keys directly. Vulnerable to quantum computers that can derive private keys from public keys.
                          </p>
                        </div>
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
                    {formatBTC(highRiskBalance)} BTC
                  </p>
                </div>
                {bitcoinPrice > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatUSD(highRiskBalance)}
                  </p>
                )}
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full ml-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Medium Risk Balance Card */}
        <Card 
          className="border-2 border-orange-200 dark:border-orange-700 hover:shadow-lg transition-shadow"
          classNames={{
            base: "bg-white dark:bg-gray-800",
            body: "p-6"
          }}
        >
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Medium Risk Balance</h3>
                  <Tooltip
                    content={
                      <div className="space-y-2">
                        <div>
                          <p className="font-semibold mb-1">Types:</p>
                          <p className="text-xs">{MEDIUM_RISK_TYPES.join(', ')}</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Why at risk:</p>
                          <p className="text-xs">
                            Uses hashed public keys. Vulnerable when addresses are reused, exposing public keys through transactions.
                          </p>
                        </div>
                      </div>
                    }
                    position="top"
                  >
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      className="text-gray-900 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                    >
                      <AiOutlineQuestionCircle className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {formatBTC(mediumRiskBalance)} BTC
                  </p>
                </div>
                {bitcoinPrice > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatUSD(mediumRiskBalance)}
                  </p>
                )}
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full ml-4">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
