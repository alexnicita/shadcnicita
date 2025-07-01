interface LoadingAnimationProps {
  show?: boolean;
  variant?: "fullscreen" | "inline";
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingAnimation({
  show = true,
  variant = "fullscreen",
  size = "lg",
  text = "an",
}: LoadingAnimationProps) {
  if (!show) return null;

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm",
  };

  const innerSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const containerClasses =
    variant === "fullscreen"
      ? "fixed inset-0 bg-background flex items-center justify-center z-50"
      : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer circle */}
        <svg
          className="absolute inset-0 animate-spin-slow"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="stroke-muted-foreground/20"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="2"
          />
          <circle
            className="stroke-foreground"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="2"
            strokeDasharray="283"
            strokeDashoffset="283"
            style={{
              animation: "draw 2s ease-out forwards",
            }}
          />
        </svg>

        {/* Inner elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${innerSizes[size]} relative`}>
            <div className="absolute inset-0 animate-pulse-slow">
              <div className="w-full h-full border-2 border-foreground rounded-full opacity-0 animate-fade-in" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-foreground ${textSizes[size]} font-medium animate-fade-in-delayed`}
              >
                {text}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
