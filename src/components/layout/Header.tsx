import { Link, useLocation } from 'react-router-dom'
import { useDashboardStore } from '../../stores/dashboardStore'
import { ThemeToggle } from '../common/ThemeToggle'
import { BitcoinLogo } from '../common/BitcoinLogo'

export const Header = () => {
  const { metrics } = useDashboardStore()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Top row: Bitcoin Height and Theme Toggle */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="text-blue-600 dark:text-blue-400 font-medium">BTC Height:</span> {metrics.currentBitcoinHeight ? metrics.currentBitcoinHeight.toLocaleString() : 'Loading...'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="text-blue-600 dark:text-blue-400 font-medium">Addresses Indexed:</span> {metrics.addressesIndexed ? metrics.addressesIndexed.toLocaleString() : 'Loading...'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Bottom row: Logo and Navigation Menu */}
      <div className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <BitcoinLogo className="text-white" size="md" />
            </div>
            <span className="text-orange-600 dark:text-orange-400">₿TCQ</span>
            <span>Risk Dashboard</span>
          </Link>
          
          <nav className="flex space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') || isActive('/dashboard') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              About
            </Link>
            <Link 
              to="/settings" 
              className={`text-sm font-medium transition-colors ${
                isActive('/settings') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
