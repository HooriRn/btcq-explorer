import { Link } from 'react-router-dom'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@heroui/react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { TableSkeleton } from '../common/LoadingSkeleton'
import { calculateUTXORiskLevel } from '../../utils/riskLevel'
import { CopyButton } from '../common/CopyButton'

export const LatestAddressesPreview = () => {
  const { latestAddresses, isLoading } = useDashboardStore()

  // Only show skeleton on initial load when there's no data
  if (isLoading && latestAddresses.length === 0) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Addresses</h2>
          <Link 
            to="/addresses"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
          >
            View All →
          </Link>
        </div>
        <TableSkeleton />
      </div>
    )
  }

  const formatValue = (valueSat: number) => {
    return (valueSat / 100_000_000).toFixed(8)
  }

  // Calculate risk levels and limit to 5 rows
  const addressesWithRisk = latestAddresses
    .slice(0, 5)
    .map(address => {
      const riskLevel = calculateUTXORiskLevel(address.script_pub_type, false)
      return { ...address, riskLevel }
    })

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Addresses</h2>
        <Link 
          to="/addresses"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
        >
          View All →
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <Table 
          aria-label="Latest addresses preview table" 
          removeWrapper
          classNames={{
            tr: "border-b border-gray-200 dark:border-gray-700",
            thead: "[&>tr]:first:rounded-b-none [&>tr>th]:first:rounded-bl-none [&>tr>th]:last:rounded-br-none"
          }}
        >
          <TableHeader>
            <TableColumn>Address</TableColumn>
            <TableColumn>Balance (BTC)</TableColumn>
            <TableColumn>UTXO Count</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Risk</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No addresses found">
            {addressesWithRisk.map((address, index) => (
              <TableRow key={`${address.address}-${index}`}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <a 
                      href={`https://mempool.space/address/${address.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                      {address.address}
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
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {address.utxo_count.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip color="primary" variant="flat" size="sm">
                    {address.script_pub_type}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    color={address.riskLevel === 'High' ? 'danger' : address.riskLevel === 'Medium' ? 'warning' : 'success'}
                    variant="flat"
                    size="sm"
                  >
                    {address.riskLevel}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

