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
      <div className={animationClass}>
        <CornerInfo variant="desktop" fixedDesktop />
      </div>
      {showThemeIndicator && (
        <div className={animationClass}>
          <ThemeIndicator variant="desktop" fixedDesktop />
        </div>
      )}
    </>
  );
}
