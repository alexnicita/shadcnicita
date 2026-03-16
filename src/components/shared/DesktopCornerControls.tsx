import CornerInfo from "../CornerInfo";
import ThemeIndicator from "./ThemeIndicator";

interface DesktopCornerControlsProps {
  showThemeIndicator?: boolean;
  enableEntranceAnimation?: boolean;
}

export default function DesktopCornerControls({
  showThemeIndicator = true,
  enableEntranceAnimation = false,
}: DesktopCornerControlsProps) {
  const animationClass = enableEntranceAnimation ? "animate-fade-in" : "";

  return (
    <>
      <CornerInfo
        variant="desktop"
        fixedDesktop
        className={animationClass}
      />
      {showThemeIndicator && (
        <ThemeIndicator
          variant="desktop"
          fixedDesktop
          className={animationClass}
        />
      )}
    </>
  );
}
