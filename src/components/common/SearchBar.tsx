import { useState } from 'react'
import { Input, Button, Spinner } from '@heroui/react'
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
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          variant="bordered"
          radius="full"
          size="lg"
          classNames={{
            input: "pr-12",
            inputWrapper: "border-2 pr-2"
          }}
          endContent={
            <Button
              isIconOnly
              type="submit"
              isDisabled={isLoading || !query.trim()}
              variant="light"
              radius="full"
              size="sm"
            >
              {isLoading ? (
                <Spinner size="sm" color="primary" />
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </Button>
          }
        />
      </form>
    </div>
  )
}
