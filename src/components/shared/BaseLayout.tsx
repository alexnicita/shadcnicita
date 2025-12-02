import { ReactNode, useState, useEffect } from "react";
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

  const [contentReady, setContentReady] = useState(!showLoading);

  useEffect(() => {
    if (!showLoading && !contentReady) {
      setContentReady(true);
    }
  }, [showLoading, contentReady]);

  return (
    <>
      {showLoading && <LoadingAnimation text={loadingText} />}
      <div
        className={`min-h-screen bg-background text-foreground transition-colors duration-200 relative flex flex-col ${
          contentReady ? "animate-fade-in-content" : "opacity-0"
        } ${className}`}
      >
        <div className="flex-1">
          {children}
        </div>

        {showThemeIndicator ? (
          <>
            <div className="md:hidden mt-16 pb-8 flex flex-col items-start gap-2 relative z-20">
              <ThemeIndicator variant="mobile" showInContent />
              {afterThemeIndicator}
            </div>
            <ThemeIndicator variant="desktop" />
          </>
        ) : (
          afterThemeIndicator
        )}
      </div>
    </>
  );
}
