import { useAuth } from "@/context/AuthContext.jsx";
import { useAuthModal } from "@/context/AuthModalContext.jsx";
import UserDropdown from "@/components/UserDropdown.jsx";
import ThemeToggle from "@/components/ThemeToggle.jsx";

const LoginButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="px-4 py-2 rounded-md font-semibold bg-[#1A4D8F] text-white hover:bg-opacity-90"
  >
    Login
  </button>
);

export default function AuthSection() {
  const { currentUser } = useAuth();
  const { setAuthModalOpen } = useAuthModal();

  return (
    <div className="flex items-center space-x-4">
      {currentUser ? (
        <UserDropdown />
      ) : (
        <LoginButton onClick={() => setAuthModalOpen(true)} />
      )}
      <ThemeToggle />
    </div>
  );
}
