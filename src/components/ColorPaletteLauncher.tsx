import { useEffect, useMemo, useRef, useState } from "react";

import { useThemeColor } from "@/components/shared/theme-color-provider";
import {
  DEFAULT_PALETTE_ID,
  THEME_PALETTES,
  PaletteId,
} from "@/constants/theme-palettes";
import { useTheme as useUiTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const computeOffsets = (count: number, spacing: number, alignLeft = false) => {
  if (count <= 1) return [0];
  if (alignLeft) {
    // Start at 0 and extend to the right
    return Array.from({ length: count }, (_, index) => index * spacing);
  }
  // Center the items
  const start = -((count - 1) / 2) * spacing;
  return Array.from({ length: count }, (_, index) => start + index * spacing);
};

const getPreviewColor = (id: PaletteId, mode: "light" | "dark") => {
  const palette = THEME_PALETTES[id];
  if (!palette) return "#000";
  if (id === DEFAULT_PALETTE_ID) {
    return mode === "dark" ? palette.preview.light : palette.preview.dark;
  }
  return palette.preview[mode];
};

type ColorPaletteLauncherProps = {
  variant?: "floating" | "inline";
  className?: string;
};

export default function ColorPaletteLauncher({
  variant = "floating",
  className,
}: ColorPaletteLauncherProps) {
  const { paletteId, setPalette, paletteChoices } = useThemeColor();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const spacing = variant === "inline" ? 32 : 44;
  const offsets = useMemo(
    () => computeOffsets(paletteChoices.length, spacing),
    [paletteChoices.length, spacing]
  );
  const { theme: baseTheme } = useUiTheme();
  const isDarkMode =
    baseTheme === "dark" ||
    (baseTheme === "system"
      ? typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      : false);
  const mode: "light" | "dark" = isDarkMode ? "dark" : "light";
  const activePalette = THEME_PALETTES[paletteId];
  const currentSwatchColor = getPreviewColor(paletteId, mode);
  const triggerSize = "h-5 w-5";
  const triggerOffset = "-translate-y-[10px]";
  const rootClass =
    variant === "inline"
      ? "flex w-full justify-center"
      : "hidden md:flex fixed bottom-4 left-1/2 z-40 -translate-x-1/2 sm:bottom-6";
  const containerClass =
    variant === "inline"
      ? "relative h-10 w-24 translate-y-0.5"
      : "relative h-12 w-24";

  useEffect(() => {
    if (!isExpanded) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isExpanded]);

  const handleSelect = (id: PaletteId) => {
    setPalette(id);
    setIsExpanded(false);
  };

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleReset = () => {
    setPalette(DEFAULT_PALETTE_ID);
    setIsExpanded(false);
  };

  return (
    <div className={cn(rootClass, className)} data-nosnippet>
      <div
        ref={containerRef}
        className={containerClass}
        role="group"
        aria-label="Theme color palette"
      >
        {paletteChoices.map((id, index) => {
          const palette = THEME_PALETTES[id];
          const offsetX = offsets[index] ?? 0;
          const isActive = paletteId === id;
          const previewColor = getPreviewColor(id, mode);

          return (
            <button
              key={id}
              type="button"
              aria-label={`Set theme to ${palette.label}`}
              aria-pressed={isActive}
              aria-hidden={!isExpanded}
              disabled={!isExpanded}
              tabIndex={isExpanded ? 0 : -1}
              onClick={() => handleSelect(id)}
              style={{
                backgroundColor: previewColor,
                transform: isExpanded
                  ? `translate(calc(-50% + ${offsetX}px), -50%) scale(1)`
                  : "translate(-50%, -50%) scale(0.3)",
                transitionDelay: `${index * 45}ms`,
              }}
              title={palette.description}
              className={cn(
                "absolute top-1/2 h-5 w-5 rounded-full border border-border/20 shadow-sm outline-none transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] hover:scale-110 hover:border-border/60 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none",
                "left-1/2",
                isExpanded ? "opacity-100" : "opacity-0",
                isActive && "ring-1 ring-foreground/20 ring-offset-1 ring-offset-background"
              )}
            />
          );
        })}
        <button
          type="button"
          aria-label={
            isExpanded
              ? "Collapse color palette"
              : `Open color palette. Current palette: ${activePalette.label}. Double click to reset to ${THEME_PALETTES[DEFAULT_PALETTE_ID].label}.`
          }
          aria-expanded={isExpanded}
          onClick={handleToggle}
          onDoubleClick={handleReset}
          style={{ backgroundColor: currentSwatchColor }}
          title={
            isExpanded
              ? "Collapse color palette"
              : `Open color palette. Double click to reset to ${THEME_PALETTES[DEFAULT_PALETTE_ID].label}.`
          }
          className={cn(
            "absolute top-1/2 flex items-center justify-center rounded-full border border-border/35 shadow-sm transition-all duration-200 ease-out hover:scale-105 hover:border-border/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "left-1/2 -translate-x-1/2 -translate-y-1/2",
            triggerSize,
            triggerOffset,
            isExpanded
              ? "scale-0 opacity-0"
              : cn(
                  "scale-100 opacity-100 ring-1 ring-foreground/15 ring-offset-1 ring-offset-background",
                  triggerOffset
                )
          )}
        >
          <span className="sr-only">Color palette</span>
        </button>
      </div>
    </div>
  );
}
