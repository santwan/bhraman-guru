// Import necessary libraries and components from React and other files.

// StrictMode is a tool for highlighting potential problems in an application.
// It activates additional checks and warnings for its descendants.
import { StrictMode } from 'react';

// createRoot is the new API for rendering a React application.
// It enables concurrent features.
import { createRoot } from 'react-dom/client';

// Import global styles for the application.
// This ensures that the base styles are available everywhere.
import '@/styles/index.css';

// Import the main application router.
// AppRouter will handle all the routing logic for the application,
// determining which page or component to show based on the URL.
import AppRouter from '@/routes/AppRouter.jsx';

// Import the AuthProvider.
// This is a context provider that will wrap the application and
// make authentication state (like the current user) available
// to all components that need it.
import { AuthProvider } from '@/context/AuthContext.jsx';

// Import the AuthModalProvider.
// This provider will manage the state of the authentication modal,
// making it accessible throughout the entire application.
import { AuthModalProvider } from '@/context/AuthModalContext.jsx';

// Get the root DOM element where the React app will be mounted.
// This is typically a div with an id of 'root' in the index.html file.
const rootElement = document.getElementById('root');

// Create a root for the React application.
const root = createRoot(rootElement);

// Render the application into the root element.
root.render(
  // Wrap the entire application in StrictMode.
  // This helps with identifying and fixing potential problems during development.
  <StrictMode>
    {
      /*
        Wrap the application with the AuthProvider.
        This makes the authentication context (e.g., currentUser) available
        to all components within the application.
      */
    }
    <AuthProvider>
      {
        /*
          Wrap the application with the AuthModalProvider.
          This allows any component to control the visibility of the
          authentication modal, which is crucial for features like protected routes.
        */
      }
      <AuthModalProvider>
        {
          /*
            The AppRouter component is the main entry point for the application's UI.
            It will render the correct page based on the current URL path.
          */
        }
        <AppRouter />
      </AuthModalProvider>
    </AuthProvider>
  </StrictMode>
);
