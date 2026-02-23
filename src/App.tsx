import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import * as opentype from "opentype.js";
import { useEffect, useState } from "react";
import signatureFontUrl from "./assets/NothingYouCouldDo.ttf";
import BaseLayout from "./components/shared/BaseLayout";
import ColorPaletteLauncher from "./components/ColorPaletteLauncher";
import CornerInfo from "./components/CornerInfo";
import SpinningCube from "./components/SpinningCube";
import PrimaryLinks from "./components/shared/PrimaryLinks";
import ThemeIndicator from "./components/shared/ThemeIndicator";

const DISPLAY_NAME = "ALEXANDER NICITA";

interface SignatureGeometry {
  pathData: string;
  viewBox: string;
  widthRatio: number;
  segments: Array<{
    start: number;
    end: number;
  }>;
  revealTrackWidth: number;
}

function SignatureDraw({ text }: { text: string }) {
  const [geometry, setGeometry] = useState<SignatureGeometry | null>(null);
  const [revealProgress, setRevealProgress] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    opentype.load(signatureFontUrl, (err, font) => {
      if (isCancelled || err || !font) {
        return;
      }

      const fontSize = 172;
      const padding = 7;
      const scale = fontSize / font.unitsPerEm;
      const ascent = font.ascender * scale;
      const descent = Math.abs(font.descender * scale);
      const viewBoxY = fontSize - ascent - padding;
      const viewBoxHeight = ascent + descent + padding * 2;

      let cursorX = 0;
      const segments: Array<{ start: number; end: number }> = [];
      for (const char of text) {
        const glyph = font.charToGlyph(char);
        const advanceWidth = Math.max(
          1,
          (glyph.advanceWidth ?? font.unitsPerEm * 0.45) * scale
        );
        if (char.trim().length > 0) {
          segments.push({ start: cursorX, end: cursorX + advanceWidth });
        }
        cursorX += advanceWidth;
      }

      const fullPath = font.getPath(text, 0, fontSize, fontSize);
      const bounds = fullPath.getBoundingBox();
      const left = bounds.x1 - padding;
      const right = bounds.x2 + padding;
      const width = Math.max(1, right - left);

      setGeometry({
        pathData: fullPath.toPathData(3),
        viewBox: `${left} ${viewBoxY} ${width} ${viewBoxHeight}`,
        widthRatio: width / viewBoxHeight,
        segments,
        revealTrackWidth: Math.max(1, cursorX),
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [text]);

  useEffect(() => {
    if (!geometry) {
      return;
    }

    setRevealProgress(0);

    const durationMs = 2800;
    let rafId = 0;
    let startTime = 0;
    let lastTime = 0;
    let progress = 0;

    const step = (now: number) => {
      if (!startTime) {
        startTime = now;
      }
      if (!lastTime) {
        lastTime = now;
      }

      const deltaMs = now - lastTime;
      lastTime = now;

      // Human-like tempo changes: subtle accelerations and settles while always moving forward.
      const phase = now - startTime;
      const speedVariation =
        0.98 + 0.23 * Math.sin(phase / 180) + 0.12 * Math.sin(phase / 63);
      const speedMultiplier = Math.max(0.62, Math.min(1.45, speedVariation));
      progress = Math.min(1, progress + (deltaMs / durationMs) * speedMultiplier);

      const eased = progress * progress * (3 - 2 * progress);
      setRevealProgress(eased);

      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [geometry]);

  return (
    <span className="handwritten-title signature-layer">
      {geometry && (() => {
        const segmentCount = geometry.segments.length;
        const segmentProgress = revealProgress * segmentCount;
        const currentIndex = Math.min(
          Math.max(Math.floor(segmentProgress), 0),
          Math.max(segmentCount - 1, 0)
        );
        const withinSegment = Math.max(0, Math.min(1, segmentProgress - currentIndex));

        const revealX =
          segmentCount === 0
            ? geometry.revealTrackWidth
            : currentIndex >= segmentCount
              ? geometry.segments[segmentCount - 1].end
              : geometry.segments[currentIndex].start +
                (geometry.segments[currentIndex].end - geometry.segments[currentIndex].start) *
                  withinSegment;

        const revealRatio = Math.max(
          0,
          Math.min(1, revealX / geometry.revealTrackWidth)
        );

        return (
          <svg
            className="signature-svg"
            viewBox={geometry.viewBox}
            style={{
              width: `${geometry.widthRatio}em`,
              clipPath: `inset(0 ${100 - revealRatio * 100}% 0 0)`,
            }}
            preserveAspectRatio="xMinYMid meet"
            aria-hidden="true"
          >
            <path d={geometry.pathData} className="signature-fill" />
          </svg>
        );
      })()}
    </span>
  );
}

function App() {
  return (
    <>
    <BaseLayout
      className="site-static-screen p-8 md:px-16 md:pb-16 md:pt-8"
      showThemeIndicator={false}
    >
      {/* Fixed header */}
      <div className="fixed top-8 left-4 md:top-12 md:left-8 z-50 w-max">
        <h1 className="title-animation-shell text-[1.7rem] font-bold tracking-[0.02em]">
          <SignatureDraw text={DISPLAY_NAME} />
        </h1>
        <div className="hidden md:flex absolute left-0 top-full mt-3 w-full justify-center">
          <PrimaryLinks className="w-max" />
        </div>
      </div>

      {/* Cube - fixed center */}
      <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none animate-fade-in">
        <div className="pointer-events-auto">
          <SpinningCube />
        </div>
      </div>

      {/* Desktop: Color palette selector (bottom center) */}
      <ColorPaletteLauncher />

      {/* Desktop: Theme indicator (bottom right) */}
      <div className="hidden md:block animate-fade-in">
        <ThemeIndicator variant="desktop" />
      </div>

      {/* Mobile: Bottom section - stacked vertically, centered */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-10 flex flex-col items-center gap-4 animate-fade-in">
        {/* Text content */}
        <CornerInfo variant="mobile" />

        {/* Theme indicator (centered) */}
        <ThemeIndicator variant="mobile" showInContent />

        {/* Social links below timezone on mobile */}
        <CornerInfo variant="mobile-social" />
      </div>
    </BaseLayout>
    <Analytics />
    </>
  );
}

export default App;
