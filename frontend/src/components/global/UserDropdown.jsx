
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { LogOut, History, User } from 'lucide-react';

const UserDropdown = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleTripHistory = () => {
    navigate("/trip-history");
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <User className="w-5 h-5" />
        </button>
      </div>

      {/* Dropdown menu */}
      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <button
            onClick={handleTripHistory}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <History className="mr-3 h-5 w-5 text-gray-400" />
            <span>Trip History</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
