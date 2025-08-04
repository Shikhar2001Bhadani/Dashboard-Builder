import { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { seasonalThemes } from "../../utils/themeUtils.js";

export default function ThemeSwitcher() {
  const { state, dispatch } = useDashboard();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const toggleTheme = () => {
    const newTheme = state.theme === "light" ? "dark" : "light";
    
    // If switching to dark mode, clear seasonal theme
    if (newTheme === "dark" && state.seasonalTheme) {
      dispatch({ type: "CLEAR_SEASONAL_THEME" });
    }
    
    dispatch({
      type: "SET_THEME",
      payload: newTheme,
    });
  };

  const setSeasonalTheme = (season) => {
    dispatch({
      type: "SET_SEASONAL_THEME",
      payload: season,
    });
    setShowThemeMenu(false);
  };

  const getCurrentThemeColors = () => {
    // If in dark mode, don't return seasonal theme colors
    if (state.theme === "dark") {
      return null;
    }
    
    if (state.seasonalTheme && seasonalThemes[state.seasonalTheme]) {
      return seasonalThemes[state.seasonalTheme].colors;
    }
    return null;
  };

  const currentThemeColors = getCurrentThemeColors();

  return (
    <div className="flex flex-col items-end gap-2">
      {/* Multiplayer Indicator */}
      {state.activeUsers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">
              {state.activeUsers.length} active user
              {state.activeUsers.length !== 1 ? "s" : ""}
            </span>
          </div>
          {state.lastModifiedBy && (
            <div className="text-xs opacity-75">
              Last modified by: {state.lastModifiedBy}
            </div>
          )}
        </div>
      )}

      {/* Seasonal Theme Menu */}
      {showThemeMenu && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-xs text-gray-600 dark:text-gray-300 min-w-[200px]">
          {state.theme === "dark" ? (
            <div className="text-center py-4">
              <div className="text-lg mb-2">🌙</div>
              <div className="font-medium mb-1">Dark Mode Active</div>
              <div className="text-xs opacity-75">
                Seasonal themes are only available in light mode
              </div>
              <button
                onClick={() => setShowThemeMenu(false)}
                className="mt-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="font-medium mb-2 text-center">Seasonal Themes</div>
              <div className="space-y-2">
                {Object.entries(seasonalThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setSeasonalTheme(key)}
                    className={`w-full flex items-center gap-2 p-2 rounded transition-colors duration-200 ${
                      state.seasonalTheme === key
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="text-lg">{theme.icon}</span>
                    <span>{theme.name}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2">
                <button
                  onClick={() => {
                    dispatch({ type: "CLEAR_SEASONAL_THEME" });
                    setShowThemeMenu(false);
                  }}
                  className="w-full text-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Reset to Default
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Theme Switcher Buttons */}
      <div className="flex gap-2">
        {/* Seasonal Theme Button */}
        <button
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          disabled={state.theme === "dark"}
          className={`p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border hover:scale-105 ${
            state.theme === "dark"
              ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
          }`}
          title={state.theme === "dark" ? "Seasonal themes only available in light mode" : "Seasonal Themes"}
        >
          {state.theme === "dark" ? (
            <span className="text-lg opacity-50">🌙</span>
          ) : state.seasonalTheme ? (
            <span className="text-lg">
              {seasonalThemes[state.seasonalTheme]?.icon || "🎨"}
            </span>
          ) : (
            <span className="text-lg">🎨</span>
          )}
        </button>

        {/* Light/Dark Mode Button */}
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:scale-105"
          title={
            state.theme === "light"
              ? "Switch to Dark Mode"
              : "Switch to Light Mode"
          }
        >
          {state.theme === "light" ? (
            // Moon icon for dark mode
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            // Sun icon for light mode
            <svg
              className="w-6 h-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
