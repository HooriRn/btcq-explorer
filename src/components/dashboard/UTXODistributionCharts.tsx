import { Card, CardBody } from '@heroui/react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useDashboardStore } from '../../stores/dashboardStore'
import { useThemeStore } from '../../stores/themeStore'
import { HIGH_RISK_TYPES, MEDIUM_RISK_TYPES } from '../../utils/riskLevel'

interface ChartData {
  name: string
  value: number
  percentage: number
  riskLevel: 'High' | 'Medium' | 'Low' | 'N/A'
  [key: string]: string | number // Index signature for recharts compatibility
}

export const UTXODistributionCharts = () => {
  const { metrics, supplyStats } = useDashboardStore()
  const { getEffectiveTheme } = useThemeStore()
  const isDark = getEffectiveTheme() === 'dark'
  const scriptTypeCounts = metrics.scriptTypeCounts || {}
  const scriptTypeBalances = supplyStats.script_type_balances || {}
  const totalUtxos = metrics.utxoCount || 0
  const totalSupply = supplyStats.total_supply_sat || 0

  const getRiskLevel = (scriptType: string): 'High' | 'Medium' | 'Low' | 'N/A' => {
    if (scriptType === 'unknown') {
      return 'N/A'
    }
    if (HIGH_RISK_TYPES.includes(scriptType)) {
      return 'High'
    }
    if (MEDIUM_RISK_TYPES.includes(scriptType)) {
      return 'Medium'
    }
    return 'Low'
  }


  // Script types to exclude (case-insensitive)
  const excludedTypes = ['unknown', 'bech32', 'p2ms']
  
  // Prepare count data
  const countData: ChartData[] = Object.entries(scriptTypeCounts)
    .map(([type, count]) => {
      const value = count as number
      const percentage = totalUtxos > 0 ? (value / totalUtxos) * 100 : 0
      return {
        name: type,
        value,
        percentage,
        riskLevel: getRiskLevel(type)
      }
    })
    .filter(item => item.value > 0 && !excludedTypes.includes(item.name.toLowerCase()))
    .sort((a, b) => b.value - a.value)

  // Prepare balance data
  const balanceData: ChartData[] = Object.entries(scriptTypeBalances)
    .map(([type, balance]) => {
      const value = balance as number
      const percentage = totalSupply > 0 ? (value / totalSupply) * 100 : 0
      return {
        name: type,
        value,
        percentage,
        riskLevel: getRiskLevel(type)
      }
    })
    .filter(item => item.value > 0 && !excludedTypes.includes(item.name.toLowerCase()))
    .sort((a, b) => b.value - a.value)

  const formatCount = (value: number) => {
    return value.toLocaleString()
  }

  const formatBalance = (satoshi: number) => {
    if (satoshi === 0) return '0'
    const btc = satoshi / 100_000_000
    if (btc >= 1_000_000) {
      return `${(btc / 1_000_000).toFixed(2)}M BTC`
    } else if (btc >= 1_000) {
      return `${(btc / 1_000).toFixed(2)}K BTC`
    } else {
      return `${btc.toFixed(2)} BTC`
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartData
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Value: {formatCount(data.value)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentage: {data.percentage.toFixed(2)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Risk: <span className={`font-semibold ${
              data.riskLevel === 'High' ? 'text-red-600 dark:text-red-400' :
              data.riskLevel === 'Medium' ? 'text-orange-600 dark:text-orange-400' :
              data.riskLevel === 'Low' ? 'text-green-600 dark:text-green-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>{data.riskLevel}</span>
          </p>
        </div>
      )
    }
    return null
  }

  const CustomTooltipBalance = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartData
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Balance: {formatBalance(data.value)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentage: {data.percentage.toFixed(2)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Risk: <span className={`font-semibold ${
              data.riskLevel === 'High' ? 'text-red-600 dark:text-red-400' :
              data.riskLevel === 'Medium' ? 'text-orange-600 dark:text-orange-400' :
              data.riskLevel === 'Low' ? 'text-green-600 dark:text-green-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>{data.riskLevel}</span>
          </p>
        </div>
      )
    }
    return null
  }

  const RADIAN = Math.PI / 180;

  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, name, percent } = props
    
    // Only show labels for segments larger than 3% to avoid cluttering
    if (percent < 0.03) {
      return null
    }
    
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill={isDark ? "#e5e7eb" : "#333"} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={14}
        fontWeight="500"
      >
        {name}
      </text>
    );
  }
  

  if (countData.length === 0 && balanceData.length === 0) {
    return null
  }

  // Vibrant color palette
  const COLORS = [
    '#3b82f6',     // Blue
    '#8b5cf6',     // Purple
    '#ec4899',     // Pink
    '#14b8a6',     // Teal
    '#f59e0b',     // Amber
    '#10b981',     // Emerald
    '#ef4444',     // Red
    '#06b6d4',     // Cyan
    '#f97316',     // Orange
    '#6366f1',     // Indigo
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">UTXO Types Distribution</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Count Distribution Chart */}
        {countData.length > 0 && (
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Distribution by Count
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart margin={{ bottom: 0, top: 10, left: 0, right: 0 }}>
                  <Pie
                    data={countData}
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    paddingAngle={0}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                    stroke={isDark ? "#1f2937" : "#ffffff"}
                    strokeWidth={1}
                  >
                    <defs>
                      {countData.map((entry, index) => {
                        if (entry.riskLevel === 'High') {
                          const baseColor = COLORS[index % COLORS.length]
                          return (
                            <pattern
                              key={`pattern-${index}`}
                              id={`stripes-${index}`}
                              patternUnits="userSpaceOnUse"
                              width="8"
                              height="8"
                            >
                              <rect width="8" height="8" fill={baseColor} />
                              <circle cx="4" cy="4" r="1.5" fill={isDark ? "#ffffff" : "#000000"} opacity={isDark ? "0.3" : "0.4"} />
                            </pattern>
                          )
                        }
                        return null
                      })}
                    </defs>
                    {countData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.riskLevel === 'High' ? `url(#stripes-${index})` : COLORS[index % COLORS.length]}
                        stroke={isDark ? "#1f2937" : "#ffffff"}
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ 
                      fontSize: '12px', 
                      paddingTop: '40px',
                      color: isDark ? '#e5e7eb' : '#1f2937'
                    }}
                    formatter={(value: string, entry: any) => {
                      const data = entry.payload as ChartData
                      return `${value} (${data.percentage.toFixed(1)}%)`
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}

        {/* Balance Distribution Chart */}
        {balanceData.length > 0 && (
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Distribution by Balance
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart margin={{ bottom: 0, top: 10, left: 0, right: 0 }}>
                  <Pie
                    data={balanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    paddingAngle={0}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                    stroke={isDark ? "#1f2937" : "#ffffff"}
                    strokeWidth={1}
                  >
                    <defs>
                      {balanceData.map((entry, index) => {
                        if (entry.riskLevel === 'High') {
                          const baseColor = COLORS[index % COLORS.length]
                          return (
                            <pattern
                              key={`pattern-balance-${index}`}
                              id={`stripes-balance-${index}`}
                              patternUnits="userSpaceOnUse"
                              width="8"
                              height="8"
                            >
                              <rect width="8" height="8" fill={baseColor} />
                              <circle cx="4" cy="4" r="1.5" fill={isDark ? "#ffffff" : "#000000"} opacity={isDark ? "0.3" : "0.4"} />
                            </pattern>
                          )
                        }
                        return null
                      })}
                    </defs>
                    {balanceData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.riskLevel === 'High' ? `url(#stripes-balance-${index})` : COLORS[index % COLORS.length]}
                        stroke={isDark ? "#1f2937" : "#ffffff"}
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltipBalance />} />
                  <Legend
                    wrapperStyle={{ 
                      fontSize: '12px', 
                      paddingTop: '40px',
                      color: isDark ? '#e5e7eb' : '#1f2937'
                    }}
                    formatter={(value: string, entry: any) => {
                      const data = entry.payload as ChartData
                      return `${value} (${data.percentage.toFixed(1)}%)`
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}

