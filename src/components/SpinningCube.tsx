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

  useAnimationFrame((t) => {
    if (!cubeRef.current) return;

    const rotate = Math.sin(t / 10000) * 200;
    const y = (1 + Math.sin(t / 1000)) * -50;
    cubeRef.current.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
  });

  const halfSize = size / 2;

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
            transform: `translateZ(${halfSize}px)`,
          }}
        />
        {/* Back */}
        <div
          className="cube-side"
          style={{
            transform: `rotateY(180deg) translateZ(${halfSize}px)`,
          }}
        />
        {/* Left */}
        <div
          className="cube-side"
          style={{
            transform: `rotateY(-90deg) translateZ(${halfSize}px)`,
          }}
        />
        {/* Right */}
        <div
          className="cube-side"
          style={{
            transform: `rotateY(90deg) translateZ(${halfSize}px)`,
          }}
        />
        {/* Top */}
        <div
          className="cube-side"
          style={{
            transform: `rotateX(90deg) translateZ(${halfSize}px)`,
          }}
        />
        {/* Bottom */}
        <div
          className="cube-side"
          style={{
            transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
          }}
        />
      </div>
    </div>
  );
}
