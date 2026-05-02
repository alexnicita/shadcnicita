import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

interface PrimaryLinksProps {
  className?: string;
  align?: "left" | "center" | "right";
}

export default function PrimaryLinks({
  className,
  align = "left",
}: PrimaryLinksProps) {
  const { isDarkMode } = useTheme();
  const linkClasses =
    "relative inline-flex text-foreground/70 transition-colors duration-200 hover:text-foreground after:content-[''] after:absolute after:left-[0.08em] after:right-[0.08em] after:-bottom-[0.1em] after:h-px after:bg-foreground/25 after:transition-colors after:duration-200 hover:after:bg-foreground";

  return (
    <nav
      className={cn(
        "flex items-center gap-2 text-sm font-medium text-foreground/80",
        align === "center" && "justify-center",
        align === "right" && "justify-end",
        className
      )}
    >
      <Link
        to="/blog"
        state={{ isDarkMode }}
        className={linkClasses}
      >
        Writing
      </Link>
      <span className="text-foreground/30">·</span>
      <a
        href="https://seaportand.co"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        Building
      </a>
      <span className="text-foreground/30">·</span>
      <a
        href="https://keyboardvc.com"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        Investing
      </a>
    </nav>
  );
}
