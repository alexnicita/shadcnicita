import { ReactNode, useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import ThemeIndicator from "./ThemeIndicator";
import LoadingAnimation from "./LoadingAnimation";
import CornerInfo from "../CornerInfo";
import DesktopCornerControls from "./DesktopCornerControls";

interface BaseLayoutProps {
  children: ReactNode;
  showLoading?: boolean;
  showThemeIndicator?: boolean;
  showUIElements?: boolean;
  enableEntranceAnimation?: boolean;
  className?: string;
  loadingText?: string;
  afterThemeIndicator?: ReactNode;
  stickyMobileFooter?: boolean;
}

export default function BaseLayout({
  children,
  showLoading = false,
  showThemeIndicator = true,
  showUIElements = true,
  enableEntranceAnimation = false,
  className = "",
  loadingText = "an",
  afterThemeIndicator,
  stickyMobileFooter = false,
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
          contentReady
            ? enableEntranceAnimation
              ? "animate-fade-in-content"
              : "opacity-100"
            : "opacity-0"
        } ${className}`}
      >
        <div className="flex-1">
          {children}
        </div>

        {!stickyMobileFooter && showUIElements && (
          <>
            <DesktopCornerControls
              showThemeIndicator={showThemeIndicator}
              enableEntranceAnimation={enableEntranceAnimation}
            />
            {showThemeIndicator && (
              <div
                className={`md:hidden mt-12 pb-8 flex flex-col items-center gap-2 ${
                  enableEntranceAnimation ? "animate-fade-in" : ""
                }`}
              >
                <ThemeIndicator variant="mobile" showInContent />
                {afterThemeIndicator}
                <CornerInfo variant="mobile-social" />
              </div>
            )}
          </>
        )}

        {stickyMobileFooter && showUIElements && (
          <div
            className={`mt-24 pt-8 ${
              enableEntranceAnimation ? "animate-fade-in" : ""
            }`}
          >
            <DesktopCornerControls
              showThemeIndicator={showThemeIndicator}
              enableEntranceAnimation={enableEntranceAnimation}
            />

            {showThemeIndicator && (
              <div className="md:hidden pb-10 flex flex-col items-center gap-2">
                <ThemeIndicator variant="mobile" showInContent />
                {afterThemeIndicator}
                <CornerInfo variant="mobile-social" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
