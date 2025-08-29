import ThemeToggle from "../ThemeToggle.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import UserDropdown from "../UserDropdown.jsx";
import LoginButton from "../LoginButton.jsx";
import SignupButton from "../SignupButton.jsx";

export default function AuthSection({ hidden }) {
  const { currentUser } = useAuth();

  return (
    <div
      className={`hidden lg:flex items-center space-x-2 transition-opacity duration-300 ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <ThemeToggle />
      {currentUser ? (
        <UserDropdown />
      ) : (
        <>
          <LoginButton />
          <SignupButton />
        </>
      )}
    </div>
  );
}
