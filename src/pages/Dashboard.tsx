import { useState } from 'react'
import { MetricsCards, SearchBar, LatestUTXOs, LatestBlocks, SearchResults } from '../components'
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

      <LatestUTXOs />
      <LatestBlocks />
    </main>
  )
}
