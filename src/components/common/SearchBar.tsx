import { useState } from 'react'
import { Input, Button, Spinner } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { api } from '../../services/api'
import type { SearchResponse } from '../../types/dashboard'

interface SearchBarProps {
  onSearch?: (query: string, results: SearchResponse) => void
  placeholder?: string
  /** When true, reduces top margin for use in hero section */
  inHero?: boolean
}

export const SearchBar = ({ 
  onSearch, 
  placeholder,
  inHero = false 
}: SearchBarProps) => {
  const { t } = useTranslation()
  const defaultPlaceholder = placeholder || t('dashboard.searchPlaceholder')
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

  return (
    <div className={`w-full ${inHero ? 'mt-0' : 'mt-8'}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 px-1.5 pt-1 pb-1 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={defaultPlaceholder}
            variant="flat"
            radius="lg"
            size="md"
            classNames={{
              input: "text-triany-400 font-normal font-['Inter'] text-sm md:text-base",
              inputWrapper: "border-0 shadow-none bg-transparent h-10 min-h-10 md:h-9 min-h-9 py-0 hover:!bg-transparent dark:hover:!bg-transparent data-[hover=true]:!bg-transparent focus-within:!bg-transparent dark:focus-within:!bg-transparent",
              base: "flex-1 min-w-0 mb-0"
            }}
          />
          <Button
            isIconOnly
            type="submit"
            isDisabled={isLoading || !query.trim()}
            radius="sm"
            className="w-10 h-10 min-h-10 md:w-9 md:h-9 md:min-h-9 shrink-0 !p-0 bg-transparent hover:bg-transparent data-[hover=true]:bg-transparent"
          >
            {isLoading ? (
              <Spinner size="sm" color="white" />
            ) : (
              <svg className="w-4 h-4 md:w-4 md:h-4 text-triany-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
