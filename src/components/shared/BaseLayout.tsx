import { ReactNode } from "react";
import { useTheme } from "../../hooks/useTheme";
import ThemeIndicator from "./ThemeIndicator";
import LoadingAnimation from "./LoadingAnimation";

interface BaseLayoutProps {
  children: ReactNode;
  showLoading?: boolean;
  showThemeIndicator?: boolean;
  className?: string;
  loadingText?: string;
  afterThemeIndicator?: ReactNode;
}

export default function BaseLayout({
  children,
  showLoading = false,
  showThemeIndicator = true,
  className = "",
  loadingText = "an",
  afterThemeIndicator,
}: BaseLayoutProps) {
  // Ensure theme is applied across all pages
  useTheme();

  return (
    <>
      {showLoading && <LoadingAnimation text={loadingText} />}
      <div
        className={`min-h-screen bg-background text-foreground transition-colors duration-200 relative ${
          showLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-1000 ${className}`}
      >
        {children}

        {showThemeIndicator && <ThemeIndicator />}

        {afterThemeIndicator}
      </div>
    </>
  );
}
