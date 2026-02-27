import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { api } from '../services/api'
import type { BtcqBlock } from '../types/dashboard'
import { TableSkeleton } from '../components/common/LoadingSkeleton'
import { CopyButton } from '../components/common/CopyButton'

export const BtcqPage = () => {
  const { t } = useTranslation()
  const [blocks, setBlocks] = useState<BtcqBlock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchBlocks = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.fetchBtcqBlocks()
      setBlocks(data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'))
      setBlocks([])
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchBlocks()
  }, [fetchBlocks])

  const formatTimestamp = (ts: number) => {
    try {
      const seconds = ts / 1e9
      return new Date(seconds * 1000).toLocaleString()
    } catch {
      return 'N/A'
    }
  }

  const formatHash = (hash: string) => {
    if (!hash) return 'N/A'
    if (hash.length <= 24) return hash
    return `${hash.slice(0, 16)}...${hash.slice(-8)}`
  }

  if (isLoading && blocks.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('btcq.title')}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('common.loading')}</span>
              <Spinner size="sm" />
            </div>
          </div>
          <TableSkeleton />
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('btcq.title')}</h1>
          <div className="flex items-center space-x-4">
            {error && (
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('header.lastUpdated')}: {lastUpdated || t('header.never')}
            </span>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={fetchBlocks}
              title={t('common.refresh')}
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <Table
            aria-label={t('btcq.blocksTableLabel')}
            removeWrapper
            classNames={{
              wrapper: 'bg-white dark:bg-zinc-900',
              th: 'bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-300',
              tr: 'border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50',
              td: 'bg-white dark:bg-zinc-900',
              thead: '[&>tr]:first:rounded-b-none [&>tr>th]:first:rounded-bl-none [&>tr>th]:last:rounded-br-none'
            }}
          >
            <TableHeader>
              <TableColumn>{t('btcq.height')}</TableColumn>
              <TableColumn>{t('btcq.hash')}</TableColumn>
              <TableColumn>{t('btcq.timestamp')}</TableColumn>
              <TableColumn>{t('btcq.txCount')}</TableColumn>
            </TableHeader>
            <TableBody>
              {blocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400 py-8">
                    {error ? t('common.error') : t('btcq.noBlocks')}
                  </TableCell>
                </TableRow>
              ) : (
                blocks.map((block) => (
                  <TableRow key={`${block.height}-${block.hash}`}>
                    <TableCell>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {block.height.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                          {formatHash(block.hash)}
                        </span>
                        <CopyButton text={block.hash} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {formatTimestamp(block.timestamp)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {block.txs?.length ?? 0}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  )
}
