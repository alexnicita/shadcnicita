import { useState, useEffect } from "react";
import SunCalc from "suncalc";
import "./App.css";

const NYC_LOCATION = { lat: 40.7128, lng: -74.006 };

function LoadingAnimation() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="relative w-24 h-24">
        {/* Outer circle */}
        <svg
          className="absolute inset-0 animate-spin-slow"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="stroke-muted-foreground/20"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="2"
          />
          <circle
            className="stroke-foreground"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="2"
            strokeDasharray="283"
            strokeDashoffset="283"
            style={{
              animation: "draw 2s ease-out forwards",
            }}
          />
        </svg>

        {/* Inner elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 relative">
            <div className="absolute inset-0 animate-pulse-slow">
              <div className="w-full h-full border-2 border-foreground rounded-full opacity-0 animate-fade-in" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-foreground text-sm font-medium animate-fade-in-delayed">
                an
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  return `${hours}h ${minutes}m`;
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAutoTheme, setIsAutoTheme] = useState(true);
  const [themeMessage, setThemeMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      const now = new Date();
      const times = SunCalc.getTimes(now, NYC_LOCATION.lat, NYC_LOCATION.lng);
      const sunrise = new Date(times.sunrise.getTime() + 30 * 60000);
      const sunset = new Date(times.sunset.getTime() - 30 * 60000);
      const isDay = now > sunrise && now < sunset;
      if (isAutoTheme) {
        setIsDarkMode(!isDay);
      }
      setThemeMessage(getThemeMessage(now, isAutoTheme ? !isDay : isDarkMode));
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

  return (
    <>
      {isLoading && <LoadingAnimation />}
      <div
        className={`min-h-screen bg-background text-foreground p-8 md:p-16 transition-colors duration-200 relative ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-1000`}
      >
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold">alexander nicita</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-sm hover:text-muted-foreground transition-colors"
            >
              menu
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto">
          <section className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              today: <br />
              <span className="text-muted-foreground">
                alexploring the intersection of capital & technology
              </span>
            </h2>
            <p className="text-muted-foreground mb-8 mt-16">
              currently: <br />
              <span className="text-foreground">
                <a
                  href="https://en.wikipedia.org/wiki/Special_situation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-muted-foreground transition-colors"
                >
                  special situations
                </a>{" "}
                strategy consultant
              </span>
            </p>
            <p className="text-muted-foreground mb-8">
              previously: <br />
              <span className="text-foreground">
                software engineer at startups
              </span>
            </p>
          </section>

          <nav className={`${isMenuOpen ? "block" : "hidden"} space-y-4`}>
            <a
              href="https://ans.consulting"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              consulting
            </a>
            <a
              href="https://academiccommons.columbia.edu/doi/10.7916/wxey-cr42"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              thesis
            </a>
            <a
              href="https://alexnicita.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              os
            </a>
          </nav>

          <footer className="mt-16 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              raising $?{" "}
              <a
                href="mailto:alex@nicita.cc"
                className="hover:text-muted-foreground transition-colors"
              >
                email <span className="underline">alex@nicita.cc</span>
              </a>
            </p>
            <div className="mt-4">
              <a
                href="https://x.com/nicitaalex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors mr-4"
              >
                x
              </a>
              <a
                href="https://linkedin.com/in/alexander-nicita"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors mr-4"
              >
                linkedin
              </a>
              <a
                href="https://github.com/alexnicita"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                github
              </a>
            </div>
          </footer>
        </main>

        {/* Sunrise/Sunset indicator: responsive placement */}
        {/* On mobile, show as a row at the bottom of main content. On md+, fixed bottom right. */}
        <div>
          {/* Mobile: show inside main content, centered, only on small screens */}
          <div className="block md:hidden w-full flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground lowercase">
                nyc
              </span>
              <button
                onClick={handleThemeClick}
                className="p-1 rounded-full border border-border hover:border-foreground transition-colors flex items-center justify-center"
                style={{ minWidth: 28, minHeight: 28 }}
                title="Click to toggle theme (Alt + click to toggle auto mode)"
              >
                {isDarkMode ? (
                  // Show sun icon at night
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                ) : (
                  // Show moon icon during the day
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                )}
              </button>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {themeMessage}
              </span>
            </div>
          </div>
          {/* Desktop: fixed bottom right, hidden on mobile */}
          <div className="hidden md:flex fixed z-40 bottom-8 right-8 items-center gap-2">
            <span className="text-sm text-muted-foreground lowercase">nyc</span>
            <button
              onClick={handleThemeClick}
              className="p-1 rounded-full border border-border hover:border-foreground transition-colors flex items-center justify-center"
              style={{ minWidth: 28, minHeight: 28 }}
              title="Click to toggle theme (Alt + click to toggle auto mode)"
            >
              {isDarkMode ? (
                // Show sun icon at night
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                // Show moon icon during the day
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {themeMessage}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
