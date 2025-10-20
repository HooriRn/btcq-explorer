export interface AddressAtRisk {
  id: string
  address: string
  height: number
  transaction: string
  riskLevel: 'High' | 'Medium' | 'Low'
  time: string
  status: 'active' | 'inactive'
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
}
