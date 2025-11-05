import { useState } from 'react'
import { Spinner } from '@heroui/react'
import { api } from '../../services/api'
import type { SearchResponse } from '../../types/dashboard'

interface SearchBarProps {
  onSearch?: (query: string, results: SearchResponse) => void
  placeholder?: string
}

export const SearchBar = ({ 
  onSearch, 
  placeholder = "Search Addresses or TxID" 
}: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const results = await api.searchAddress(query.trim())
      onSearch?.(query.trim(), results)
    } catch (error) {
      console.error('Search failed:', error)
      onSearch?.(query.trim(), { results: [] })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="mt-8 w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full px-6 py-4 pr-16 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-3 transition-colors duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" color="primary" />
              </div>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
