import { LatestBlocks } from '../components/dashboard/LatestBlocks'
import { useDashboard } from '../hooks/useDashboard'

export const LatestBlocksPage = () => {
  useDashboard() // Initialize dashboard data

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <LatestBlocks />
    </main>
  )
}

