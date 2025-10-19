import { MetricsCards } from '../components/dashboard/MetricsCards'
import { SearchBar } from '../components/common/SearchBar'
import { useDashboard } from '../hooks/useDashboard'
import { LatestAddressesAtRisk } from '../components/dashboard/LatestAddressesAtRisk'

export const Dashboard = () => {
  useDashboard() // Initialize dashboard data

  const handleSearch = (query: string) => {
    console.log('Searching for:', query)
    // TODO: Implement search functionality
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <MetricsCards />
      
      <SearchBar onSearch={handleSearch} />
      
      <LatestAddressesAtRisk />
    </main>
  )
}
