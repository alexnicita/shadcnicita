import { cn } from "@/lib/utils";

interface CornerInfoProps {
  className?: string;
  variant?: "desktop" | "mobile";
}

export default function CornerInfo({
  className,
  variant = "desktop",
}: CornerInfoProps) {
  if (variant === "mobile") {
    return (
      <div
        className={cn("flex flex-col items-center text-center mb-2", className)}
      >
        {/* Navigation Links */}
        <nav className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <a
            href="/blog"
            target="_blank"
            className="hover:text-foreground transition-colors duration-200"
          >
            Writing
          </a>
          <span className="text-foreground/30">·</span>
          <a
            href="https://seaportand.co"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-200"
          >
            Building
          </a>
          <span className="text-foreground/30">·</span>
          <a
            href="mailto:alex@nicita.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-200"
          >
            Investing
          </a>
        </nav>

      </div>
    );
  }

  // Desktop variant - fixed positioning
  return (
    <div
      className={cn(
        "hidden md:flex fixed bottom-8 left-16 z-40 max-w-sm animate-fade-in items-end",
        className
      )}
    >
      {/* Navigation Links */}
      <nav className="flex items-center gap-2 text-sm font-medium text-foreground/80 pb-[3px]">
        <a
          href="/blog"
          className="hover:text-foreground transition-colors duration-200"
        >
          Writing
        </a>
        <span className="text-foreground/30">·</span>
        <a
          href="https://seaportand.co"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors duration-200"
        >
          Building
        </a>
        <span className="text-foreground/30">·</span>
        <a
          href="mailto:alex@nicita.cc"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors duration-200"
        >
          Investing
        </a>
      </nav>

    </div>
  );
}
