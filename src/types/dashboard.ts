export interface AddressAtRisk {
  id: string
  address: string
  height: number
  transaction: string
  riskLevel: 'High' | 'Medium' | 'Low'
  time: string
  status: 'active' | 'inactive'
  source?: string
}

export interface SearchResult {
  address: string
  block_height: number
  txid: string
  source: string
}

export interface SearchResponse {
  results: SearchResult[]
}

export interface DashboardMetrics {
  addressesIndexed: number
  addressesAtRisk: number
  currentBitcoinHeight: number
  trackedExposed: number
  trackedRevealed: number
  scannedBlocks: number
  latestBlock: {
    height: number
    hash: string
    scannedAt: string
    exposedCount: number
    revealedCount: number
  }
  addressCount?: number
  utxoCount?: number
}

export interface UTXO {
  txid: string
  vout: number
  address: string
  value_sat: number
  script_pub_key_hex: string
  script_pub_type: string
  created_block: number
  created_block_timestamp: number
  spent: boolean
  spent_by_txid: string | null
  spent_vin: number | null
  spent_block: number | null
  spent_block_timestamp: number | null
}

export interface UTXOResponse {
  results: UTXO[]
}

export interface Block {
  block_height: number
  block_hash: string
  scanned_at: string
  block_timestamp: number
}

export interface BlockResponse {
  results: Block[]
}
