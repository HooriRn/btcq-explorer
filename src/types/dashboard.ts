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

// Address status result (when searching for an address)
export interface AddressStatusResult {
  address: string
  first_seen_block: number
  first_seen_block_timestamp: number
  last_seen_block: number
  last_seen_block_timestamp: number
  balance_sat: number
  utxo_count: number
  tx_count?: number
  appearances?: number
  script_pub_type: string
  source: 'address_status'
}

// UTXO result (when searching for a TXID)
export interface UTXOSearchResult {
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
  source: 'utxos'
}

// Union type for search results
export type SearchResult = AddressStatusResult | UTXOSearchResult

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
    ScannedAt: string
    exposedCount: number
    revealedCount: number
  }
  addressCount?: number
  utxoCount?: number
  highRiskAddressCount?: number
  mediumRiskAddressCount?: number
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

export interface Address {
  address: string
  created_block?: number
  created_block_timestamp?: number
  first_seen_block: number
  first_seen_block_timestamp: number
  last_seen_block: number
  last_seen_block_timestamp: number
  balance_sat: number
  utxo_count: number
  tx_count?: number
  appearances?: number
  script_pub_type: string
}

export interface AddressResponse {
  results: Address[]
}
