import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

interface ThemeIconProps {
  isDarkMode: boolean;
}

function ThemeIcon({ isDarkMode }: ThemeIconProps) {
  return (
    <span className="relative inline-grid h-[13px] w-[13px] place-items-center">
      <Sun
        size={13}
        strokeWidth={1.85}
        className={`absolute inset-0 m-auto transition-opacity duration-150 ${isDarkMode ? "opacity-0" : "opacity-100"}`}
        aria-hidden="true"
      />
      <Moon
        size={13}
        strokeWidth={1.85}
        className={`absolute inset-0 m-auto transition-opacity duration-150 ${isDarkMode ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      />
    </span>
  );
}

interface ThemeButtonProps {
  isDarkMode: boolean;
  handleThemeClick: (e: React.MouseEvent) => void;
  className?: string;
}

function ThemeButton({
  isDarkMode,
  handleThemeClick,
  className = "",
}: ThemeButtonProps) {
  return (
    <button
      type="button"
      onClick={handleThemeClick}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDarkMode}
      className={`p-1 rounded-full border border-muted-foreground/45 text-muted-foreground hover:scale-[1.04] hover:text-foreground hover:border-foreground/55 focus-visible:text-foreground focus-visible:border-foreground/55 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200 flex items-center justify-center leading-none ${className}`}
      style={{ minWidth: 28, minHeight: 28 }}
      title={`Switch to ${isDarkMode ? "light" : "dark"} mode (Alt + click toggles automatic NYC daylight mode)`}
    >
      <ThemeIcon isDarkMode={isDarkMode} />
    </button>
  );
}

interface ThemeIndicatorProps {
  variant?: "mobile" | "desktop" | "both";
  showInContent?: boolean;
  fixedDesktop?: boolean;
  className?: string;
}

export default function ThemeIndicator({
  variant = "both",
  showInContent = false,
  fixedDesktop = true,
  className = "",
}: ThemeIndicatorProps) {
  const { isDarkMode, themeMessage, handleThemeClick } = useTheme();

  const mobileStyles = showInContent
    ? "flex justify-center"
    : "block md:hidden w-full flex justify-center mt-8";

  return (
    <>
      {(variant === "mobile" || variant === "both") && (
        <div className={`${mobileStyles} ${className}`.trim()}>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">NYC</span>
            <ThemeButton
              isDarkMode={isDarkMode}
              handleThemeClick={handleThemeClick}
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {themeMessage}
            </span>
          </div>
        </div>
      )}

      {(variant === "desktop" || variant === "both") && !showInContent && (
        <div
          className={
            fixedDesktop
              ? `hidden md:flex fixed z-40 bottom-8 right-8 items-center gap-1.5 ${className}`
              : `hidden md:flex items-center gap-1.5 ${className}`
          }
        >
          <div className="min-w-[2.3rem] text-center theme-time-font">
            <span className="text-sm text-muted-foreground">NYC</span>
          </div>
          <div>
            <ThemeButton
              isDarkMode={isDarkMode}
              handleThemeClick={handleThemeClick}
            />
          </div>
          <div className="min-w-[3.8rem] text-center theme-time-font">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {themeMessage}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
