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
  script_pub_type: string
  reused: boolean
  created_block: number
  created_block_timestamp: number
  balance_sat: number
  utxo_count: number
  balance_risk_score?: number
  age_risk_score?: number
  risk_score?: number
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
  scriptTypeCounts?: Record<string, number>
  exposedAddressCount?: number
  notExposedAddressCount?: number
  reusedAddressCount?: number
  exposedBalanceSat?: number
  safeBalanceSat?: number
  scriptTypeExposureStats?: ScriptTypeExposureStat[]
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
  script_pub_type: string
  reused: boolean
  created_block: number
  created_block_timestamp: string
  balance_sat: number
}

export interface AddressResponse {
  results: Address[]
}

export interface ScriptTypeExposureStat {
  scriptType: string
  totalCount: number
  reusedCount: number
  totalSat: number
  reusedSat: number
  exposedCount: number
  safeCount: number
  exposedSat: number
  safeSat: number
  exposureCategory: 'bad_type' | 'reuse' | 'none'
}

export interface AddressStatsEntry {
  script_pub_type: string
  reused_count: number
  count: number
  reused_sat: number
  total_sat: number
}

export interface AddressStatsResponse {
  results: AddressStatsEntry[]
}

export interface SupplyStats {
  total_supply_sat: number
  script_type_balances: Record<string, number>
}

export interface SupplyStatsResponse {
  total_supply_sat: number
  script_type_balances: Record<string, number>
}

// QBTC indexer block (v2/blocks endpoint)
export interface QbtcEventAttribute {
  key: string
  value: string
}

export interface QbtcEvent {
  type: string
  attributes: QbtcEventAttribute[]
}

export interface QbtcTx {
  tx_hash: string
  tx_hex: string
  events: QbtcEvent[]
}

export interface QbtcBlock {
  hash: string
  height: number
  timestamp: number
  finalized_events: QbtcEvent[]
  txs: QbtcTx[]
}

export type QbtcBlocksResponse = QbtcBlock[]
