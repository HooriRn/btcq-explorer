import type { AddressAtRisk, DashboardMetrics } from '../types/dashboard'

// Mock API data
const mockAddressesAtRisk: AddressAtRisk[] = [
  {
    id: '1',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    height: 849987,
    transaction: 'a1b2c3d4e5f6...',
    riskLevel: 'High',
    time: '2m ago',
    status: 'active'
  },
  {
    id: '2',
    address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    height: 849985,
    transaction: 'f6e5d4c3b2a1...',
    riskLevel: 'Medium',
    time: '5m ago',
    status: 'active'
  },
  {
    id: '3',
    address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
    height: 849982,
    transaction: '9z8y7x6w5v4u3...',
    riskLevel: 'High',
    time: '8m ago',
    status: 'active'
  },
  {
    id: '4',
    address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    height: 849980,
    transaction: '3t4u5v6w7x8y9...',
    riskLevel: 'Medium',
    time: '12m ago',
    status: 'active'
  },
  {
    id: '5',
    address: 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3',
    height: 849978,
    transaction: '6y7z8a9b0c1d2...',
    riskLevel: 'High',
    time: '15m ago',
    status: 'active'
  },
  {
    id: '6',
    address: '1FfmbHfnpaZjKFvyi1okTjJJusN455paPH',
    height: 849975,
    transaction: '7x8y9z0a1b2c3...',
    riskLevel: 'Low',
    time: '18m ago',
    status: 'active'
  },
  {
    id: '7',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    height: 849972,
    transaction: '4d5e6f7g8h9i0...',
    riskLevel: 'High',
    time: '22m ago',
    status: 'active'
  },
  {
    id: '8',
    address: '3QJmV3qfvL9SuYo34YihAf3sRCW3qSinyC',
    height: 849970,
    transaction: '1j2k3l4m5n6o7...',
    riskLevel: 'Medium',
    time: '25m ago',
    status: 'active'
  },
  {
    id: '9',
    address: 'bc1q9vza2e8x573nczrlzms0wvx3gsqjx7vavgkx0ls',
    height: 849968,
    transaction: '8p9q0r1s2t3u4...',
    riskLevel: 'High',
    time: '28m ago',
    status: 'active'
  },
  {
    id: '10',
    address: '1P5ZEDWTKTFGxQjZphgWPQUpe554WKDfHQ',
    height: 849965,
    transaction: '5v6w7x8y9z0a1...',
    riskLevel: 'Low',
    time: '32m ago',
    status: 'active'
  },
  {
    id: '11',
    address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7k',
    height: 849963,
    transaction: '2b3c4d5e6f7g8...',
    riskLevel: 'Medium',
    time: '35m ago',
    status: 'active'
  },
  {
    id: '12',
    address: '3Kzh9qAqXWxQrFeQhWsdD6FW977WSH2EM3',
    height: 849961,
    transaction: '9h0i1j2k3l4m5...',
    riskLevel: 'High',
    time: '38m ago',
    status: 'active'
  },
  {
    id: '13',
    address: 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3',
    height: 849959,
    transaction: '6n7o8p9q0r1s2...',
    riskLevel: 'Low',
    time: '42m ago',
    status: 'active'
  },
  {
    id: '14',
    address: '1HUR1Xgxq9yUzrfu3y3J2K1j2E8LZDT6k',
    height: 849957,
    transaction: '3t4u5v6w7x8y9...',
    riskLevel: 'Medium',
    time: '45m ago',
    status: 'active'
  },
  {
    id: '15',
    address: 'bc1q9vza2e8x573nczrlzms0wvx3gsqjx7vavgkx0ls',
    height: 849955,
    transaction: '0z1a2b3c4d5e6...',
    riskLevel: 'High',
    time: '48m ago',
    status: 'active'
  },
  {
    id: '16',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    height: 849953,
    transaction: '7f8g9h0i1j2k3...',
    riskLevel: 'Low',
    time: '52m ago',
    status: 'active'
  },
  {
    id: '17',
    address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    height: 849951,
    transaction: '4l5m6n7o8p9q0...',
    riskLevel: 'Medium',
    time: '55m ago',
    status: 'active'
  },
  {
    id: '18',
    address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
    height: 849949,
    transaction: '1r2s3t4u5v6w7...',
    riskLevel: 'High',
    time: '58m ago',
    status: 'active'
  },
  {
    id: '19',
    address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    height: 849947,
    transaction: '8x9y0z1a2b3c4...',
    riskLevel: 'Low',
    time: '1h 2m ago',
    status: 'active'
  },
  {
    id: '20',
    address: 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3',
    height: 849945,
    transaction: '5d6e7f8g9h0i1...',
    riskLevel: 'Medium',
    time: '1h 5m ago',
    status: 'active'
  }
]

const mockMetrics: DashboardMetrics = {
  addressesIndexed: 1_234_567,
  addressesAtRisk: 89_156,
  currentBitcoinHeight: 850_000,
  trackedExposed: 0,
  trackedRevealed: 0,
  scannedBlocks: 0,
  latestBlock: {
    height: 0,
    hash: '',
    scannedAt: '',
    exposedCount: 0,
    revealedCount: 0
  }
}

// API functions
export const api = {
  fetchMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const response = await fetch('http://46.62.168.75:8080/stats/overview')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      // Transform API response to our DashboardMetrics format
      return {
        addressesIndexed: data.tracked_exposed + data.tracked_revealed, // Total addresses indexed
        addressesAtRisk: data.total, // Use total as addresses at-risk
        currentBitcoinHeight: data.latest_block.height,
        trackedExposed: data.tracked_exposed,
        trackedRevealed: data.tracked_revealed,
        scannedBlocks: data.scanned_blocks,
        latestBlock: {
          height: data.latest_block.height,
          hash: data.latest_block.hash,
          scannedAt: data.latest_block.scanned_at,
          exposedCount: data.latest_block.exposed_count,
          revealedCount: data.latest_block.revealed_count
        }
      }
    } catch (error) {
      console.error('Failed to fetch metrics from API:', error)
      // Fallback to mock data if API fails
      return { ...mockMetrics }
    }
  },
  
  fetchAddressesAtRisk: async (): Promise<AddressAtRisk[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    return [...mockAddressesAtRisk]
  }
}
