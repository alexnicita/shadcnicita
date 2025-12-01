import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_PALETTE_ID,
  THEME_PALETTES,
  ThemePalette,
  PaletteId,
} from "@/constants/theme-palettes";
import { useTheme } from "@/components/theme-provider";

type ThemeColorContextValue = {
  paletteId: PaletteId;
  palette: ThemePalette;
  setPalette: (id: PaletteId) => void;
  paletteChoices: PaletteId[];
};

const ThemeColorContext = createContext<ThemeColorContextValue | null>(null);

const generateChoices = (activeId: PaletteId): PaletteId[] => {
  const pool = Object.keys(THEME_PALETTES).filter(
    (id) => id !== activeId
  ) as PaletteId[];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return [activeId, ...pool.slice(0, 2)];
};

const getResolvedMode = (theme: "light" | "dark" | "system") => {
  if (theme === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
};

const applyTokens = (palette: ThemePalette, mode: "light" | "dark") => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  Object.entries(palette.tokens[mode]).forEach(([token, value]) => {
    root.style.setProperty(`--${token}`, value);
  });
};

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [paletteId, setPaletteId] = useState<PaletteId>(DEFAULT_PALETTE_ID);
  const [paletteChoices, setPaletteChoices] = useState<PaletteId[]>(() =>
    generateChoices(DEFAULT_PALETTE_ID)
  );
  const { theme } = useTheme();
  const palette = useMemo(() => THEME_PALETTES[paletteId], [paletteId]);

  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateMode = () => setResolvedMode(getResolvedMode(theme));
    updateMode();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", updateMode);
      return () => media.removeEventListener("change", updateMode);
    }
    media.addListener(updateMode);
    return () => media.removeListener(updateMode);
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.dataset.themeColor = paletteId;
    applyTokens(palette, resolvedMode);
  }, [palette, paletteId, resolvedMode]);

  useEffect(() => {
    setPaletteId(DEFAULT_PALETTE_ID);
    setPaletteChoices(generateChoices(DEFAULT_PALETTE_ID));
  }, [theme]);

  const setPalette = useCallback((id: PaletteId) => {
    setPaletteId(id);
    setPaletteChoices(generateChoices(id));
  }, []);

  const value = useMemo(
    () => ({
      paletteId,
      palette,
      setPalette,
      paletteChoices,
    }),
    [palette, paletteChoices, paletteId, setPalette]
  );

  return (
    <ThemeColorContext.Provider value={value}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const context = useContext(ThemeColorContext);
  if (!context) {
    throw new Error("useThemeColor must be used within ThemeColorProvider");
  }
  return context;
}

