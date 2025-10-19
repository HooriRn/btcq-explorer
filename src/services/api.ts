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
  }
]

const mockMetrics: DashboardMetrics = {
  addressesIndexed: 1_234_567,
  addressesAtRisk: 89_123,
  currentBitcoinHeight: 850_000
}

// Mock API functions
export const api = {
  fetchMetrics: async (): Promise<DashboardMetrics> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return { ...mockMetrics }
  },
  
  fetchAddressesAtRisk: async (): Promise<AddressAtRisk[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    return [...mockAddressesAtRisk]
  }
}
