import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Dashboard } from '../pages/Dashboard'
import { About } from '../pages/About'
import { Settings } from '../pages/Settings'

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
      }
    ]
  }
])
