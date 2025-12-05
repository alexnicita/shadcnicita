import "./App.css";
import BaseLayout from "./components/shared/BaseLayout";
import ColorPaletteLauncher from "./components/ColorPaletteLauncher";
import CornerInfo from "./components/CornerInfo";
import SpinningCube from "./components/SpinningCube";
import ThemeIndicator from "./components/shared/ThemeIndicator";

function App() {
  return (
    <BaseLayout
      className="p-8 md:px-16 md:pb-16 md:pt-8"
      showThemeIndicator={false}
    >
      {/* Fixed header */}
      <div className="fixed top-8 left-8 md:left-16 z-50 animate-fade-in">
        <h1 className="text-2xl font-bold">alexander nicita</h1>
      </div>

      {/* Cube - fixed center */}
      <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none animate-fade-in">
        <div className="pointer-events-auto">
          <SpinningCube />
        </div>
      </div>

      {/* Desktop: Bottom corner information - Ramp Labs style */}
      <CornerInfo variant="desktop" />

      {/* Desktop: Color palette selector (bottom center) */}
      <ColorPaletteLauncher />

      {/* Desktop: Theme indicator (bottom right) */}
      <div className="hidden md:block animate-fade-in">
        <ThemeIndicator variant="desktop" />
      </div>

      {/* Mobile: Bottom section - stacked vertically, centered */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-6 flex flex-col items-center gap-4 animate-fade-in">
        {/* Text content */}
        <CornerInfo variant="mobile" />

        {/* Theme indicator (centered) */}
        <ThemeIndicator variant="mobile" showInContent />
      </div>
    </BaseLayout>
  );
}

export default App;
