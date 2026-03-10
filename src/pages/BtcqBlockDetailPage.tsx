import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { api } from '../services/api'
import type { BtcqBlock, BtcqEvent } from '../types/dashboard'
import { CopyButton } from '../components/common/CopyButton'

const BackArrowIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M23,11H6v-3.361c0-.695-.852-1.044-1.35-.552L.232,11.448c-.309,.305-.309,.799,0,1.104l4.418,4.361c.498,.492,1.35,.143,1.35-.552v-3.361H23c.553,0,1-.448,1-1s-.447-1-1-1Z" />
  </svg>
)

const formatTimestamp = (ts: number) => {
  try {
    const seconds = Math.floor(Number(ts) / 1e9)
    return new Date(seconds * 1000).toLocaleString()
  } catch {
    return 'N/A'
  }
}

const formatHash = (hash: string, maxLen = 24) => {
  if (!hash) return 'N/A'
  if (hash.length <= maxLen) return hash
  return `${hash.slice(0, 12)}...${hash.slice(-8)}`
}

const EventAttributes = ({ event }: { event: BtcqEvent }) => (
  <Table
    aria-label="Event attributes"
    removeWrapper
    classNames={{
      wrapper: 'bg-transparent',
      th: 'bg-gray-100 dark:bg-zinc-800/50 text-gray-400 dark:text-gray-400 text-left font-medium',
      td: 'font-mono text-sm text-gray-900 dark:text-gray-100',
    }}
  >
    <TableHeader>
      <TableColumn>Key</TableColumn>
      <TableColumn>Value</TableColumn>
    </TableHeader>
    <TableBody>
      {(event.attributes ?? []).map((attr, i) => (
        <TableRow key={`${attr.key}-${i}`}>
          <TableCell className="py-1">{attr.key}</TableCell>
          <TableCell className="py-1 break-all">{attr.value}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

export const BtcqBlockDetailPage = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [block, setBlock] = useState<BtcqBlock | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Always fetch block by id so we get full details (finalized_events, txs).
  // Use location.state as instant placeholder when navigating from list.
  useEffect(() => {
    if (!id) {
      setError(t('common.error'))
      setLoading(false)
      return
    }
    const stateBlock = location.state?.block as BtcqBlock | undefined
    const stateMatches =
      stateBlock &&
      (stateBlock.height === Number(id) || String(stateBlock.height) === id || stateBlock.hash === id)
    if (stateMatches) {
      setBlock(stateBlock)
      setLoading(false)
    } else {
      setBlock(null)
      setLoading(true)
    }
    setError(null)
    let cancelled = false
    api.fetchBtcqBlock(id).then((data) => {
      if (cancelled) return
      setLoading(false)
      if (data) setBlock(data)
      else setError(t('common.error'))
    })
    return () => {
      cancelled = true
    }
  }, [id, location.pathname, t])

  if (loading && !block) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4">
          <Spinner size="md" />
          <span className="text-gray-500 dark:text-gray-400">{t('common.loading')}</span>
        </div>
      </main>
    )
  }

  if (error || !block) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-red-600 dark:text-red-400">{error ?? t('common.error')}</p>
        <Button className="mt-4 text-gray-800 dark:text-gray-200" onPress={() => navigate('/btcq')} startContent={<BackArrowIcon className="w-4 h-4" />}>
          {t('btcq.backToBlocks')}
        </Button>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <section className="pb-4 mb-4 border-b border-gray-200 dark:border-zinc-800">
        <Button
          variant="light"
          size="sm"
          className="mb-4 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
          onPress={() => navigate('/btcq')}
          startContent={<BackArrowIcon className="w-4 h-4 shrink-0" />}
        >
          {t('btcq.backToBlocks')}
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('btcq.blockDetail')} #{block.height}
        </h1>
      </section>

      {/* Block summary */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm p-6 mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('btcq.height')}:</span>
              <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{block.height}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">{t('btcq.hash')}:</span>
              <span className="font-mono text-sm break-all text-gray-900 dark:text-gray-100">{block.hash}</span>
              <CopyButton text={block.hash} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('btcq.timestamp')}:</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">{formatTimestamp(block.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Finalized events */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('btcq.finalizedEvents')} ({(block.finalized_events ?? []).length})
        </h2>
        <div className="space-y-4 mb-8">
          {(block.finalized_events ?? []).map((event, idx) => (
            <div
              key={`${event.type}-${idx}`}
              className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden"
            >
              <div className="px-4 py-2 bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                <span className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400">{event.type}</span>
              </div>
              <div className="p-4">
                <EventAttributes event={event} />
              </div>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('btcq.transactions')} ({(block.txs ?? []).length})
        </h2>
        <div className="space-y-6">
          {(block.txs ?? []).map((tx, txIdx) => (
            <div
              key={tx.tx_hash}
              className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{t('btcq.txHash')}:</span>
                <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{formatHash(tx.tx_hash, 64)}</span>
                <CopyButton text={tx.tx_hash} />
              </div>
              {tx.tx_hex != null && tx.tx_hex !== '' && (
                <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-700/50 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t('btcq.txHex')}:</span>
                  <span className="font-mono text-xs break-all text-gray-700 dark:text-gray-300">
                    {formatHash(tx.tx_hex, 80)}
                  </span>
                  <CopyButton text={tx.tx_hex} />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('btcq.events')} ({tx.events?.length ?? 0})
                </h3>
                <div className="space-y-3">
                  {(tx.events ?? []).map((event, evIdx) => (
                    <div
                      key={`${txIdx}-${evIdx}-${event.type}`}
                      className="rounded border border-gray-200 dark:border-zinc-700 p-3"
                    >
                      <div className="text-xs font-mono text-blue-600 dark:text-blue-400 mb-2">{event.type}</div>
                      <EventAttributes event={event} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
    </main>
  )
}
