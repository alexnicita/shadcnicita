import {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react";
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

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  // Rotation offset from user dragging (added to auto-rotation)
  const [rotationOffset, setRotationOffset] = useState({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Mark as ready after first paint to enable smooth reveal
  useLayoutEffect(() => {
    // Use requestAnimationFrame to ensure DOM is painted
    const raf = requestAnimationFrame(() => {
      setIsReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Handle mouse down - start dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Handle mouse move - rotate cube
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;

      setRotationOffset((prev) => ({
        x: prev.x - deltaY * 0.5, // Vertical mouse = X rotation
        y: prev.y + deltaX * 0.5, // Horizontal mouse = Y rotation
      }));

      lastMousePos.current = { x: e.clientX, y: e.clientY };
    },
    [isDragging]
  );

  // Handle mouse up - stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      lastMousePos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - lastMousePos.current.x;
      const deltaY = e.touches[0].clientY - lastMousePos.current.y;

      setRotationOffset((prev) => ({
        x: prev.x - deltaY * 0.5,
        y: prev.y + deltaX * 0.5,
      }));

      lastMousePos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global touch event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd);
      return () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  // Smooth transition refs
  const frozenY = useRef(0);
  const frozenRotate = useRef(0);
  const releaseTime = useRef(0);
  const wasDragging = useRef(false);
  const BLEND_DURATION = 150; // ms for quick smooth resume

  useAnimationFrame((t: number) => {
    if (!cubeRef.current) return;

    // Detect drag start - freeze current values
    if (isDragging && !wasDragging.current) {
      frozenY.current = (1 + Math.sin(t / 1000)) * -10;
      frozenRotate.current = Math.sin(t / 10000) * 100;
    }
    // Detect drag end - start smooth blend
    else if (!isDragging && wasDragging.current) {
      releaseTime.current = t;
    }
    wasDragging.current = isDragging;

    // Calculate what the animated values would be right now
    const animatedY = (1 + Math.sin(t / 1000)) * -10;
    const animatedRotate = Math.sin(t / 10000) * 100;

    let y: number;
    let baseRotate: number;

    if (isDragging) {
      // Completely frozen while dragging - user has full control
      y = frozenY.current;
      baseRotate = frozenRotate.current;
    } else if (releaseTime.current > 0) {
      // Smoothly blend from frozen to animated after release
      const elapsed = t - releaseTime.current;
      const progress = Math.min(elapsed / BLEND_DURATION, 1);
      // Cubic ease-out for buttery smoothness
      const eased = 1 - Math.pow(1 - progress, 3);

      y = frozenY.current + (animatedY - frozenY.current) * eased;
      baseRotate =
        frozenRotate.current + (animatedRotate - frozenRotate.current) * eased;

      if (progress >= 1) {
        releaseTime.current = 0; // Blend complete
      }
    } else {
      // Normal animation
      y = animatedY;
      baseRotate = animatedRotate;
    }

    const finalRotateX = baseRotate + rotationOffset.x;
    const finalRotateY = baseRotate + rotationOffset.y;

    const transformValue = `translateY(${y}px) rotateX(${finalRotateX}deg) rotateY(${finalRotateY}deg)`;
    cubeRef.current.style.transform = transformValue;
    cubeRef.current.style.webkitTransform = transformValue;
  });

  const quarterSize = size / 4;

  return (
    <div
      className={`cube-scene flex justify-center items-center ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        perspective: "800px",
        WebkitPerspective: "800px",
        perspectiveOrigin: "center center",
        WebkitPerspectiveOrigin: "center center",
        // Smooth fade-in to hide any initial frame glitches
        opacity: isReady ? 1 : 0,
        transition: "opacity 0.15s ease-out",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <div
        ref={cubeRef}
        className={`cube ${isDragging ? "cube-dragging" : ""}`}
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
