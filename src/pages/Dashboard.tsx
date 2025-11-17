import { useState } from 'react'
import { MetricsCards, SearchBar, SearchResults } from '../components'
import { LatestAddressesPreview } from '../components/dashboard/LatestAddressesPreview'
import { LatestUTXOsPreview } from '../components/dashboard/LatestUTXOsPreview'
import { LatestBlocksPreview } from '../components/dashboard/LatestBlocksPreview'
import { UTXOTypesTable } from '../components/dashboard/UTXOTypesTable'
import { useDashboard } from '../hooks/useDashboard'
import type { SearchResponse } from '../types/dashboard'

export const Dashboard = () => {
  useDashboard() // Initialize dashboard data
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string, results: SearchResponse) => {
    setSearchQuery(query)
    setSearchResults(results)
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <MetricsCards />
      
      {/* <LatestBlockInfo /> */}
      
      <SearchBar onSearch={handleSearch} />
      
      {searchResults && (
        <SearchResults 
          results={searchResults.results} 
          isLoading={false} 
          query={searchQuery} 
        />
      )}

      <div className="mt-6">
        <UTXOTypesTable />
      </div>

      <LatestAddressesPreview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LatestUTXOsPreview />
        <LatestBlocksPreview />
      </div>

    </main>
  )
}
