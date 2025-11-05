import type { SearchResult, AddressStatusResult, UTXOSearchResult } from '../../types/dashboard'
import { Chip, Button } from '@heroui/react'
import { calculateUTXORiskLevel, HIGH_RISK_TYPES } from '../../utils/riskLevel'
import { CopyButton } from '../common/CopyButton'
import { Tooltip } from '../common/Tooltip'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  query: string
}

// Type guard to check if result is AddressStatusResult
const isAddressStatus = (result: SearchResult): result is AddressStatusResult => {
  return result.source === 'address_status'
}

// Type guard to check if result is UTXOSearchResult
const isUTXOResult = (result: SearchResult): result is UTXOSearchResult => {
  return result.source === 'utxos'
}

const formatTimestamp = (timestamp: number) => {
  try {
    return new Date(timestamp / 1_000_000).toLocaleString()
  } catch {
    return 'N/A'
  }
}

const formatValue = (valueSat: number) => {
  return (valueSat / 100_000_000).toFixed(8)
}

export const SearchResults = ({ results, isLoading, query }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Searching...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!query) {
    return null
  }

  if (results.length === 0) {
    return (
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="text-center">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Results Found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              No results found for <span className="font-mono">{query}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Search Results</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {results.length} result{results.length > 1 ? 's' : ''} found for <span className="font-mono">{query}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {results.map((result, index) => {
              // Render Address Status Result
              if (isAddressStatus(result)) {
                const isAddressReused = result.utxo_count > 0 && result.tx_count > 0
                const riskLevel = calculateUTXORiskLevel(result.script_pub_type, isAddressReused)
                const isCompromised = riskLevel === 'High'
                
                // Determine compromise reason
                const getCompromiseReason = () => {
                  if (HIGH_RISK_TYPES.includes(result.script_pub_type)) {
                    return `Address uses ${result.script_pub_type} script type, which exposes public keys directly. Vulnerable to quantum computers.`
                  }
                  if (isAddressReused) {
                    return 'Address has been reused (UTXO count > 0 and TX count > 0). Reused addresses expose public keys through transactions, making them vulnerable to quantum attacks.'
                  }
                  return 'Address is at high risk due to quantum vulnerability.'
                }
                
                return (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Address Status</h4>
                        <div className="flex items-center gap-2">
                          <Chip
                            color={riskLevel === 'High' ? 'danger' : riskLevel === 'Medium' ? 'warning' : 'success'}
                            variant="flat"
                            size="sm"
                          >
                            {riskLevel} Risk
                          </Chip>
                          {isAddressReused && (
                            <Chip
                              color="warning"
                              variant="flat"
                              size="sm"
                            >
                              Reused
                            </Chip>
                          )}
                          <Tooltip
                            content={
                              <div className="space-y-2">
                                <div>
                                  <p className="font-semibold mb-1">
                                    {isCompromised ? 'Compromised' : 'Not Compromised'}
                                  </p>
                                  <p className="text-xs">
                                    {isCompromised 
                                      ? getCompromiseReason()
                                      : 'Address is not currently compromised. However, it may still be at risk depending on script type and usage patterns.'
                                    }
                                  </p>
                                </div>
                                {isCompromised && (
                                  <div>
                                    <p className="font-semibold mb-1">Risk Level:</p>
                                    <p className="text-xs">{riskLevel} Risk</p>
                                  </div>
                                )}
                              </div>
                            }
                            position="top"
                          >
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              <AiOutlineQuestionCircle className="w-4 h-4" />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a 
                          href={`https://mempool.space/address/${result.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                        >
                          {result.address}
                        </a>
                        <CopyButton text={result.address} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Balance</label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatValue(result.balance_sat)} BTC</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">UTXO Count</label>
                        <p className="text-sm text-gray-900 dark:text-white">{result.utxo_count.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Transaction Count</label>
                        <p className="text-sm text-gray-900 dark:text-white">{result.tx_count.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Script Type</label>
                        <p className="text-sm text-gray-900 dark:text-white">{result.script_pub_type}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">First Seen Block</label>
                        <p className="text-sm text-gray-900 dark:text-white">{result.first_seen_block.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Last Seen Block</label>
                        <p className="text-sm text-gray-900 dark:text-white">{result.last_seen_block.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )
              }
              
              // Render UTXO Result
              if (isUTXOResult(result)) {
                const riskLevel = calculateUTXORiskLevel(result.script_pub_type, false)
                return (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">UTXO Details</h4>
                        <Chip
                          color={riskLevel === 'High' ? 'danger' : riskLevel === 'Medium' ? 'warning' : 'success'}
                          variant="flat"
                          size="sm"
                        >
                          {riskLevel} Risk
                        </Chip>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <a 
                            href={`https://mempool.space/tx/${result.txid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                          >
                            TXID: {result.txid.slice(0, 16)}...
                          </a>
                          <CopyButton text={result.txid} />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">VOUT: {result.vout}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Address</label>
                        <div className="flex items-center space-x-2">
                          <a 
                            href={`https://mempool.space/address/${result.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors break-all"
                          >
                            {result.address}
                          </a>
                          <CopyButton text={result.address} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Value</label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatValue(result.value_sat)} BTC</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
                        <p className="text-sm">
                          {result.spent ? (
                            <Chip color="danger" variant="flat" size="sm">
                              Spent
                            </Chip>
                          ) : (
                            <Chip color="success" variant="flat" size="sm">
                              Unspent
                            </Chip>
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Script Type</label>
                        <p className="text-sm text-gray-900 dark:text-white">{result.script_pub_type}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Created Block</label>
                        <p className="text-sm text-gray-900 dark:text-white">{result.created_block.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Created Timestamp</label>
                        <p className="text-sm text-gray-900 dark:text-white">{formatTimestamp(result.created_block_timestamp)}</p>
                      </div>
                      {result.spent && (
                        <>
                          <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Spent By TXID</label>
                            <p className="text-sm font-mono break-all">
                              <a 
                                href={`https://mempool.space/tx/${result.spent_by_txid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                              >
                                {result.spent_by_txid?.slice(0, 16)}...
                              </a>
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Spent Block</label>
                            <p className="text-sm text-gray-900 dark:text-white">{result.spent_block?.toLocaleString() || 'N/A'}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              }
              
              return null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
