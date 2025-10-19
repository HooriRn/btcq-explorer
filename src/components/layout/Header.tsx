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
    <header className="bg-white dark:bg-gray-900 py-6 px-6 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3 text-3xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <BitcoinLogo className="text-white" size="md" />
            </div>
            <span className="text-orange-600 dark:text-oragne-400">₿TCQ</span>
            <span>Risk Dashboard</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') || isActive('/dashboard') 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              About
            </Link>
            <Link 
              to="/settings" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/settings') 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Height: {metrics.currentBitcoinHeight ? metrics.currentBitcoinHeight.toLocaleString() : 'Loading...'}
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
