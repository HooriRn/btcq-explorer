import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { useThemeStore } from '../../stores/themeStore'

export const Layout = () => {
  const { getEffectiveTheme, theme } = useThemeStore()
  const effectiveTheme = getEffectiveTheme()

  // Initialize theme on mount
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'system') {
      html.removeAttribute('data-theme')
    } else {
      html.setAttribute('data-theme', theme)
    }
  }, [theme])

  return (
    <div className={`min-h-screen ${effectiveTheme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <Header />
        <Outlet />
      </div>
    </div>
  )
}
