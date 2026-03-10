import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDashboardStore } from '../../stores/dashboardStore'
import { Header } from './Header'
import Footer from './Footer'

export const Layout = () => {
  const fetchBitcoinPrice = useDashboardStore((s) => s.fetchBitcoinPrice)

  // Load BTC price on first load so Header and Metrics show it regardless of initial route
  useEffect(() => {
    fetchBitcoinPrice()
  }, [fetchBitcoinPrice])

  return (
    <div className="min-h-screen">
      <div className="bg- dark:bg-zinc-950 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
