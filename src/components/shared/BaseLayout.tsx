import { ReactNode, useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import ThemeIndicator from "./ThemeIndicator";
import LoadingAnimation from "./LoadingAnimation";
import CornerInfo from "../CornerInfo";

interface BaseLayoutProps {
  children: ReactNode;
  showLoading?: boolean;
  showThemeIndicator?: boolean;
  showUIElements?: boolean;
  className?: string;
  loadingText?: string;
  afterThemeIndicator?: ReactNode;
}

export default function BaseLayout({
  children,
  showLoading = false,
  showThemeIndicator = true,
  showUIElements = true,
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
        className={`site-frame-grid min-h-screen bg-background text-foreground transition-colors duration-200 relative flex flex-col ${
          contentReady ? "animate-fade-in-content" : "opacity-0"
        } ${className}`}
      >
        <div className="flex-1">
          {children}
        </div>

        {showUIElements && (
          <div className="animate-fade-in">
            <CornerInfo variant="desktop" />
          </div>
        )}

        {showThemeIndicator && showUIElements && (
          <>
            <div className="md:hidden mt-12 pb-8 flex flex-col items-center gap-2 animate-fade-in">
              <ThemeIndicator variant="mobile" showInContent />
              {afterThemeIndicator}
              <CornerInfo variant="mobile-social" />
            </div>
            <div className="animate-fade-in">
              <ThemeIndicator variant="desktop" />
            </div>
          </>
        )}
      </div>
    </>
  );
}
