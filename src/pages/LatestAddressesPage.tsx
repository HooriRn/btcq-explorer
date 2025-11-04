import { LatestAddresses } from '../components/dashboard/LatestAddresses'
import { useDashboard } from '../hooks/useDashboard'

export const LatestAddressesPage = () => {
  useDashboard() // Initialize dashboard data

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <LatestAddresses />
    </main>
  )
}

