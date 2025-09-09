import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/components/Layout.jsx';
import Home from '@/pages/Home.jsx';
import CreateTrip from '@/pages/createTrip/CreateTrip.jsx';
import MyTrips from '@/pages/MyTrips.jsx';
import TripHistory from '@/pages/TripHistory.jsx';
import Profile from '@/pages/Profile.jsx';
import Auth from '@/components/auth/Auth.jsx';
import { useAuthModal } from '@/context/authModal';
import ProtectedRoute from '@/routes/ProtectedRoute.jsx';
import ViewTrip from '@/pages/ViewTrip.jsx';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/create-trip',
        element: (
          <ProtectedRoute>
            <CreateTrip />
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
        path: '/login'
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
      <RouterProvider router={router} />
      {authModalOpen && <Auth setAuthModalOpen={setAuthModalOpen} />}
    </>
  );
}
