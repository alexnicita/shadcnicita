import {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react";
import { useAnimationFrame } from "motion/react";

interface SpinningCubeProps {
  size?: number;
  initialPosition?: { x: number; y: number };
  onDelete?: () => void;
  isDeleting?: boolean;
}

// Initial transform to prevent flash before animation starts
const getInitialTransform = () => {
  const rotate = Math.sin(0) * 100; // t=0
  const y = (1 + Math.sin(0)) * -10; // t=0
  return `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
};

export default function SpinningCube({
  size = 120,
  initialPosition,
  onDelete,
  isDeleting = false,
}: SpinningCubeProps) {
  const cubeRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Drag state for moving the cube around the screen
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const pointerOffset = useRef({ x: 0, y: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const activePointerId = useRef<number | null>(null);
  const hasInitializedPosition = useRef(false);
  const CLICK_MOVE_THRESHOLD = 6;

  const clampToViewport = useCallback(
    (x: number, y: number) => {
      const maxX = Math.max(window.innerWidth - size, 0);
      const maxY = Math.max(window.innerHeight - size, 0);
      return {
        x: Math.min(Math.max(x, 0), maxX),
        y: Math.min(Math.max(y, 0), maxY),
      };
    },
    [size]
  );

  // Mark as ready after first paint to enable smooth reveal
  useLayoutEffect(() => {
    // Use requestAnimationFrame to ensure DOM is painted
    const raf = requestAnimationFrame(() => {
      setIsReady(true);
      if (!hasInitializedPosition.current) {
        hasInitializedPosition.current = true;
        if (initialPosition) {
          setPosition(clampToViewport(initialPosition.x, initialPosition.y));
        } else {
          const centered = clampToViewport(
            (window.innerWidth - size) / 2,
            (window.innerHeight - size) / 2
          );
          setPosition(centered);
        }
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [clampToViewport, initialPosition, size]);

  // Handle pointer down - start dragging
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isDeleting) return;
    e.preventDefault();
    e.stopPropagation();
    activePointerId.current = e.pointerId;
    hasMoved.current = false;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    pointerOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [isDeleting, position]);

  // Handle pointer move - reposition cube container
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || activePointerId.current !== e.pointerId) return;

      const nextX = e.clientX - pointerOffset.current.x;
      const nextY = e.clientY - pointerOffset.current.y;
      const pointerDeltaX = e.clientX - pointerStart.current.x;
      const pointerDeltaY = e.clientY - pointerStart.current.y;
      if (
        !hasMoved.current &&
        (Math.abs(pointerDeltaX) > CLICK_MOVE_THRESHOLD ||
          Math.abs(pointerDeltaY) > CLICK_MOVE_THRESHOLD)
      ) {
        hasMoved.current = true;
      }
      setPosition(clampToViewport(nextX, nextY));
    },
    [clampToViewport, isDragging]
  );

  // Handle pointer up - stop dragging
  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (activePointerId.current !== e.pointerId) return;
    setIsDragging(false);
    activePointerId.current = null;
    if (!hasMoved.current) {
      onDelete?.();
    }
  }, [onDelete]);

  // Global pointer event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  useEffect(() => {
    if (isDeleting) {
      setIsDragging(false);
    }
  }, [isDeleting]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => clampToViewport(prev.x, prev.y));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clampToViewport]);

  useAnimationFrame((t: number) => {
    if (!cubeRef.current) return;

    // Keep spinning continuously, even while dragging.
    const y = (1 + Math.sin(t / 1000)) * -10;
    const baseRotate = Math.sin(t / 10000) * 100;

    const transformValue = `translateY(${y}px) rotateX(${baseRotate}deg) rotateY(${baseRotate}deg)`;
    cubeRef.current.style.transform = transformValue;
    cubeRef.current.style.webkitTransform = transformValue;
  });

  const quarterSize = size / 4;

  return (
    <div
      className={`cube-scene ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={handlePointerDown}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        perspective: "800px",
        WebkitPerspective: "800px",
        perspectiveOrigin: "center center",
        WebkitPerspectiveOrigin: "center center",
        // Smooth fade-in to hide any initial frame glitches
        opacity: isDeleting ? 0 : isReady ? 1 : 0,
        transition: "opacity 0.15s ease-out",
        userSelect: "none",
        touchAction: "none",
        pointerEvents: isDeleting ? "none" : "auto",
      }}
    >
      <div
        ref={cubeRef}
        className={`cube ${isDragging || isHovered ? "cube-dragging" : ""}`}
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
