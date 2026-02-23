import { cn } from "@/lib/utils";

interface PrimaryLinksProps {
  className?: string;
  align?: "left" | "center" | "right";
}

export default function PrimaryLinks({
  className,
  align = "left",
}: PrimaryLinksProps) {
  const linkClasses =
    "relative inline-flex transition-colors duration-200 hover:text-foreground after:content-[''] after:absolute after:left-[0.08em] after:right-[0.08em] after:-bottom-[0.1em] after:h-px after:bg-foreground/40 after:transition-colors after:duration-200 hover:after:bg-foreground";

  return (
    <nav
      className={cn(
        "flex items-center gap-2 text-sm font-medium text-foreground/80",
        align === "center" && "justify-center",
        align === "right" && "justify-end",
        className
      )}
    >
      <a
        href="/blog"
        className={linkClasses}
      >
        Writing
      </a>
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
        href="mailto:alex@nicita.cc"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        Investing
      </a>
    </nav>
  );
}
