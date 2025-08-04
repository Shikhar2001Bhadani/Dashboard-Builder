import { useActiveUsers } from "../../context/ActiveUsersContext";
import { useDashboard } from "../../context/DashboardContext";
import { getCurrentThemeColors } from "../../utils/themeUtils.js";

export default function ActiveUsersWidget() {
  const { activeUsersCount } = useActiveUsers();
  const { state } = useDashboard();
  const themeColors = getCurrentThemeColors(state.seasonalTheme);

  return (
    <div 
      className="p-6 rounded-lg shadow-sm border transition-colors duration-300"
      style={{
        backgroundColor: themeColors?.surface || (state.theme === "dark" ? "#1F2937" : "#FFFFFF"),
        borderColor: themeColors?.border || (state.theme === "dark" ? "#374151" : "#E5E7EB"),
        color: themeColors?.text || (state.theme === "dark" ? "#F9FAFB" : "#111827")
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Active Users</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            Live
          </span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: themeColors?.primary || "#3B82F6" }}>
          {activeUsersCount}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {activeUsersCount === 1 ? 'user' : 'users'} currently online
        </p>
      </div>

      <div className="mt-6 pt-4 border-t" style={{ borderColor: themeColors?.border || (state.theme === "dark" ? "#374151" : "#E5E7EB") }}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Status</span>
          <span className="text-green-600 dark:text-green-400 font-medium">
            Real-time tracking
          </span>
        </div>
      </div>
    </div>
  );
} 