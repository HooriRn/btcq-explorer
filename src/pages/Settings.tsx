import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../stores/settingsStore'
import { LanguageSwitcher } from '../components/common/LanguageSwitcher'

export const Settings = () => {
  const { t } = useTranslation()
  const { apiBaseUrl, setApiBaseUrl, resetApiBaseUrl, btcqIndexerUrl, setBtcqIndexerUrl, resetBtcqIndexerUrl } = useSettingsStore()
  const [localApiUrl, setLocalApiUrl] = useState(apiBaseUrl)
  const [localBtcqIndexerUrl, setLocalBtcqIndexerUrl] = useState(btcqIndexerUrl)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  // Sync local state with store when URLs change
  useEffect(() => {
    setLocalApiUrl(apiBaseUrl)
  }, [apiBaseUrl])
  useEffect(() => {
    setLocalBtcqIndexerUrl(btcqIndexerUrl)
  }, [btcqIndexerUrl])

  const hasChanges = localApiUrl !== apiBaseUrl || localBtcqIndexerUrl !== btcqIndexerUrl

  const handleSave = () => {
    setSaveStatus('saving')
    setApiBaseUrl(localApiUrl)
    setBtcqIndexerUrl(localBtcqIndexerUrl)
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 300)
  }

  const handleResetApi = () => {
    resetApiBaseUrl()
  }

  const handleResetBtcq = () => {
    resetBtcqIndexerUrl()
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <section className="pb-4 mb-4 border-b border-gray-200 dark:border-zinc-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
      </section>
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('settings.dashboardPreferences')}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.autoRefreshData')}</label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.autoRefreshDataDesc')}</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.showRiskIndicators')}</label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.showRiskIndicatorsDesc')}</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.language')}</label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.selectLanguage')}</p>
                </div>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('settings.apiConfiguration')}</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.apiBaseUrl')}
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{t('settings.apiBaseUrlDesc')}</span>
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={localApiUrl}
                    onChange={(e) => setLocalApiUrl(e.target.value)}
                    placeholder="https://api.example.com/"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleResetApi}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {t('common.reset')}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.current')} <span className="font-mono">{apiBaseUrl}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.btcqIndexerUrl')}
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{t('settings.btcqIndexerUrlDesc')}</span>
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={localBtcqIndexerUrl}
                    onChange={(e) => setLocalBtcqIndexerUrl(e.target.value)}
                    placeholder="https://indexer.example.com/"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleResetBtcq}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {t('common.reset')}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.current')} <span className="font-mono">{btcqIndexerUrl}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Display Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Items per page</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="10">10</option>
                  <option value="25" selected>25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div> */}
          
          <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
            <button 
              onClick={handleSave}
              disabled={saveStatus === 'saving' || !hasChanges}
              className={`px-6 py-2 rounded-md transition-colors ${
                saveStatus === 'saving'
                  ? 'bg-gray-400 dark:bg-gray-500 text-white cursor-not-allowed'
                  : saveStatus === 'saved'
                  ? 'bg-green-600 dark:bg-green-500 text-white'
                  : !hasChanges
                  ? 'bg-gray-400 dark:bg-gray-500 text-white cursor-not-allowed'
                  : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
              }`}
            >
              {saveStatus === 'saving' ? t('common.saving') : saveStatus === 'saved' ? t('common.saved') : t('settings.saveSettings')}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
