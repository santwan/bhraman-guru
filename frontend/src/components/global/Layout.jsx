// src/components/global/Layout.jsx
import Navbar from '@/components/navbar/Navbar.jsx'
import { Outlet } from 'react-router-dom'
import { Suspense } from 'react';
import LoadingAnimation from './LoadingAnimation';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white transition-colors duration-300 ease-in-out">
      <Navbar />
      <Suspense fallback={<LoadingAnimation/>}>
        <Outlet />
      </Suspense>
    </div>
  )
}

export default Layout
