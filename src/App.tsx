import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { useCallback, useEffect, useRef, useState } from "react";
import BaseLayout from "./components/shared/BaseLayout";
import ColorPaletteLauncher from "./components/ColorPaletteLauncher";
import CornerInfo from "./components/CornerInfo";
import SpinningCube from "./components/SpinningCube";
import PrimaryLinks from "./components/shared/PrimaryLinks";
import ThemeIndicator from "./components/shared/ThemeIndicator";
import { useSeo } from "./lib/seo";

const DISPLAY_NAME = "alexander nicita";
let hasAnimatedHomeOnce = false;
const MAX_CUBES = 5;
const CUBE_SIZE = 120;

interface CubeInstance {
  id: number;
  x: number;
  y: number;
  isDeleting?: boolean;
}

const DELETE_FADE_MS = 150;

const clampCubePosition = (x: number, y: number) => {
  const maxX = Math.max(window.innerWidth - CUBE_SIZE, 0);
  const maxY = Math.max(window.innerHeight - CUBE_SIZE, 0);
  return {
    x: Math.min(Math.max(x, 0), maxX),
    y: Math.min(Math.max(y, 0), maxY),
  };
};

function App() {
  const shouldAnimateEntrance = !hasAnimatedHomeOnce;
  const nextCubeId = useRef(1);
  const [cubes, setCubes] = useState<CubeInstance[]>(() => {
    const centeredX = (window.innerWidth - CUBE_SIZE) / 2;
    const centeredY = (window.innerHeight - CUBE_SIZE) / 2;
    const centered = clampCubePosition(centeredX, centeredY);
    return [{ id: 0, x: centered.x, y: centered.y }];
  });

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

  const handleCreateCube = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      setCubes((prev) => {
        if (prev.length >= MAX_CUBES) return prev;
        const spawned = clampCubePosition(
          event.clientX - CUBE_SIZE / 2,
          event.clientY - CUBE_SIZE / 2
        );
        return [
          ...prev,
          {
            id: nextCubeId.current++,
            x: spawned.x,
            y: spawned.y,
          },
        ];
      });
    },
    []
  );

  const handleDeleteCube = useCallback((id: number) => {
    let shouldScheduleRemoval = false;

    setCubes((prev) => {
      const target = prev.find((cube) => cube.id === id);
      if (!target || target.isDeleting) return prev;
      shouldScheduleRemoval = true;
      return prev.map((cube) =>
        cube.id === id ? { ...cube, isDeleting: true } : cube
      );
    });

    if (shouldScheduleRemoval) {
      window.setTimeout(() => {
        setCubes((prev) => prev.filter((cube) => cube.id !== id));
      }, DELETE_FADE_MS);
    }
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
          <div className="md:hidden mt-1 ml-[1pt]">
            <PrimaryLinks className="w-max" align="center" />
          </div>
          <div className="hidden md:flex absolute left-0 top-full mt-3 w-full justify-center">
            <PrimaryLinks className="w-max" />
          </div>
        </div>

        {/* Cube - fixed center. Wrapper uses pointer-events-none so bottom-left/right UI stays hoverable/clickable; inner layer and cubes capture events. */}
        <div
          className={`fixed inset-0 z-10 pointer-events-none ${
            shouldAnimateEntrance ? "animate-fade-in" : ""
          }`}
        >
          <div
            className="absolute inset-0 pointer-events-auto"
            onClick={handleCreateCube}
            aria-hidden
          />
          {cubes.map((cube) => (
            <SpinningCube
              key={cube.id}
              size={CUBE_SIZE}
              initialPosition={{ x: cube.x, y: cube.y }}
              onDelete={() => handleDeleteCube(cube.id)}
              isDeleting={cube.isDeleting}
            />
          ))}
        </div>

        {/* Desktop: Color palette selector (bottom center) */}
        <ColorPaletteLauncher />

        {/* Desktop: Theme indicator (bottom right) */}
        <ThemeIndicator
          variant="desktop"
          className={shouldAnimateEntrance ? "animate-fade-in" : ""}
        />

        {/* Mobile: Bottom section - stacked vertically, centered */}
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 z-40 pb-6 flex flex-col items-center gap-2.5 ${
            shouldAnimateEntrance ? "animate-fade-in" : ""
          }`}
        >
          {/* Theme indicator (centered) */}
          <ThemeIndicator variant="mobile" showInContent />

          {/* Social links below timezone on mobile */}
          <CornerInfo variant="mobile-social" className="mt-1" />

          {/* Mobile: color palette at the bottom of the stack */}
          <ColorPaletteLauncher variant="inline" />
        </div>
      </BaseLayout>
      <Analytics />
    </>
  );
}

export default App;
