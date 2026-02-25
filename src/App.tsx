import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import BaseLayout from "./components/shared/BaseLayout";
import ColorPaletteLauncher from "./components/ColorPaletteLauncher";
import CornerInfo from "./components/CornerInfo";
import SpinningCube from "./components/SpinningCube";
import PrimaryLinks from "./components/shared/PrimaryLinks";
import ThemeIndicator from "./components/shared/ThemeIndicator";
import { useSeo } from "./lib/seo";

const DISPLAY_NAME = "alexander nicita";
let hasAnimatedHomeOnce = false;

function App() {
  const shouldAnimateEntrance = !hasAnimatedHomeOnce;

  useSeo({
    title: "Alexander Nicita",
    description: "Welcome. Essays, notes, and projects by Alexander Nicita.",
    path: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Alexander Nicita",
      url: `${window.location.origin}/`,
    },
  });

  useEffect(() => {
    hasAnimatedHomeOnce = true;
  }, []);

  return (
    <>
      <BaseLayout
        className="site-static-screen p-8 md:px-16 md:pb-16 md:pt-8"
        showThemeIndicator={false}
        enableEntranceAnimation={shouldAnimateEntrance}
      >
        {/* Fixed header */}
        <div className="fixed top-8 left-1/2 -translate-x-1/2 text-center md:text-left md:top-12 md:left-8 md:translate-x-0 z-50 w-max">
          <h1 className="text-[1.7rem] font-semibold tracking-[-0.01em]">
            <a
              href="https://alexnicita.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground transition-colors cursor-pointer"
            >
              {DISPLAY_NAME}
            </a>
          </h1>
          <div className="md:hidden mt-1">
            <PrimaryLinks className="w-max" align="center" />
          </div>
          <div className="hidden md:flex absolute left-0 top-full mt-3 w-full justify-center">
            <PrimaryLinks className="w-max" />
          </div>
        </div>

        {/* Cube - fixed center */}
        <div
          className={`fixed inset-0 flex items-center justify-center z-10 pointer-events-none ${
            shouldAnimateEntrance ? "animate-fade-in" : ""
          }`}
        >
          <div className="pointer-events-auto">
            <SpinningCube />
          </div>
        </div>

        {/* Desktop: Color palette selector (bottom center) */}
        <ColorPaletteLauncher />

        {/* Desktop: Theme indicator (bottom right) */}
        <div className={`hidden md:block ${shouldAnimateEntrance ? "animate-fade-in" : ""}`}>
          <ThemeIndicator variant="desktop" />
        </div>

        {/* Mobile: Bottom section - stacked vertically, centered */}
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 z-40 pb-8 flex flex-col items-center gap-2.5 ${
            shouldAnimateEntrance ? "animate-fade-in" : ""
          }`}
        >
          {/* Theme indicator (centered) */}
          <ThemeIndicator variant="mobile" showInContent />

          {/* Social links below timezone on mobile */}
          <CornerInfo variant="mobile-social" />

          {/* Mobile: color palette at the bottom of the stack */}
          <ColorPaletteLauncher variant="inline" />
        </div>
      </BaseLayout>
      <Analytics />
    </>
  );
}

export default App;
