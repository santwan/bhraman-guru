import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import UserDropdown from "../UserDropdown.jsx";
import LoginButton from "../LoginButton.jsx";
import SignupButton from "../SignupButton.jsx";
import { navConfig } from "../../utils/navConfig.js";

export default function MobileMenu({ setMenuOpen }) {
  const { currentUser } = useAuth();

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
        <>
          <LoginButton />
          <SignupButton />
        </>
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
