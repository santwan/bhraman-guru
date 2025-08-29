// src/components/global/Layout.jsx
import Navbar from '../components/navbar/Navbar.jsx'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#0d0d0d] dark:text-white transition-colors duration-300 ease-in-out">
      <Navbar />
      <Outlet /> {/* This is where child routes will be rendered */}
    </div>
  )
}

export default Layout
