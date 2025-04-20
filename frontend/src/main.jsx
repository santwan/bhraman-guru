import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CreateTrip from './pages/create-trip/CreateTrip.jsx'
import Layout from './components/global/Layout.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner.jsx"
import { ClerkProvider } from '@clerk/clerk-react'
import MyTrips from './pages/my-trips/MyTrips.jsx'
import TripHistory from './pages/my-trips/trip-history/TripHistory.jsx'
import BlogPage from './pages/blog/BlogPage.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Shared layout for all child routes
    children: [
      {
        path: '/',
        element: <App />
      },
      {
        path: '/create-trip',
        element: <CreateTrip />
      },
      {
        path: '/my-trips',
        element: <MyTrips />
      },
      {
        path: '/trip-history',
        element: <TripHistory/>
      },
      {
        path: '/blog',
        element: <BlogPage/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Toaster />
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
)
