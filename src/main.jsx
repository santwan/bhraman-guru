import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CreateTrip from './pages/create-trip/CreateTrip.jsx'
import Navbar from './components/global/Navbar.jsx'
import { Toaster } from "@/components/ui/sonner.jsx"

const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>,
  },
  {
    path:'/create-trip',
    element:<CreateTrip/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar/>
    <Toaster/>
    <RouterProvider router={router} />
  </StrictMode>,
)
