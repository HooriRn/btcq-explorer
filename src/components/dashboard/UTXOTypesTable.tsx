import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@heroui/react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { HIGH_RISK_TYPES, MEDIUM_RISK_TYPES } from '../../utils/riskLevel'

export const UTXOTypesTable = () => {
  const { metrics, supplyStats, bitcoinPrice } = useDashboardStore()
  const scriptTypeCounts = metrics.scriptTypeCounts || {}
  const scriptTypeBalances = supplyStats.script_type_balances || {}
  const totalSupply = supplyStats.total_supply_sat || 0

  // Get all script types and combine count and balance data
  const scriptTypes = Object.entries(scriptTypeCounts)
    .map(([type, count]) => ({
      type,
      count: count as number,
      balance: scriptTypeBalances[type] || 0
    }))
    .sort((a, b) => b.count - a.count)

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

  const getRiskColor = (riskLevel: 'High' | 'Medium' | 'Low' | 'N/A') => {
    switch (riskLevel) {
      case 'High':
        return 'danger'
      case 'Medium':
        return 'warning'
      case 'Low':
        return 'success'
      case 'N/A':
        return 'default'
    }
  }

  const formatCount = (count: number) => {
    if (count === 0) {
      return 'N/A'
    }
    return count.toLocaleString()
  }

  const formatBalance = (satoshi: number) => {
    if (satoshi === 0) return '0'
    // Convert satoshi to BTC for display
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

  const calculatePercentage = (count: number, total: number) => {
    if (count === 0 || total === 0) {
      return 'N/A'
    }
    return ((count / total) * 100).toFixed(2)
  }

  const calculateBalancePercentage = (balance: number, totalSupply: number) => {
    if (totalSupply === 0) return '0.00'
    return ((balance / totalSupply) * 100).toFixed(2)
  }

  const totalUtxos = metrics.utxoCount || 0

  if (scriptTypes.length === 0) {
    return null
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        {totalSupply > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Total Supply: </span>
            <span className="font-mono">{formatBalance(totalSupply)}</span>
            {bitcoinPrice > 0 && (
              <span className="ml-2">• {formatUSD(totalSupply)}</span>
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
              wrapper: "bg-white dark:bg-gray-800 min-w-full",
              th: "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 whitespace-nowrap",
              tr: "border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50",
              td: "bg-white dark:bg-gray-800 whitespace-nowrap",
              thead: "[&>tr]:first:rounded-b-none [&>tr>th]:first:rounded-bl-none [&>tr>th]:last:rounded-br-none"
            }}
          >
            <TableHeader>
              <TableColumn>Script Type</TableColumn>
              <TableColumn>Count</TableColumn>
              <TableColumn>Count %</TableColumn>
              <TableColumn>Balance</TableColumn>
              <TableColumn>Balance %</TableColumn>
              <TableColumn>Risk Level</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No UTXO types found">
              {scriptTypes.map(({ type, count, balance }) => {
                const riskLevel = getRiskLevel(type)
                return (
                  <TableRow key={type}>
                    <TableCell>
                      <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                        {type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {formatCount(count)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {calculatePercentage(count, totalUtxos)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {formatBalance(balance)}
                        </span>
                        {bitcoinPrice > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatUSD(balance)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {calculateBalancePercentage(balance, totalSupply)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getRiskColor(riskLevel)}
                        variant="flat"
                        size="sm"
                      >
                        {riskLevel}
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

