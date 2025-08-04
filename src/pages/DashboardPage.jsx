import WidgetSidebar from "../components/sidebar/WidgetSidebar";
import Canvas from "../components/canvas/Canvas";
import PropertiesPanel from "../components/properties/PropertiesPanel";
import ThemeSwitcher from "../components/theming/ThemeSwitcher";
import Header from "../components/Header";
import Notification from "../components/Notification";
import { useDashboard } from "../context/DashboardContext";
import { getCurrentThemeColors } from "../utils/themeUtils.js";

export default function DashboardPage({ dashboardId }) {
  const { state } = useDashboard();
  const themeColors = getCurrentThemeColors(state.seasonalTheme, state.theme === "dark");

  // Show loading screen while dashboard is loading
  if (state.isLoading) {
    return (
      <div 
        className="flex flex-col h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300"
        style={{
          backgroundColor: themeColors?.background || (state.theme === "dark" ? "#111827" : "#FFFFFF"),
          color: themeColors?.text || (state.theme === "dark" ? "#F9FAFB" : "#111827")
        }}
      >
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading your dashboard...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Restoring your saved layout and widgets
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-screen transition-colors duration-300"
      style={{
        backgroundColor: themeColors?.background || (state.theme === "dark" ? "#111827" : "#FFFFFF"),
        color: themeColors?.text || (state.theme === "dark" ? "#F9FAFB" : "#111827")
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <WidgetSidebar />
        <Canvas />
        <PropertiesPanel />
      </div>

      {/* Theme Switcher */}
      <div className="absolute bottom-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* Notification Component */}
      <Notification />

      {/* Saving indicator */}
      {state.isSaving && (
        <div className="absolute bottom-4 left-4 z-50">
          <div 
            className="text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
            style={{ backgroundColor: themeColors?.primary || "#3B82F6" }}
          >
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            <span>Saving...</span>
          </div>
        </div>
      )}
    </div>
  );
}
