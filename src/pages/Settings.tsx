export const Settings = () => {
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Endpoint</label>
                <input 
                  type="text" 
                  defaultValue="https://api.btcq-explorer.com" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Key</label>
                <input 
                  type="password" 
                  placeholder="Enter your API key" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div>
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
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
