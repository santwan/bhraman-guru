import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Home from '../pages/Home.jsx'
import CreateTrip from '../pages/CreateTrip.jsx'
import MyTrips from '../pages/MyTrips.jsx'
import TripHistory from '../pages/TripHistory.jsx'


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        children: [
            {path: '/', element: <Home/> },
            {path: '/create-trip', element: <CreateTrip/> },
            {path: '/my-trips', element: <MyTrips/> },
            {path: '/trip-history', element: <TripHistory/> }
        ]
    }
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}