import { useTheme } from "../../hooks/useTheme";

interface ThemeIconProps {
  isDarkMode: boolean;
}

function ThemeIcon({ isDarkMode }: ThemeIconProps) {
  if (isDarkMode) {
    // Show sun icon at night
    return (
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
    );
  } else {
    // Show moon icon during the day
    return (
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
    );
  }
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
      onClick={handleThemeClick}
      className={`p-1 rounded-full border border-border hover:border-foreground transition-colors flex items-center justify-center ${className}`}
      style={{ minWidth: 28, minHeight: 28 }}
      title="Click to toggle theme (Alt + click to toggle auto mode)"
    >
      <ThemeIcon isDarkMode={isDarkMode} />
    </button>
  );
}

interface ThemeIndicatorProps {
  variant?: "mobile" | "desktop" | "both";
  showInContent?: boolean;
}

export default function ThemeIndicator({
  variant = "both",
  showInContent = false,
}: ThemeIndicatorProps) {
  const { isDarkMode, themeMessage, handleThemeClick } = useTheme();

  const mobileStyles = showInContent
    ? "flex justify-center"
    : "block md:hidden w-full flex justify-center mt-8";

  return (
    <>
      {(variant === "mobile" || variant === "both") && (
        <div className={mobileStyles}>
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
        <div className="hidden md:flex fixed z-40 bottom-8 right-8 items-end gap-2">
          <div className="min-w-[2.5rem] text-center pb-[3px]">
            <span className="text-sm text-muted-foreground">NYC</span>
          </div>
          <div className="pt-[5px]">
            <ThemeButton
              isDarkMode={isDarkMode}
              handleThemeClick={handleThemeClick}
            />
          </div>
          <div className="min-w-[4rem] text-center pb-[3px]">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {themeMessage}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
