import { useState, useEffect } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

export const Settings = () => {
  const { apiBaseUrl, setApiBaseUrl, resetApiBaseUrl } = useSettingsStore()
  const [localApiUrl, setLocalApiUrl] = useState(apiBaseUrl)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  // Sync local state with store when apiBaseUrl changes
  useEffect(() => {
    setLocalApiUrl(apiBaseUrl)
  }, [apiBaseUrl])

  const handleSave = () => {
    setSaveStatus('saving')
    setApiBaseUrl(localApiUrl)
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 300)
  }

  const handleReset = () => {
    resetApiBaseUrl()
    // localApiUrl will be updated via useEffect when apiBaseUrl changes
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Dashboard Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-refresh data</label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatically refresh dashboard data every 30 seconds</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Show risk indicators</label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Display colored dots next to addresses based on risk level</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">API Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Base URL
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(must end with /)</span>
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={localApiUrl}
                    onChange={(e) => setLocalApiUrl(e.target.value)}
                    placeholder="https://api.example.com/"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Reset
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Current: <span className="font-mono">{apiBaseUrl}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Display Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Items per page</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="10">10</option>
                  <option value="25" selected>25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div> */}
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleSave}
              disabled={saveStatus === 'saving' || localApiUrl === apiBaseUrl}
              className={`px-6 py-2 rounded-md transition-colors ${
                saveStatus === 'saving'
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : saveStatus === 'saved'
                  ? 'bg-green-600 text-white'
                  : localApiUrl === apiBaseUrl
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
