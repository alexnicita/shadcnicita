import { useState, useEffect, useCallback } from "react";
import SunCalc from "suncalc";
import { useTheme as useUiTheme } from "@/components/theme-provider";

const NYC_LOCATION = { lat: 40.7128, lng: -74.006 };

type Mode = "light" | "dark";

function getThemeMessage(now: Date, isDark: boolean) {
  const times = SunCalc.getTimes(now, NYC_LOCATION.lat, NYC_LOCATION.lng);
  let nextChange;
  if (isDark) {
    // Night: time until sunrise
    nextChange = times.sunrise;
  } else {
    // Day: time until sunset
    nextChange = times.sunset;
  }
  if (nextChange.getTime() - now.getTime() < 0) {
    nextChange = new Date(nextChange.getTime() + 24 * 60 * 60 * 1000);
  }
  const timeUntilChange = new Date(nextChange.getTime() - now.getTime());
  const hours = Math.floor(timeUntilChange.getTime() / (1000 * 60 * 60));
  const minutes = Math.floor(
    (timeUntilChange.getTime() % (1000 * 60 * 60)) / (1000 * 60)
  );

  // Pad both hours and minutes with leading zeros for consistent spacing
  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  return `${paddedHours}h ${paddedMinutes}m`;
}

const getSystemPreference = (): Mode => {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getInitialMode = (): Mode => {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem("vite-ui-theme") as Mode | "system" | null;
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return getSystemPreference();
};

export function useTheme() {
  const { theme: providerTheme, setTheme: setUiTheme } = useUiTheme();
  const [isAutoTheme, setIsAutoTheme] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    () => getInitialMode() === "dark"
  );
  const [themeMessage, setThemeMessage] = useState("");
  const applyMode = useCallback(
    (nextDark: boolean) => {
      setIsDarkMode(nextDark);
      setUiTheme(nextDark ? "dark" : "light");
    },
    [setUiTheme]
  );

  useEffect(() => {
    const updateTheme = () => {
      try {
        const now = new Date();
        const times = SunCalc.getTimes(now, NYC_LOCATION.lat, NYC_LOCATION.lng);
        const sunrise = new Date(times.sunrise.getTime() + 30 * 60000);
        const sunset = new Date(times.sunset.getTime() - 30 * 60000);
        const isDay = now > sunrise && now < sunset;
        if (isAutoTheme) {
          applyMode(!isDay);
        }
        setThemeMessage(
          getThemeMessage(now, isAutoTheme ? !isDay : isDarkMode)
        );
      } catch (error) {
        console.warn(
          "SunCalc failed, falling back to time-based theme:",
          error
        );
        // Fallback: use simple time-based logic (8am-8pm = light mode)
        const now = new Date();
        const hour = now.getHours();
        const isDay = hour >= 8 && hour < 20;
        if (isAutoTheme) {
          applyMode(!isDay);
        }
        setThemeMessage(
          getThemeMessage(now, isAutoTheme ? !isDay : isDarkMode)
        );
      }
    };
    updateTheme();
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, [applyMode, isAutoTheme, isDarkMode]);

  useEffect(() => {
    if (!isAutoTheme) {
      const now = new Date();
      setThemeMessage(getThemeMessage(now, isDarkMode));
    }
  }, [isDarkMode, isAutoTheme]);

  useEffect(() => {
    const detectModeFromProvider = () => {
      if (providerTheme === "dark") return "dark";
      if (providerTheme === "light") return "light";
      return getSystemPreference();
    };
    const resolved = detectModeFromProvider();
    setIsDarkMode(resolved === "dark");
  }, [providerTheme]);

  const handleThemeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.altKey) {
      setIsAutoTheme(!isAutoTheme);
    } else {
      const nextMode = !isDarkMode;
      applyMode(nextMode);
      if (isAutoTheme) {
        setIsAutoTheme(false);
      }
    }
  };

  return {
    isDarkMode,
    isAutoTheme,
    themeMessage,
    handleThemeClick,
    setIsDarkMode,
    setIsAutoTheme,
  };
}
