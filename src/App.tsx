import "./App.css";
import BaseLayout from "./components/shared/BaseLayout";
import ColorPaletteLauncher from "./components/ColorPaletteLauncher";
import SpinningCube from "./components/SpinningCube";

function App() {
  return (
    <BaseLayout className="p-8 md:px-16 md:pb-16 md:pt-8">
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

      {/* Color palette selector - Desktop only (bottom center) */}
      <ColorPaletteLauncher />
    </BaseLayout>
  );
}

export default App;
