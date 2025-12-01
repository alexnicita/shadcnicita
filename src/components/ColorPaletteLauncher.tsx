import { useEffect, useMemo, useRef, useState } from "react";

import { useThemeColor } from "@/components/shared/theme-color-provider";
import {
  DEFAULT_PALETTE_ID,
  THEME_PALETTES,
  PaletteId,
} from "@/constants/theme-palettes";
import { useTheme as useUiTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const computeOffsets = (count: number, spacing: number) => {
  if (count <= 1) return [0];
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

  const currentPalette = useMemo(
    () => THEME_PALETTES[paletteId],
    [paletteId]
  );
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
  const currentSwatchColor = getPreviewColor(paletteId, mode);
  const triggerSize = "h-5 w-5";
  const triggerOffset =
    variant === "inline" ? "translate-y-[2px]" : "-translate-y-[2px]";
  const rootClass =
    variant === "inline"
      ? "w-full flex justify-center"
      : "hidden md:flex fixed bottom-4 left-1/2 z-40 -translate-x-1/2 sm:bottom-6";
  const containerClass =
    variant === "inline"
      ? "relative h-10 w-20 translate-y-0.5"
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
    <div className={cn(rootClass, className)}>
      <div ref={containerRef} className={containerClass}>
        {paletteChoices.map((id, index) => {
          const palette = THEME_PALETTES[id];
          const offsetX = offsets[index] ?? 0;
          const isActive = paletteId === id;
          const previewColor = getPreviewColor(id, mode);

          return (
            <button
              key={id}
              aria-label={`Set theme to ${palette.label}`}
              onClick={() => handleSelect(id)}
              style={{
                backgroundColor: previewColor,
                transform: isExpanded
                  ? `translate(calc(-50% + ${offsetX}px), -50%) scale(1)`
                  : "translate(-50%, -50%) scale(0.3)",
                transitionDelay: `${index * 45}ms`,
              }}
              className={cn(
                "absolute left-1/2 top-1/2 h-5 w-5 rounded-full border border-border/50 shadow-[0_3px_8px_rgba(0,0,0,0.12)] outline-none transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                isExpanded ? "opacity-100" : "opacity-0",
                isActive && "ring-2 ring-ring ring-offset-2 ring-offset-background"
              )}
            />
          );
        })}

        <button
          type="button"
          aria-label={
            isExpanded
              ? "Collapse palette menu"
              : "Open palette menu. Double click to reset."
          }
          onClick={handleToggle}
          onDoubleClick={handleReset}
          style={{ backgroundColor: currentSwatchColor }}
          className={cn(
            "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 shadow-[0_6px_14px_rgba(0,0,0,0.18)] transition-all duration-200 ease-out",
            triggerSize,
            triggerOffset,
            isExpanded
              ? "scale-0 opacity-0"
              : cn(
                  "scale-100 opacity-100 border-border/40 ring-2 ring-ring/70 ring-offset-2 ring-offset-background",
                  triggerOffset
                )
          )}
        >
          <span className="sr-only">Open color palette</span>
        </button>
      </div>
    </div>
  );
}

