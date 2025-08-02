import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import { logOut } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { getCurrentThemeColors } from "../utils/themeUtils.js";

export default function Header() {
  const { user } = useAuth();
  const { state } = useDashboard();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const themeColors = getCurrentThemeColors(state.seasonalTheme);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUserInitials = (email) => {
    return email.split("@")[0].slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = (email) => {
    return email.split("@")[0];
  };

  return (
    <header 
      className="border-b shadow-sm"
      style={{
        backgroundColor: themeColors?.surface || (state.theme === "dark" ? "#1F2937" : "#FFFFFF"),
        borderColor: themeColors?.border || (state.theme === "dark" ? "#374151" : "#E5E7EB")
      }}
    >
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand - Left End */}
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          
          {/* Auto-save indicator */}
          <div className="ml-4 flex items-center space-x-2">
            {state.isSaving && (
              <div className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <span>Saving...</span>
              </div>
            )}
            {!state.isSaving && !state.isLoading && (
              <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                <span>Saved</span>
              </div>
            )}
          </div>
        </div>

        {/* User Menu - Right Side */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {/* User Avatar */}
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {getUserInitials(user?.email)}
              </span>
            </div>

            {/* User Info - Only Username */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {getUserDisplayName(user?.email)}
              </p>
            </div>

            {/* Dropdown Arrow */}
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="py-1">
                {/* User Info in Dropdown - Only Username */}
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {getUserDisplayName(user?.email)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Auto-save enabled
                  </p>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for closing dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
}
