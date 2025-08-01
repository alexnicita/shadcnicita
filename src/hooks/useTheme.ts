import { useState, useEffect } from "react";
import SunCalc from "suncalc";

const LA_LOCATION = { lat: 34.0522, lng: -118.2437 };

function getThemeMessage(now: Date, isDark: boolean) {
  const times = SunCalc.getTimes(now, LA_LOCATION.lat, LA_LOCATION.lng);
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

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAutoTheme, setIsAutoTheme] = useState(true);
  const [themeMessage, setThemeMessage] = useState("");

  useEffect(() => {
    const updateTheme = () => {
      try {
        const now = new Date();
        const times = SunCalc.getTimes(now, LA_LOCATION.lat, LA_LOCATION.lng);
        const sunrise = new Date(times.sunrise.getTime() + 30 * 60000);
        const sunset = new Date(times.sunset.getTime() - 30 * 60000);
        const isDay = now > sunrise && now < sunset;
        if (isAutoTheme) {
          setIsDarkMode(!isDay);
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
          setIsDarkMode(!isDay);
        }
        setThemeMessage(
          getThemeMessage(now, isAutoTheme ? !isDay : isDarkMode)
        );
      }
    };
    updateTheme();
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, [isAutoTheme, isDarkMode]);

  useEffect(() => {
    if (!isAutoTheme) {
      const now = new Date();
      setThemeMessage(getThemeMessage(now, isDarkMode));
    }
  }, [isDarkMode, isAutoTheme]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleThemeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.altKey) {
      setIsAutoTheme(!isAutoTheme);
    } else {
      setIsDarkMode(!isDarkMode);
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
