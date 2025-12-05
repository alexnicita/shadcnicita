import { useState, useEffect } from "react";
import "./App.css";
import BaseLayout from "./components/shared/BaseLayout";
import ColorPaletteLauncher from "./components/ColorPaletteLauncher";
import SpinningCube from "./components/SpinningCube";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showCube, setShowCube] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // Show cube first
      setShowCube(true);
    }, 2000);
    return () => clearTimeout(loadingTimer);
  }, []);

  // After cube fades in, show the header text
  useEffect(() => {
    if (showCube) {
      const headerTimer = setTimeout(() => {
        setShowHeader(true);
      }, 1600); // Delay after cube appears
      return () => clearTimeout(headerTimer);
    }
  }, [showCube]);

  return (
    <BaseLayout
      showLoading={isLoading}
      showUIElements={showHeader}
      className="p-8 md:px-16 md:pb-16 md:pt-8"
    >
      {/* Fixed header - never moves */}
      {showHeader && (
        <div className="fixed top-8 left-8 md:left-16 z-50 animate-fade-in">
          <h1 className="text-2xl font-bold">alexander nicita</h1>
        </div>
      )}

      {/* Cube - fixed center, doesn't affect layout */}
      {showCube && (
        <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none animate-fade-in">
          <div className="pointer-events-auto">
            <SpinningCube />
          </div>
        </div>
      )}

      {/* Color palette selector - Desktop only (bottom center) */}
      {showHeader && <ColorPaletteLauncher />}
    </BaseLayout>
  );
}

export default App;
