import { Select, SelectItem } from '@heroui/react'
import { useI18nStore } from '../../stores/i18nStore'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
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
        trigger: "min-w-[110px] bg-gray-100 dark:bg-gray-700",
        value: "text-xs font-medium"
      }}
      aria-label={t('settings.selectLanguage')}
      renderValue={() => (
        <div className="flex items-center gap-2">
          {/* <span className="text-base">{currentLanguage.flag}</span> */}
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            {currentLanguage.code.toUpperCase()}
          </span>
        </div>
      )}
    >
      {languages.map((lang) => (
        <SelectItem key={lang.code} value={lang.code}>
          <div className="flex items-center gap-2">
            {/* <span>{lang.flag}</span> */}
            <span>{lang.name}</span>
          </div>
        </SelectItem>
      ))}
    </Select>
  )
}

