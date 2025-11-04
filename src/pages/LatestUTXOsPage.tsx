import { LatestUTXOs } from '../components/dashboard/LatestUTXOs'
import { useDashboard } from '../hooks/useDashboard'

export const LatestUTXOsPage = () => {
  useDashboard() // Initialize dashboard data

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <LatestUTXOs />
    </main>
  )
}

