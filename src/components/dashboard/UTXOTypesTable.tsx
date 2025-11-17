import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@heroui/react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { HIGH_RISK_TYPES, MEDIUM_RISK_TYPES } from '../../utils/riskLevel'

export const UTXOTypesTable = () => {
  const { metrics } = useDashboardStore()
  const scriptTypeCounts = metrics.scriptTypeCounts || {}

  // Get all script types and sort by count (descending)
  const scriptTypes = Object.entries(scriptTypeCounts)
    .map(([type, count]) => ({
      type,
      count: count as number
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
    return count.toLocaleString()
  }

  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return '0.00'
    return ((count / total) * 100).toFixed(2)
  }

  const totalUtxos = metrics.utxoCount || 0

  if (scriptTypes.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">UTXO Types Distribution</h2>
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
              <TableColumn>Percentage</TableColumn>
              <TableColumn>Risk Level</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No UTXO types found">
              {scriptTypes.map(({ type, count }) => {
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

