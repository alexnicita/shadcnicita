import { useState, useEffect, useCallback } from "react";
import SunCalc from "suncalc";
import { useTheme as useUiTheme } from "@/components/theme-provider";

type Mode = "light" | "dark";

const NYC_LOCATION = { lat: 40.7128, lng: -74.006 };

function isNycDaytime(now: Date): boolean {
  try {
    const times = SunCalc.getTimes(now, NYC_LOCATION.lat, NYC_LOCATION.lng);
    const sunrise = new Date(times.sunrise.getTime() + 30 * 60000);
    const sunset = new Date(times.sunset.getTime() - 30 * 60000);
    return now > sunrise && now < sunset;
  } catch {
    const hour = now.getHours();
    return hour >= 6 && hour < 19;
  }
}

function getThemeMessage(now: Date, isDark: boolean) {
  let nextChange: Date;

  try {
    const times = SunCalc.getTimes(now, NYC_LOCATION.lat, NYC_LOCATION.lng);
    nextChange = isDark ? times.sunrise : times.sunset;

    if (nextChange.getTime() <= now.getTime()) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = SunCalc.getTimes(
        tomorrow,
        NYC_LOCATION.lat,
        NYC_LOCATION.lng
      );
      nextChange = isDark ? tomorrowTimes.sunrise : tomorrowTimes.sunset;
    }
  } catch {
    nextChange = new Date(now);
    if (isDark) {
      nextChange.setHours(6, 0, 0, 0);
    } else {
      nextChange.setHours(19, 0, 0, 0);
    }
    if (nextChange <= now) {
      nextChange.setDate(nextChange.getDate() + 1);
    }
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
  return isNycDaytime(new Date()) ? "light" : "dark";
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
      const now = new Date();
      const isDay = isNycDaytime(now);
      if (isAutoTheme) {
        applyMode(!isDay);
      }
      setThemeMessage(
        getThemeMessage(now, isAutoTheme ? !isDay : isDarkMode)
      );
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
