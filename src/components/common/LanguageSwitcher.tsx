import { Select, SelectItem } from '@heroui/react'
import { useI18nStore } from '../../stores/i18nStore'
import { useTranslation } from 'react-i18next'
import Flag from 'react-world-flags'

const languages = [
  { code: 'en', name: 'English', countryCode: 'US' },
  { code: 'es', name: 'Español', countryCode: 'ES' },
  { code: 'fr', name: 'Français', countryCode: 'FR' }
]

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18nStore()
  const { t } = useTranslation()

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'en' | 'es' | 'fr')
  }

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  return (
    <Select
      selectedKeys={new Set([language])}
      onSelectionChange={(keys) => {
        const key = keys instanceof Set ? keys.values().next().value : Array.from(keys)[0]
        if (key) {
          handleLanguageChange(key as string)
        }
      }}
      disallowEmptySelection
      size="sm"
      variant="flat"
      classNames={{
        trigger: "min-w-[160px] bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700",
        value: "text-xs font-medium text-gray-900 dark:text-gray-100",
        popoverContent: "bg-white dark:bg-zinc-900 z-[2000]",
        listbox: "bg-white dark:bg-zinc-900",
        base: "text-gray-900 dark:text-gray-100"
      }}
      aria-label={t('settings.selectLanguage')}
      renderValue={() => (
        <div className="flex items-center gap-2">
          <Flag code={currentLanguage.countryCode} className="w-5 h-4 rounded" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            {currentLanguage.name}
          </span>
        </div>
      )}
    >
      {languages.map((lang) => (
        <SelectItem 
          key={lang.code} 
          textValue={lang.name}
          classNames={{
            base: "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-zinc-800"
          }}
        >
          <div className="flex items-center gap-2">
            <Flag code={lang.countryCode} className="w-5 h-4 rounded" />
            <span>{lang.name}</span>
          </div>
        </SelectItem>
      ))}
    </Select>
  )
}

