import { useRef, useState, useLayoutEffect } from "react";
import { useAnimationFrame } from "motion/react";

interface SpinningCubeProps {
  onClick?: () => void;
  size?: number;
}

// Initial transform to prevent flash before animation starts
const getInitialTransform = () => {
  const rotate = Math.sin(0) * 100; // t=0
  const y = (1 + Math.sin(0)) * -10; // t=0
  return `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
};

export default function SpinningCube({
  onClick,
  size = 120,
}: SpinningCubeProps) {
  const cubeRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Mark as ready after first paint to enable smooth reveal
  useLayoutEffect(() => {
    // Use requestAnimationFrame to ensure DOM is painted
    const raf = requestAnimationFrame(() => {
      setIsReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useAnimationFrame((t: number) => {
    if (!cubeRef.current) return;

    const rotate = Math.sin(t / 10000) * 100;
    const y = (1 + Math.sin(t / 1000)) * -10;
    const transformValue = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
    cubeRef.current.style.transform = transformValue;
    // Safari-specific: ensure webkit prefix is set
    cubeRef.current.style.webkitTransform = transformValue;
  });

  const quarterSize = size / 4;

  return (
    <div
      className="cube-scene flex justify-center items-center cursor-pointer"
      onClick={onClick}
      style={{
        perspective: "800px",
        WebkitPerspective: "800px",
        perspectiveOrigin: "center center",
        WebkitPerspectiveOrigin: "center center",
        // Smooth fade-in to hide any initial frame glitches
        opacity: isReady ? 1 : 0,
        transition: "opacity 0.15s ease-out",
      }}
    >
      <div
        ref={cubeRef}
        className="cube"
        style={{
          width: size,
          height: size,
          position: "relative",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          // Set initial transform to match animation start state
          transform: getInitialTransform(),
        }}
      >
        {/* Front */}
        <div
          className="cube-side"
          style={{
            transform: `translateZ(${quarterSize}px)`,
            WebkitTransform: `translateZ(${quarterSize}px)`,
          }}
        />
        {/* Back */}
        <div
          className="cube-side"
          style={{
            transform: `rotateY(180deg) translateZ(${quarterSize}px)`,
            WebkitTransform: `rotateY(180deg) translateZ(${quarterSize}px)`,
          }}
        />
        {/* Left */}
        <div
          className="cube-side"
          style={{
            transform: `rotateY(-90deg) translateZ(${quarterSize}px)`,
            WebkitTransform: `rotateY(-90deg) translateZ(${quarterSize}px)`,
          }}
        />
        {/* Right */}
        <div
          className="cube-side"
          style={{
            transform: `rotateY(90deg) translateZ(${quarterSize}px)`,
            WebkitTransform: `rotateY(90deg) translateZ(${quarterSize}px)`,
          }}
        />
        {/* Top */}
        <div
          className="cube-side"
          style={{
            transform: `rotateX(90deg) translateZ(${quarterSize}px)`,
            WebkitTransform: `rotateX(90deg) translateZ(${quarterSize}px)`,
          }}
        />
        {/* Bottom */}
        <div
          className="cube-side"
          style={{
            transform: `rotateX(-90deg) translateZ(${quarterSize}px)`,
            WebkitTransform: `rotateX(-90deg) translateZ(${quarterSize}px)`,
          }}
        />
      </div>
    </div>
  );
}
