import { Link, useLocation } from 'react-router-dom'
import { useDashboardStore } from '../../stores/dashboardStore'

export const Header = () => {
  const { metrics } = useDashboardStore()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white py-6 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            <span className="text-blue-600">₿TCQ</span> Risk Dashboard
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') || isActive('/dashboard') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              About
            </Link>
            <Link 
              to="/settings" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/settings') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">
            Height: {metrics.currentBitcoinHeight ? metrics.currentBitcoinHeight.toLocaleString() : 'Loading...'}
          </span>
        </div>
      </div>
    </header>
  )
}
