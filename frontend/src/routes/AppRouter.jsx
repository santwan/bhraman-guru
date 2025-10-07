/**
 * ! File Name: AppRouter.jsx
 *
 * ? Purpose:
 * - Centralized route definition for application using react-router v6
 * - Keeps route strtucture declarative ( array of route objects) so it's easy to read
 * - , test and extend ( eg: - for role based routes, code-splitting, or localized routes )
 *
 *
 * ? Notes:
 * - Protected pages is used to guard the pages that require authentication
 * - Auth Modal is rendered at the app level ( outside the Router Provider ) and controlled
 * - by a context (`useAuthModal`) so it can be opened from anywhere without changing routes
 * -
 */

import {React, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Context hook to control the global auth modal visibility
import { useAuthModal } from '@/context/authModal';

// Route guard wrapper that blocks unauthenticated access
import ProtectedRoute from '@/routes/ProtectedRoute.jsx';

// Application Layout is imported directly to prevent it from being part of the loading flash
import Layout from '@/components/global/Layout.jsx';
import { lazyWithMinDuration } from '@/utils/lazyWithMinDuration.js';

// Pages are lazy-loaded for better performance
const Home = lazyWithMinDuration(() => import('@/pages/home/Home.jsx'))
const CreateTrip = lazyWithMinDuration(() => import('@/pages/createTrip/CreateTrip.jsx'))
const MyTrips = lazyWithMinDuration(() => import('@/pages/MyTrips.jsx'))
const TripHistory = lazyWithMinDuration(() => import('@/pages/TripHistory.jsx'))
const ViewTrip = lazyWithMinDuration(() => import('@/pages/viewTrip/ViewTrip.jsx'))
const Profile = lazyWithMinDuration(() => import('@/pages/Profile.jsx'))
const Auth = lazyWithMinDuration(() => import('@/components/auth/Auth.jsx')) // Auth Modal component

/**
 * --------------------------------------------------------------------------------
 * NotFound/ Error UI: used both as an explicit 404 UI and as `errorElement`
 * --------------------------------------------------------------------------------
 */
function NotFound() {
  return (
  <div className="min-h-screen flex items-center justify-center p-6">
    <div className="max-w-lg text-center">
      <h1 className="text-3xl font-semibold mb-4">Page not found</h1>
      <p className="text-sm text-muted-foreground mb-6">
      The page you were looking for does not exist or an error occurred.
      </p>
      <a href="/" className="underline">
      Go back home
      </a>
    </div>
  </div>
);
}

/**
 * ------------------------------------------------------
 * ROUTES: central route definitions ( declarative array )
 * ------------------------------------------------------
 *
 * - Root Route: path '/' , element <Layout/>. Layout includes and outlet where child route elements render
 * - Children are nested routes: they inherit the layout and share layout level UI
 * - Each protected route is wrapped with <ProtectedRoute/> , so the guard logic is colocated
 * - Keep route meta-data ( like permissions or breadcrumbs ) nearby if needed later.
 */

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound/>,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/create-trip',
        element: (
          <ProtectedRoute>
            {<CreateTrip />}
          </ProtectedRoute>
        ),
      },
      {
        path: '/create-trip/view-trip',
        element: (
          <ProtectedRoute>
            <ViewTrip />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-trips',
        element: (
          <ProtectedRoute>
            <MyTrips />
          </ProtectedRoute>
        ),
      },
      {
        path: '/trip-history',
        element: (
          <ProtectedRoute>
            <TripHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function AppRouter() {
  const { authModalOpen, setAuthModalOpen } = useAuthModal();

  return (
    <>
        <RouterProvider router={router}/>
        {authModalOpen && (
            <Suspense>
                <Auth setAuthModalOpen={setAuthModalOpen} />
            </Suspense>
        )}
    </>
  );
}
