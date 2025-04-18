// src/components/global/Layout.jsx
import Navbar from './Navbar.jsx'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* This is where child routes will be rendered */}
    </>
  )
}

export default Layout
