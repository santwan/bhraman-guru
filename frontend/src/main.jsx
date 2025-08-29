import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'   // 🔥 move css into /styles
import AppRouter from './routes/AppRouter.jsx'  // centralized routes
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>
)
