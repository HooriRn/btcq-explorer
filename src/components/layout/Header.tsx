import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@heroui/react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { ThemeToggle } from '../common/ThemeToggle'
import { BitcoinLogo } from '../common/BitcoinLogo'
import { AnimatedNumber } from '../common/AnimatedNumber'

export const Header = () => {
  const { metrics, bitcoinPrice } = useDashboardStore()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Top row: Bitcoin Height and Theme Toggle */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 sm:space-x-6 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <span className="text-blue-600 dark:text-blue-400 font-medium">BTC Height:</span>{' '}
                {metrics.currentBitcoinHeight ? (
                  <AnimatedNumber value={metrics.currentBitcoinHeight} />
                ) : (
                  'Loading...'
                )}
              </span>
            </div>
            {bitcoinPrice > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-orange-600 dark:text-orange-400 font-medium">BTC Price:</span>{' '}
                  <span className="font-semibold">${bitcoinPrice.toLocaleString()}</span>
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Bottom row: Logo and Navigation Menu */}
      <div className="px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
              <BitcoinLogo className="text-white" size="md" />
            </div>
            <span className="text-orange-600 dark:text-orange-400">₿TCQ</span>
            <span className="hidden sm:inline">Risk Dashboard</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
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

          {/* Mobile Menu Button */}
          <Button
            isIconOnly
            variant="light"
            className="md:hidden"
            onPress={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors py-2 ${
                  isActive('/') || isActive('/dashboard') 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors py-2 ${
                  isActive('/about') 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                About
              </Link>
              <Link 
                to="/settings" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors py-2 ${
                  isActive('/settings') 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Settings
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
