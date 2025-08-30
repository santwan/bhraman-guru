import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { useAuthModal } from '@/context/AuthModalContext.jsx';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const { setAuthModalOpen } = useAuthModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      // If the user is not logged in, redirect to the homepage
      navigate('/');
      // And open the authentication modal
      setAuthModalOpen(true);
    }
  }, [currentUser, navigate, setAuthModalOpen]);

  // If the user is logged in, render the component that was passed as children
  return currentUser ? children : null;
}
