// Seasonal theme configurations
export const seasonalThemes = {
  spring: {
    name: "Spring",
    icon: "🌸",
    colors: {
      primary: "#10B981", // Emerald green
      secondary: "#F59E0B", // Amber
      accent: "#EC4899", // Pink
      background: "#F0FDF4", // Light green background
      surface: "#FFFFFF",
      text: "#1F2937",
      border: "#D1FAE5",
      hover: "#059669",
    },
    darkColors: {
      primary: "#10B981", // Emerald green
      secondary: "#F59E0B", // Amber
      accent: "#EC4899", // Pink
      background: "#0F172A", // Dark blue background
      surface: "#1E293B", // Dark surface
      text: "#F1F5F9", // Light text
      border: "#334155", // Dark border
      hover: "#059669",
    }
  },
  summer: {
    name: "Summer",
    icon: "☀️",
    colors: {
      primary: "#3B82F6", // Blue
      secondary: "#F59E0B", // Amber
      accent: "#10B981", // Green
      background: "#EFF6FF", // Light blue background
      surface: "#FFFFFF",
      text: "#1F2937",
      border: "#DBEAFE",
      hover: "#2563EB",
    },
    darkColors: {
      primary: "#3B82F6", // Blue
      secondary: "#F59E0B", // Amber
      accent: "#10B981", // Green
      background: "#0F172A", // Dark blue background
      surface: "#1E293B", // Dark surface
      text: "#F1F5F9", // Light text
      border: "#334155", // Dark border
      hover: "#2563EB",
    }
  },
  autumn: {
    name: "Autumn",
    icon: "🍂",
    colors: {
      primary: "#F97316", // Orange
      secondary: "#DC2626", // Red
      accent: "#A855F7", // Purple
      background: "#FEF3C7", // Light yellow background
      surface: "#FFFFFF",
      text: "#1F2937",
      border: "#FDE68A",
      hover: "#EA580C",
    },
    darkColors: {
      primary: "#F97316", // Orange
      secondary: "#DC2626", // Red
      accent: "#A855F7", // Purple
      background: "#1C1917", // Dark brown background
      surface: "#292524", // Dark surface
      text: "#F1F5F9", // Light text
      border: "#44403C", // Dark border
      hover: "#EA580C",
    }
  },
  winter: {
    name: "Winter",
    icon: "❄️",
    colors: {
      primary: "#64748B", // Slate
      secondary: "#3B82F6", // Blue
      accent: "#8B5CF6", // Purple
      background: "#F8FAFC", // Light gray background
      surface: "#FFFFFF",
      text: "#1F2937",
      border: "#E2E8F0",
      hover: "#475569",
    },
    darkColors: {
      primary: "#64748B", // Slate
      secondary: "#3B82F6", // Blue
      accent: "#8B5CF6", // Purple
      background: "#0F172A", // Dark blue background
      surface: "#1E293B", // Dark surface
      text: "#F1F5F9", // Light text
      border: "#334155", // Dark border
      hover: "#475569",
    }
  }
};

// Apply seasonal theme to the document
export const applySeasonalTheme = (season, isDark = false) => {
  // If in dark mode, don't apply seasonal themes
  if (isDark) {
    // Remove any existing seasonal theme
    document.documentElement.style.removeProperty('--seasonal-primary');
    document.documentElement.style.removeProperty('--seasonal-secondary');
    document.documentElement.style.removeProperty('--seasonal-accent');
    document.documentElement.style.removeProperty('--seasonal-background');
    document.documentElement.style.removeProperty('--seasonal-surface');
    document.documentElement.style.removeProperty('--seasonal-text');
    document.documentElement.style.removeProperty('--seasonal-border');
    document.documentElement.style.removeProperty('--seasonal-hover');
    return;
  }

  if (!season || !seasonalThemes[season]) {
    // Remove any existing seasonal theme
    document.documentElement.style.removeProperty('--seasonal-primary');
    document.documentElement.style.removeProperty('--seasonal-secondary');
    document.documentElement.style.removeProperty('--seasonal-accent');
    document.documentElement.style.removeProperty('--seasonal-background');
    document.documentElement.style.removeProperty('--seasonal-surface');
    document.documentElement.style.removeProperty('--seasonal-text');
    document.documentElement.style.removeProperty('--seasonal-border');
    document.documentElement.style.removeProperty('--seasonal-hover');
    return;
  }

  const colors = seasonalThemes[season].colors;
  
  // Apply CSS custom properties
  document.documentElement.style.setProperty('--seasonal-primary', colors.primary);
  document.documentElement.style.setProperty('--seasonal-secondary', colors.secondary);
  document.documentElement.style.setProperty('--seasonal-accent', colors.accent);
  document.documentElement.style.setProperty('--seasonal-background', colors.background);
  document.documentElement.style.setProperty('--seasonal-surface', colors.surface);
  document.documentElement.style.setProperty('--seasonal-text', colors.text);
  document.documentElement.style.setProperty('--seasonal-border', colors.border);
  document.documentElement.style.setProperty('--seasonal-hover', colors.hover);
  
  // Apply background color to body
  document.body.style.backgroundColor = colors.background;
};

// Get current theme colors
export const getCurrentThemeColors = (season, isDark = false) => {
  // If in dark mode, don't return seasonal theme colors
  if (isDark) {
    return null;
  }
  
  if (!season || !seasonalThemes[season]) {
    return null;
  }
  return seasonalThemes[season].colors;
}; 