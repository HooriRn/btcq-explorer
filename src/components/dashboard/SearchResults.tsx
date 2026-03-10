import type { SearchResult, AddressStatusResult, UTXOSearchResult } from '../../types/dashboard'
import { Chip, Button } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { calculateUTXORiskLevel, HIGH_RISK_TYPES } from '../../utils/riskLevel'
import { CopyButton } from '../common/CopyButton'
import { Tooltip } from '../common/Tooltip'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { useDashboardStore } from '../../stores/dashboardStore'

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

const formatValue = (valueSat: number) => {
  return (valueSat / 100_000_000).toFixed(8)
}

const formatUSD = (satoshi: number, bitcoinPrice: number) => {
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

const formatAddress = (address: string, maxLength: number = 20) => {
  if (!address) return ''
  if (address.length <= maxLength) return address
  return `${address.slice(0, maxLength - 3)}...`
}

const formatTimestamp = (nanoseconds: number) => {
  if (!nanoseconds || nanoseconds === 0) return 'N/A'
  // Convert nanoseconds to milliseconds
  const milliseconds = nanoseconds / 1_000_000
  const date = new Date(milliseconds)
  return date.toLocaleString()
}

const getRiskScoreColor = (score: number) => {
  if (score >= 7) return 'text-red-600 dark:text-red-400'
  if (score >= 4) return 'text-orange-600 dark:text-orange-400'
  return 'text-green-600 dark:text-green-400'
}

const getRiskScoreBgColor = (score: number) => {
  if (score >= 7) return 'bg-red-500'
  if (score >= 4) return 'bg-orange-500'
  return 'bg-green-500'
}

// getScoreLabel will be translated in the component

export const SearchResults = ({ results, isLoading, query }: SearchResultsProps) => {
  const { t } = useTranslation()
  const { bitcoinPrice } = useDashboardStore()

  const getScoreLabel = (score: number) => {
    if (score >= 7) return t('searchResults.highScore')
    if (score >= 4) return t('searchResults.mediumScore')
    return t('searchResults.lowScore')
  }
  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">{t('common.searching')}</span>
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
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
          <div className="text-center">
            <div className="bg-gray-100 dark:bg-zinc-800 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('search.noResults')}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('search.noResultsFor')} <span className="font-mono">{query}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="bg-gray-50 dark:bg-zinc-800 px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('search.results')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {results.length} {t('search.result', { count: results.length })} {t('search.foundFor')} <span className="font-mono">{query}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {results.map((result, index) => {
              // Render Address Status Result
              if (isAddressStatus(result)) {
                const riskLevel = calculateUTXORiskLevel(result.script_pub_type, result.reused)
                const isCompromised = riskLevel === 'High'
                
                // Determine compromise reason
                const getCompromiseReason = () => {
                  if (HIGH_RISK_TYPES.includes(result.script_pub_type)) {
                    return t('searchResults.compromiseReasonBadType', { type: result.script_pub_type })
                  }
                  if (result.reused) {
                    return t('searchResults.compromiseReasonReuse')
                  }
                  return t('searchResults.compromiseReasonGeneric')
                }
                
                return (
                  <div key={index} className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{t('searchResults.addressStatus')}</h4>
                        <div className="flex items-center gap-2">
                          <Chip
                            color={riskLevel === 'High' ? 'danger' : riskLevel === 'Medium' ? 'warning' : 'success'}
                            variant="flat"
                            size="sm"
                            classNames={{
                              base: `bubble-chip ${
                                riskLevel === 'High'
                                  ? 'bubble-chip-danger'
                                  : riskLevel === 'Medium'
                                  ? 'bubble-chip-warning'
                                  : 'bubble-chip-success'
                              }`
                            }}
                          >
                            {riskLevel === 'High' ? t('searchResults.highRisk') : riskLevel === 'Medium' ? t('searchResults.mediumRisk') : t('searchResults.lowRisk')}
                          </Chip>
                          <Chip
                            color={result.reused ? 'warning' : 'success'}
                            variant="flat"
                            size="sm"
                            classNames={{
                              base: `bubble-chip ${
                                result.reused ? 'bubble-chip-warning' : 'bubble-chip-success'
                              }`
                            }}
                          >
                            {result.reused ? t('searchResults.reused') : t('searchResults.notReused')}
                          </Chip>
                          <Tooltip
                            content={
                              <div className="space-y-2">
                                <div>
                                  <p className="font-semibold mb-1">
                                    {isCompromised ? t('searchResults.compromised') : t('searchResults.notCompromised')}
                                  </p>
                                  <p className="text-xs">
                                    {isCompromised 
                                      ? getCompromiseReason()
                                      : t('searchResults.notCompromisedDesc')
                                    }
                                  </p>
                                </div>
                                {isCompromised && (
                                  <div>
                                    <p className="font-semibold mb-1">{t('searchResults.risk')}:</p>
                                    <p className="text-xs">{riskLevel === 'High' ? t('searchResults.highRisk') : riskLevel === 'Medium' ? t('searchResults.mediumRisk') : t('searchResults.lowRisk')}</p>
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
                      <div className="flex items-center space-x-2 min-w-0">
                        <a 
                          href={`https://mempool.space/address/${result.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors truncate max-w-[300px]"
                          title={result.address}
                        >
                          {formatAddress(result.address, 30)}
                        </a>
                        <CopyButton text={result.address} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('searchResults.balance')}</label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatValue(result.balance_sat)} BTC</p>
                        {bitcoinPrice > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatUSD(result.balance_sat, bitcoinPrice)}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('searchResults.utxoCount')}</label>
                        <p className="text-sm text-gray-900 dark:text-white">{result.utxo_count.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('searchResults.scriptType')}</label>
                        <p className="text-sm text-gray-900 dark:text-white">{result.script_pub_type}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('searchResults.createdBlock')}</label>
                        <p className="text-sm text-gray-900 dark:text-white">{result.created_block.toLocaleString()}</p>
                      </div>
                      {result.created_block_timestamp && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('searchResults.createdBlockTimestamp')}</label>
                          <p className="text-sm text-gray-900 dark:text-white">{formatTimestamp(result.created_block_timestamp)}</p>
                        </div>
                      )}
                    </div>

                    {/* Risk Scores Section */}
                    {(result.risk_score !== undefined || result.balance_risk_score !== undefined || result.age_risk_score !== undefined) && (
                      <div className="mt-4 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('searchResults.riskAssessment')}</h5>
                          {result.risk_score !== undefined && (
                              <Chip
                                color={result.risk_score >= 7 ? 'danger' : result.risk_score >= 4 ? 'warning' : 'success'}
                                variant="flat"
                                size="sm"
                                classNames={{
                                  base: `bubble-chip ${
                                    result.risk_score >= 7
                                      ? 'bubble-chip-danger'
                                      : result.risk_score >= 4
                                      ? 'bubble-chip-warning'
                                      : 'bubble-chip-success'
                                  }`
                                }}
                              >
                              {getScoreLabel(result.risk_score)}
                            </Chip>
                          )}
                        </div>
                        <div className="space-y-3">
                          {/* Overall Risk Score */}
                          {result.risk_score !== undefined && (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('searchResults.overallRiskScore')}</label>
                                <span className={`text-lg font-bold ${getRiskScoreColor(result.risk_score)}`}>
                                  {result.risk_score.toFixed(2)}/10
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full transition-all ${getRiskScoreBgColor(result.risk_score)}`}
                                  style={{ width: `${(result.risk_score / 10) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Breakdown Scores */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-zinc-700">
                            {result.balance_risk_score !== undefined && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('searchResults.balanceRisk')}</label>
                                  <span className={`text-sm font-semibold ${getRiskScoreColor(result.balance_risk_score)}`}>
                                    {result.balance_risk_score.toFixed(2)}/10
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${getRiskScoreBgColor(result.balance_risk_score)}`}
                                    style={{ width: `${(result.balance_risk_score / 10) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            
                            {result.age_risk_score !== undefined && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('searchResults.ageRisk')}</label>
                                  <span className={`text-sm font-semibold ${getRiskScoreColor(result.age_risk_score)}`}>
                                    {result.age_risk_score.toFixed(2)}/10
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${getRiskScoreBgColor(result.age_risk_score)}`}
                                    style={{ width: `${(result.age_risk_score / 10) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
              
              // Render UTXO Result
              if (isUTXOResult(result)) {
                const riskLevel = calculateUTXORiskLevel(result.script_pub_type, false)
                return (
                  <div key={index} className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{t('searchResults.utxoDetails')}</h4>
                        <Chip
                          color={riskLevel === 'High' ? 'danger' : riskLevel === 'Medium' ? 'warning' : 'success'}
                          variant="flat"
                          size="sm"
                          classNames={{
                            base: `bubble-chip ${
                              riskLevel === 'High'
                                ? 'bubble-chip-danger'
                                : riskLevel === 'Medium'
                                ? 'bubble-chip-warning'
                                : 'bubble-chip-success'
                            }`
                          }}
                        >
                          {riskLevel} Risk
                        </Chip>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 min-w-0">
                          <a 
                            href={`https://mempool.space/tx/${result.txid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors truncate max-w-[250px]"
                            title={result.txid}
                          >
                            {t('searchResults.txid')} {formatAddress(result.txid, 20)}
                          </a>
                          <CopyButton text={result.txid} />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t('searchResults.vout')} {result.vout}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('searchResults.address')}</label>
                        <div className="flex items-center space-x-2 min-w-0">
                          <a 
                            href={`https://mempool.space/address/${result.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors truncate max-w-[300px]"
                            title={result.address}
                          >
                            {formatAddress(result.address, 30)}
                          </a>
                          <CopyButton text={result.address} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('searchResults.value')}</label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatValue(result.value_sat)} BTC</p>
                        {bitcoinPrice > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatUSD(result.value_sat, bitcoinPrice)}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('searchResults.status')}</label>
                        <p className="text-sm">
                          {result.spent ? (
                            <Chip
                              color="danger"
                              variant="flat"
                              size="sm"
                              classNames={{ base: 'bubble-chip bubble-chip-danger' }}
                            >
                              {t('searchResults.spent')}
                            </Chip>
                          ) : (
                            <Chip
                              color="success"
                              variant="flat"
                              size="sm"
                              classNames={{ base: 'bubble-chip bubble-chip-success' }}
                            >
                              {t('searchResults.unspent')}
                            </Chip>
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('searchResults.scriptType')}</label>
                        <p className="text-sm text-gray-900 dark:text-white">{result.script_pub_type}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('searchResults.createdBlock')}</label>
                        <p className="text-sm text-gray-900 dark:text-white">{result.created_block.toLocaleString()}</p>
                      </div>
                      {result.spent && (
                        <>
                          <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('searchResults.spentByTxid')}</label>
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
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('searchResults.spentBlock')}</label>
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
