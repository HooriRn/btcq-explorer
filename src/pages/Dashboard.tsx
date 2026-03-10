import { useState } from 'react'
import { MetricsCards, SearchBar, SearchResults } from '../components'
import { LatestAddressesPreview } from '../components/dashboard/LatestAddressesPreview'
import { LatestUTXOsPreview } from '../components/dashboard/LatestUTXOsPreview'
import { LatestBlocksPreview } from '../components/dashboard/LatestBlocksPreview'
import { UTXOTypesTable } from '../components/dashboard/UTXOTypesTable'
import { UTXODistributionCharts } from '../components/dashboard/UTXODistributionCharts'
import { useDashboard } from '../hooks/useDashboard'
import type { SearchResponse } from '../types/dashboard'
import backgroundBitcoin from '../assets/background.png?url'

export const Dashboard = () => {
  useDashboard() // Initialize dashboard data
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string, results: SearchResponse) => {
    setSearchQuery(query)
    setSearchResults(results)
  }

  return (
    <>
      <section
        className="relative overflow-hidden pt-14 pb-20 bg-no-repeat bg-center bg-cover bg-[rgba(252,126,0,0.6)] dark:bg-orange-900"
        style={{
          backgroundImage: `url(${backgroundBitcoin})`,
        }}
      >
        {/* Soft shadow at the bottom of the hero background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 md:h-14 bg-gradient-to-b from-transparent to-black/25 dark:to-black/50" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="w-full md:w-[55%]">
            <SearchBar onSearch={handleSearch} inHero />
          </div>
        </div>
      </section>

      <main className="relative z-10 max-w-7xl mx-auto py-8 -mt-20">
        <MetricsCards />

        {searchResults && (
        <SearchResults 
          results={searchResults.results} 
          isLoading={false} 
          query={searchQuery} 
        />
      )}


      <div className="mt-6">
        <UTXODistributionCharts />
        <UTXOTypesTable />
      </div>

      <LatestAddressesPreview />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        <div className="lg:col-span-3">
          <LatestUTXOsPreview />
        </div>
        <div className="lg:col-span-2">
          <LatestBlocksPreview />
        </div>
      </div>
      </main>
    </>
  )
}
