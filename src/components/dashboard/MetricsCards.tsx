import { useTranslation } from 'react-i18next'
import { useDashboardStore } from '../../stores/dashboardStore'
import { CardSkeleton } from '../common/LoadingSkeleton'
import { HIGH_RISK_TYPES } from '../../utils/riskLevel'

// Etherscan-style outline icons (light gray/white)
const IconBTC = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const IconGlobe = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
)
const IconUsers = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
)
const IconExposedAddresses = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12,21c-6.193,0-9.721-4.082-11.271-6.515-.978-1.533-.978-3.438,0-4.971C2.28,7.081,5.81,3,12,3s9.72,4.081,11.271,6.514c.978,1.535,.978,3.439,0,4.972-1.551,2.433-5.078,6.515-11.271,6.515Zm0-16c-5.236,0-8.254,3.502-9.586,5.59-.554,.87-.554,1.95,0,2.819,1.332,2.088,4.347,5.591,9.586,5.591s8.254-3.503,9.586-5.591c.554-.869,.554-1.95,0-2.82-1.331-2.087-4.349-5.589-9.585-5.589Zm0,2c-2.757,0-5,2.243-5,5s2.243,5,5,5,5-2.243,5-5-2.243-5-5-5Zm0,9h0c-.552,0-1-.448-1-1h0c0-.552,.448-1,1-1h0c.552,0,1,.448,1,1h0c0,.552-.448,1-1,1Zm0-3h0c-.552,0-1-.448-1-1v-3c0-.552,.448-1,1-1h0c.552,0,1,.448,1,1v3c0,.552-.448,1-1,1Z" />
  </svg>
)
const IconExposedBalance = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M23.938,10.654l-3.071-8.335c-.423-1.151-1.634-1.781-2.824-1.465l-5.043,1.345V1c0-.552-.448-1-1-1s-1,.448-1,1v1.732l-5.254,1.401c-1.255,.335-2.273,1.263-2.723,2.482L.062,14.654c-.041,.111-.062,.647-.062,.647,0,2.506,2,4.698,4.503,4.698,1.158,0,2.249-.434,3.094-1.236,.891-.846,1.402-2.036,1.402-3.264,0,0-.021-.732-.06-.842L5.87,6.216c.124-.063,.255-.114,.392-.15l4.738-1.264V22H5c-.552,0-1,.448-1,1s.448,1,1,1h14c.552,0,1-.448,1-1s-.448-1-1-1h-6V4.268l4.896-1.306-2.834,7.691c-.041,.111-.062,.647-.062,.647,0,2.506,1.871,4.567,4.26,4.692,1.249,.066,2.434-.371,3.338-1.229,.891-.846,1.402-2.036,1.402-3.264,0,0-.021-.735-.062-.846ZM4.364,17.997c-1.081-.057-1.986-.902-2.266-1.997H6.95c-.1,.499-.35,.954-.729,1.313-.502,.478-1.165,.725-1.856,.683Zm2.208-3.997H2.434l2.083-5.653,2.056,5.653ZM19.5,4.393l2.066,5.607h-4.132l2.066-5.607Zm-.136,9.604c-1.081-.057-1.986-.902-2.266-1.997h4.851c-.1,.499-.35,.954-.729,1.313-.502,.478-1.165,.719-1.856,.683Z" />
  </svg>
)
const IconCube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const MetricRow = ({
  icon: Icon,
  label,
  value,
  subValue,
  valueRed,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
  subValue?: React.ReactNode
  valueRed?: boolean
}) => (
  <div className="flex items-center gap-3 py-4 border-b border-gray-200 dark:border-zinc-700 last:border-b-0">
    <Icon className="w-6 h-6 shrink-0 text-gray-400 dark:text-gray-500 flex-shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-lg font-bold mt-0.5 break-all ${valueRed ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </p>
      {subValue && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">{subValue}</p>
      )}
    </div>
  </div>
)

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

  const formatBTC = (satoshi: number) => {
    if (satoshi === 0) return '0'
    const btc = satoshi / 100_000_000
    if (btc >= 1_000_000) return `${(btc / 1_000_000).toFixed(2)}M`
    if (btc >= 1_000) return `${(btc / 1_000).toFixed(2)}K`
    return btc.toFixed(8)
  }

  const formatUSD = (satoshi: number) => {
    if (satoshi === 0 || bitcoinPrice === 0) return '$0'
    const btc = satoshi / 100_000_000
    const usd = btc * bitcoinPrice
    if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(2)}B`
    if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`
    if (usd >= 1_000) return `$${(usd / 1_000).toFixed(2)}K`
    return `$${usd.toFixed(2)}`
  }

  const totalAddressesIndexed = metrics.addressesIndexed || metrics.addressCount || 0
  const exposedAddresses = metrics.exposedAddressCount ?? 0
  const exposurePercentage = totalAddressesIndexed > 0 ? (exposedAddresses / totalAddressesIndexed) * 100 : 0
  const exposedBalancePercentage = totalSupply > 0 ? (exposedBalance / totalSupply) * 100 : 0
  const lastBlockHeight = metrics.currentBitcoinHeight ?? metrics.latestBlock?.height ?? 0

  if (isLoadingMetrics && Object.keys(metrics).length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="p-5 md:p-6">
          <CardSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div
      id="ContentPlaceHolder1_mainboxes"
      className="card rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden py-5 px-4 md:px-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
        {/* Left column */}
        <div className="flex flex-col md:pr-8 md:border-r md:border-gray-200 dark:md:border-zinc-700">
          <MetricRow
            icon={IconBTC}
            label="BTC PRICE"
            value={bitcoinPrice > 0 ? `$${bitcoinPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
          />
          <MetricRow
            icon={IconGlobe}
            label={t('metrics.totalSupply')}
            value={`${formatBTC(totalSupply)} BTC`}
            subValue={bitcoinPrice > 0 ? formatUSD(totalSupply) : undefined}
          />
          <MetricRow
            icon={IconUsers}
            label={t('metrics.addressesIndexed')}
            value={totalAddressesIndexed.toLocaleString()}
          />
        </div>
        {/* Right column: top border on mobile for separator between columns when stacked */}
        <div className="flex flex-col border-t border-gray-200 dark:border-zinc-700 md:border-t-0">
          <MetricRow
            icon={IconExposedAddresses}
            label={t('metrics.exposedAddresses')}
            value={exposedAddresses.toLocaleString()}
            subValue={totalAddressesIndexed > 0 ? `${exposurePercentage.toFixed(2)}% ${t('metrics.ofTotal')}` : undefined}
          />
          <MetricRow
            icon={IconExposedBalance}
            label={t('metrics.exposedBalance')}
            value={`${formatBTC(exposedBalance)} BTC`}
            subValue={totalSupply > 0 ? `${exposedBalancePercentage.toFixed(2)}% ${t('metrics.ofTotal')} · ${formatUSD(exposedBalance)}` : formatUSD(exposedBalance)}
          />
          <MetricRow
            icon={IconCube}
            label="LAST BLOCK"
            value={lastBlockHeight > 0 ? lastBlockHeight.toLocaleString() : '—'}
          />
        </div>
      </div>
    </div>
  )
}
