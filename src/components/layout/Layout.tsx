import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import Footer from './Footer'


export const Layout = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
