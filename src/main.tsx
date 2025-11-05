import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { HeroUIProvider } from '@heroui/react'
import './index.css'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
      <RouterProvider router={router} />
    </HeroUIProvider>
  </StrictMode>,
)
