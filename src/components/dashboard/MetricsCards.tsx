import { Card, CardBody, Button } from '@heroui/react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { CardSkeleton } from '../common/LoadingSkeleton'
import { MetricCardValue } from '../common/MetricCardValue'
import { Tooltip } from '../common/Tooltip'
import { HIGH_RISK_TYPES, MEDIUM_RISK_TYPES } from '../../utils/riskLevel'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

export const MetricsCards = () => {
  const { metrics, isLoadingMetrics } = useDashboardStore()

  if (isLoadingMetrics && Object.keys(metrics).length === 0) {
    // Show skeletons only on initial load when there's no data
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Address Count Card */}
      <Card 
        className="border-2 border-purple-200 dark:border-purple-700 hover:shadow-lg transition-shadow"
        classNames={{
          base: "bg-white dark:bg-gray-800",
          body: "p-6"
        }}
      >
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Addresses</h3>
              <MetricCardValue 
                value={metrics.addressCount || 0}
                colorClasses={{
                  default: 'text-purple-600 dark:text-purple-400',
                  highlight: 'text-purple-700 dark:text-purple-300'
                }}
              />
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </div>
          </div>
        </CardBody>
      </Card>

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
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">UTXOs</h3>
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
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">High Risk</h3>
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
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Medium Risk</h3>
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
  )
}
