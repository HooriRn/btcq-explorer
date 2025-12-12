import { useState, useEffect } from 'react'
import { Card, CardBody } from '@heroui/react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useDashboardStore } from '../../stores/dashboardStore'
import { useThemeStore } from '../../stores/themeStore'

type ExposureCategory = 'bad_type' | 'reuse' | 'none'

interface ChartData {
  name: string
  value: number
  percentage: number
  exposureCategory: ExposureCategory
  exposureLabel: string
  [key: string]: string | number
}

const EXPOSURE_LABELS: Record<ExposureCategory, string> = {
  bad_type: 'Bad Script Type',
  reuse: 'Address Reuse',
  none: 'Not Exposed'
}

const getExposureTextColor = (category: ExposureCategory) => {
  switch (category) {
    case 'bad_type':
      return 'text-red-600 dark:text-red-400'
    case 'reuse':
      return 'text-orange-600 dark:text-orange-400'
    case 'none':
    default:
      return 'text-emerald-600 dark:text-emerald-400'
  }
}

export const UTXODistributionCharts = () => {
  const { metrics } = useDashboardStore()
  const { getEffectiveTheme } = useThemeStore()
  const isDark = getEffectiveTheme() === 'dark'
  const scriptTypeStats = metrics.scriptTypeExposureStats || []
  
  // Detect mobile/tablet screen size
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      // Check for touch device or small screen
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth < 1024 // lg breakpoint
      setIsMobile(isTouchDevice || isSmallScreen)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (scriptTypeStats.length === 0) {
    return null
  }

  const totalExposedAddresses = scriptTypeStats.reduce((sum, stat) => sum + stat.exposedCount, 0)
  const totalExposedBalance = scriptTypeStats.reduce((sum, stat) => sum + stat.exposedSat, 0)

  const countData: ChartData[] = scriptTypeStats
    .filter(stat => stat.exposedCount > 0)
    .map(stat => ({
      name: stat.scriptType,
      value: stat.exposedCount,
      percentage: totalExposedAddresses > 0 ? (stat.exposedCount / totalExposedAddresses) * 100 : 0,
      exposureCategory: stat.exposureCategory,
      exposureLabel: EXPOSURE_LABELS[stat.exposureCategory]
    }))
    .sort((a, b) => b.value - a.value)

  const balanceData: ChartData[] = scriptTypeStats
    .filter(stat => stat.exposedSat > 0)
    .map(stat => ({
      name: stat.scriptType,
      value: stat.exposedSat,
      percentage: totalExposedBalance > 0 ? (stat.exposedSat / totalExposedBalance) * 100 : 0,
      exposureCategory: stat.exposureCategory,
      exposureLabel: EXPOSURE_LABELS[stat.exposureCategory]
    }))
    .sort((a, b) => b.value - a.value)

  const formatCount = (value: number) => {
    if (value === 0) {
      return 'N/A'
    }
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
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 max-w-xs pointer-events-auto touch-none">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Share of exposed addresses: {data.percentage.toFixed(2)}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Exposed addresses: {formatCount(data.value)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cause:{' '}
            <span className={`font-semibold ${getExposureTextColor(data.exposureCategory)}`}>
              {data.exposureLabel}
            </span>
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
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 max-w-xs pointer-events-auto touch-none">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Share of exposed balance: {data.percentage.toFixed(2)}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Exposed balance: {formatBalance(data.value)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cause:{' '}
            <span className={`font-semibold ${getExposureTextColor(data.exposureCategory)}`}>
              {data.exposureLabel}
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  const RADIAN = Math.PI / 180;

  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, name, percent } = props
    
    // Hide labels on mobile/tablet to prevent clutter and overlap issues
    // Users can use the legend and tooltips instead
    if (isMobile) {
      return null
    }
    
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
        fill={isDark ? "#e5e7eb" : "#000000"} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={14}
        fontWeight="500"
      >
        {name}
      </text>
    );
  }
  
  const renderLabelLine = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent } = props
    
    // Hide label lines on mobile
    if (isMobile) {
      return <g />
    }
    
    if (percent < 0.03) {
      return <g />
    }

    const radius = outerRadius * 1.05
    const x1 = cx + radius * Math.cos(-midAngle * RADIAN)
    const y1 = cy + radius * Math.sin(-midAngle * RADIAN)
    const x2 = cx + (outerRadius + 24) * Math.cos(-midAngle * RADIAN)
    const y2 = cy + (outerRadius + 24) * Math.sin(-midAngle * RADIAN)

    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isDark ? '#4b5563' : '#9ca3af'}
        strokeWidth={1}
      />
    )
  }


  if (countData.length === 0 && balanceData.length === 0) {
    return null
  }

  const COLORS = [
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
    '#f59e0b',
    '#10b981',
    '#ef4444',
    '#06b6d4',
    '#f97316',
    '#6366f1'
  ]

  const renderPatternDefs = (
    data: ChartData[],
    prefix: string
  ) => (
    <defs>
      {data.map((entry, index) => {
        const baseColor = COLORS[index % COLORS.length]
        if (entry.exposureCategory === 'bad_type') {
          return (
            <pattern
              key={`${prefix}-dots-${index}`}
              id={`${prefix}-dots-${index}`}
              patternUnits="userSpaceOnUse"
              width={8}
              height={8}
            >
              <rect width="8" height="8" fill={baseColor} />
              <circle cx="4" cy="4" r="1.5" fill={isDark ? '#ffffff' : '#000000'} opacity={isDark ? 0.3 : 0.4} />
            </pattern>
          )
        }
        if (entry.exposureCategory === 'reuse') {
          return (
            <pattern
              key={`${prefix}-stripes-${index}`}
              id={`${prefix}-stripes-${index}`}
              patternUnits="userSpaceOnUse"
              width={8}
              height={8}
              patternTransform="rotate(45)"
            >
              <rect width="8" height="8" fill={baseColor} />
              <rect width="4" height="8" fill={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} />
            </pattern>
          )
        }
        return null
      })}
    </defs>
  )

  const getFillForEntry = (entry: ChartData, index: number, prefix: string) => {
    const baseColor = COLORS[index % COLORS.length]
    if (entry.exposureCategory === 'bad_type') {
      return `url(#${prefix}-dots-${index})`
    }
    if (entry.exposureCategory === 'reuse') {
      return `url(#${prefix}-stripes-${index})`
    }
    return baseColor
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Exposed Metrics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Count Distribution Chart */}
        {countData.length > 0 && (
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Distribution by Count
              </h3>
              <ResponsiveContainer width="100%" height={isMobile ? 400 : 500}>
                <PieChart margin={{ bottom: 0, top: 0, left: 0, right: 0 }}>
                  <Pie
                    data={countData}
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 100 : 140}
                    paddingAngle={0}
                    dataKey="value"
                    labelLine={renderLabelLine}
                    label={renderCustomLabel}
                    stroke={isDark ? "#1f2937" : "#ffffff"}
                    strokeWidth={1}
                  >
                    {renderPatternDefs(countData, 'count')}
                    {countData.map((entry, index) => (
                      <Cell
                        key={`cell-count-${index}`}
                        fill={getFillForEntry(entry, index, 'count')}
                        stroke={isDark ? '#1f2937' : '#ffffff'}
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<CustomTooltip />}
                    allowEscapeViewBox={{ x: false, y: false }}
                  />
                  <Legend
                    wrapperStyle={{ 
                      fontSize: isMobile ? '11px' : '12px', 
                      paddingTop: isMobile ? '20px' : '40px',
                      color: isDark ? '#e5e7eb' : '#1f2937'
                    }}
                    formatter={(value: string, entry: any) => {
                      const data = entry.payload as ChartData
                      return `${value} (${data.percentage.toFixed(1)}%) • ${data.exposureLabel}`
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
              <ResponsiveContainer width="100%" height={isMobile ? 400 : 500}>
                <PieChart margin={{ bottom: 0, top: 10, left: 0, right: 0 }}>
                  <Pie
                    data={balanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 100 : 140}
                    paddingAngle={0}
                    dataKey="value"
                    labelLine={renderLabelLine}
                    label={renderCustomLabel}
                    stroke={isDark ? "#1f2937" : "#ffffff"}
                    strokeWidth={1}
                  >
                    {renderPatternDefs(balanceData, 'balance')}
                    {balanceData.map((entry, index) => (
                      <Cell
                        key={`cell-balance-${index}`}
                        fill={getFillForEntry(entry, index, 'balance')}
                        stroke={isDark ? '#1f2937' : '#ffffff'}
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<CustomTooltipBalance />}
                    allowEscapeViewBox={{ x: false, y: false }}
                  />
                  <Legend
                    wrapperStyle={{ 
                      fontSize: isMobile ? '11px' : '12px', 
                      paddingTop: isMobile ? '20px' : '40px',
                      color: isDark ? '#e5e7eb' : '#1f2937'
                    }}
                    formatter={(value: string, entry: any) => {
                      const data = entry.payload as ChartData
                      return `${value} (${data.percentage.toFixed(1)}%) • ${data.exposureLabel}`
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

