// Import necessary libraries and components from React and other files.

// StrictMode is a tool for highlighting potential problems in an application.
// It activates additional checks and warnings for its descendants.
import { StrictMode } from 'react';

// createRoot is the new API for rendering a React application.
// It enables concurrent features.
import { createRoot } from 'react-dom/client';

// Import global styles for the application.
import '@/styles/index.css';

// Import the Toaster component from react-hot-toast for displaying notifications.
import { Toaster } from 'react-hot-toast';

// Import the main application router.
import AppRouter from '@/routes/AppRouter.jsx';

// Import the AuthProvider to make authentication state available.
import { AuthProvider } from '@/context/auth';

// Import the AuthModalProvider to manage the authentication modal state.
import { AuthModalProvider } from '@/context/authModal';

// Get the root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');

// Create a root for the React application.
const root = createRoot(rootElement);

// Render the application into the root element.
root.render(
  <StrictMode>
    <AuthProvider>
      <AuthModalProvider>
        <AppRouter />
        {/* Toaster component from react-hot-toast is rendered here */}
        <Toaster />
      </AuthModalProvider>
    </AuthProvider>
  </StrictMode>
);
