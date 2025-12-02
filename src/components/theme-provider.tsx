import { createContext, useContext, useEffect, useState } from "react";
import SunCalc from "suncalc";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * Determines if it's currently daytime based on the user's local time.
 * Uses SunCalc with an approximate latitude based on timezone offset
 * to get more accurate sunrise/sunset times.
 */
function isDaytime(): boolean {
  try {
    const now = new Date();
    
    // Approximate latitude from timezone offset
    // This gives a rough estimate: UTC+0 ≈ 51° (London), further offsets adjust accordingly
    // Most populated areas are between 25° and 60° latitude
    const timezoneOffset = now.getTimezoneOffset(); // in minutes, negative for east of UTC
    // Rough heuristic: map timezone to latitude (not perfect but reasonable)
    // Timezone offsets range from -720 to +840 minutes
    // We'll use a simple approximation centering around 40° latitude
    const estimatedLat = 40; // Use 40° as a reasonable middle-ground latitude
    const estimatedLng = -timezoneOffset / 4; // Convert minutes to rough longitude
    
    const times = SunCalc.getTimes(now, estimatedLat, estimatedLng);
    
    // Add 30-minute buffer after sunrise, before sunset for a more natural transition
    const sunrise = new Date(times.sunrise.getTime() + 30 * 60000);
    const sunset = new Date(times.sunset.getTime() - 30 * 60000);
    
    return now > sunrise && now < sunset;
  } catch {
    // Fallback: use simple time-based logic (6am-7pm = light mode)
    const hour = new Date().getHours();
    return hour >= 6 && hour < 19;
  }
}

/**
 * Gets the theme based on time of day.
 * Light mode during daytime, dark mode at night.
 */
function getTimeBasedTheme(): Theme {
  return isDaytime() ? "light" : "dark";
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      // If user has explicitly set a preference (light or dark), use it
      if (stored === "light" || stored === "dark") {
        return stored;
      }
      // Otherwise, determine theme based on time of day
      return getTimeBasedTheme();
    } catch (error) {
      console.warn("localStorage not available:", error);
      // Fallback to time-based theme
      return getTimeBasedTheme();
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      // Use time-based theme instead of browser preference
      const timeBasedTheme = getTimeBasedTheme();
      root.classList.add(timeBasedTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        console.warn("localStorage not available for writing:", error);
      }
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
