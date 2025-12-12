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
      selectedKeys={[language]}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string
        if (selected) {
          handleLanguageChange(selected)
        }
      }}
      size="sm"
      variant="flat"
      classNames={{
        trigger: "min-w-[160px] bg-gray-100 dark:bg-gray-700",
        value: "text-xs font-medium"
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
        <SelectItem key={lang.code} textValue={lang.name}>
          <div className="flex items-center gap-2">
            <Flag code={lang.countryCode} className="w-5 h-4 rounded" />
            <span>{lang.name}</span>
          </div>
        </SelectItem>
      ))}
    </Select>
  )
}

