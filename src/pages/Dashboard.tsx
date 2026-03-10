import { useState } from 'react'
import { MetricsCards, SearchBar, SearchResults } from '../components'
import { LatestAddressesPreview } from '../components/dashboard/LatestAddressesPreview'
import { LatestUTXOsPreview } from '../components/dashboard/LatestUTXOsPreview'
import { LatestBlocksPreview } from '../components/dashboard/LatestBlocksPreview'
import { UTXOTypesTable } from '../components/dashboard/UTXOTypesTable'
import { UTXODistributionCharts } from '../components/dashboard/UTXODistributionCharts'
import { useDashboard } from '../hooks/useDashboard'
import type { SearchResponse } from '../types/dashboard'
import backgroundBitcoin from '../assets/background.jpg?url'

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
        className="relative overflow-hidden min-h-[200px] md:min-h-[300px] flex flex-col justify-center pt-14 pb-24 bg-no-repeat bg-center bg-cover bg-[rgba(252,126,0,0.6)] dark:bg-orange-900"
        style={{
          backgroundImage: `url(${backgroundBitcoin})`,
        }}
      >
        {/* Soft shadow at the bottom of the hero background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 md:h-14 bg-gradient-to-b from-transparent to-black/25 dark:to-black/50" />
      </section>

      <main className="relative z-10 max-w-7xl mx-auto pt-4 pb-8 -mt-65">
        <div className="pb-10 max-w-7xl relative z-10 flex justify-start">
          <div className="w-full max-w-xl">
            <SearchBar onSearch={handleSearch} inHero />
          </div>
        </div>

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
