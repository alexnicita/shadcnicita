import { useRef } from "react";
import { useAnimationFrame } from "motion/react";

interface SpinningCubeProps {
  onClick?: () => void;
  size?: number;
}

export default function SpinningCube({
  onClick,
  size = 120,
}: SpinningCubeProps) {
  const cubeRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((t: number) => {
    if (!cubeRef.current) return;

    const rotate = Math.sin(t / 10000) * 100;
    const y = (1 + Math.sin(t / 1000)) * -10;
    cubeRef.current.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
  });

  const quarterSize = size / 4;

  return (
    <div
      className="flex justify-center items-center cursor-pointer min-h-[50vh]"
      onClick={onClick}
      style={{ perspective: "800px" }}
    >
      <div
        ref={cubeRef}
        className="cube"
        style={{
          width: size,
          height: size,
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front */}
        <div
          className="cube-side"
          style={{
            transform: `translateZ(${quarterSize}px)`,
          }}
        />
        {/* Back */}
        <div
          className="cube-side"
          style={{
            transform: `rotateY(180deg) translateZ(${quarterSize}px)`,
          }}
        />
        {/* Left */}
        <div
          className="cube-side"
          style={{
            transform: `rotateY(-90deg) translateZ(${quarterSize}px)`,
          }}
        />
        {/* Right */}
        <div
          className="cube-side"
          style={{
            transform: `rotateY(90deg) translateZ(${quarterSize}px)`,
          }}
        />
        {/* Top */}
        <div
          className="cube-side"
          style={{
            transform: `rotateX(90deg) translateZ(${quarterSize}px)`,
          }}
        />
        {/* Bottom */}
        <div
          className="cube-side"
          style={{
            transform: `rotateX(-90deg) translateZ(${quarterSize}px)`,
          }}
        />
      </div>
    </div>
  );
}
