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

const NYC_LOCATION = { lat: 40.7128, lng: -74.006 };

function isDaytime(): boolean {
  try {
    const now = new Date();
    const times = SunCalc.getTimes(now, NYC_LOCATION.lat, NYC_LOCATION.lng);
    const sunrise = new Date(times.sunrise.getTime() + 30 * 60000);
    const sunset = new Date(times.sunset.getTime() - 30 * 60000);
    return now > sunrise && now < sunset;
  } catch {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 19;
  }
}

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
    return defaultTheme === "system" ? getTimeBasedTheme() : defaultTheme;
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
