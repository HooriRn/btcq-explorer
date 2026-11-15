import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Dashboard } from '../pages/Dashboard'
import { About } from '../pages/About'
import { Settings } from '../pages/Settings'
import { LatestAddressesPage } from '../pages/LatestAddressesPage'
import { LatestUTXOsPage } from '../pages/LatestUTXOsPage'
import { LatestBlocksPage } from '../pages/LatestBlocksPage'
import { QbtcPage } from '../pages/QbtcPage'
import { QbtcBlockDetailPage } from '../pages/QbtcBlockDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'addresses',
        element: <LatestAddressesPage />
      },
      {
        path: 'utxos',
        element: <LatestUTXOsPage />
      },
      {
        path: 'blocks',
        element: <LatestBlocksPage />
      },
      {
        path: 'qbtc',
        element: <QbtcPage />
      },
      {
        path: 'qbtc/blocks/:id',
        element: <QbtcBlockDetailPage />
      }
    ]
  }
])
