import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle.jsx";
import { useAuth } from "@/context/auth";
import { useAuthModal } from "@/context/authModal";
import UserDropdown from "@/components/UserDropdown.jsx";
import { navConfig } from "@/utils/navConfig.js";

export default function MobileMenu({ setMenuOpen }) {
  const { currentUser } = useAuth();
  const { setAuthModalOpen } = useAuthModal();

  const handleAuthClick = () => {
    setAuthModalOpen(true);
    setMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="lg:hidden bg-white dark:bg-[#0d0d0d] px-4 pb-6 flex flex-col space-y-4 text-[#1A4D8F] dark:text-[#F2E1C1]"
    >
      <div className="pt-8">
        <ThemeToggle />
      </div>

      {currentUser ? (
        <UserDropdown />
      ) : (
        <button
          onClick={handleAuthClick}
          className="flex items-center p-2 text-lg hover:scale-105 transition"
        >
          Login / Sign Up
        </button>
      )}

      {navConfig.map(({ label, to, isLive }) => (
        <Link
          key={label}
          to={to}
          onClick={() => setMenuOpen(false)}
          className="flex items-center p-2 text-lg hover:scale-105 transition"
        >
          {label}
          {isLive && (
            <span className="ml-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          )}
        </Link>
      ))}
    </motion.div>
  );
}
