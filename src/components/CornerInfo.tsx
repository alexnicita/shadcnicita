import { cn } from "@/lib/utils";
import { Github, Linkedin } from "lucide-react";
import PrimaryLinks from "./shared/PrimaryLinks";

interface CornerInfoProps {
  className?: string;
  variant?: "desktop" | "mobile" | "mobile-social";
  fixedDesktop?: boolean;
}

function SocialLinks({ className }: { className?: string }) {
  return (
    <nav className={cn("flex items-center gap-3", className)}>
      <a
        href="https://x.com/NicitaAlex"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/35 hover:text-foreground/75 transition-colors duration-200 flex items-center justify-center"
        aria-label="X"
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[13px] h-[13px] fill-current"
        >
          <title>X</title>
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      </a>
      <a
        href="https://www.linkedin.com/in/alexander-nicita/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/35 hover:text-foreground/75 transition-colors duration-200 flex items-center justify-center"
        aria-label="LinkedIn"
      >
        <Linkedin size={13} strokeWidth={1.7} />
      </a>
      <a
        href="https://github.com/alexnicita"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/35 hover:text-foreground/75 transition-colors duration-200 flex items-center justify-center"
        aria-label="GitHub"
      >
        <Github size={13} />
      </a>
    </nav>
  );
}

export default function CornerInfo({
  className,
  variant = "desktop",
  fixedDesktop = true,
}: CornerInfoProps) {
  if (variant === "mobile") {
    return (
      <div
        className={cn("flex flex-col items-center text-center mb-2", className)}
      >
        <PrimaryLinks align="center" />
      </div>
    );
  }

  if (variant === "mobile-social") {
    return (
      <div className={cn("md:hidden", className)}>
        <SocialLinks />
      </div>
    );
  }

  // Desktop variant - fixed positioning
  return (
    <div
      className={cn(
        fixedDesktop
          ? "hidden md:flex fixed bottom-8 left-8 z-40 items-end"
          : "hidden md:flex items-end",
        className,
      )}
    >
      <SocialLinks className="pb-[3px]" />
    </div>
  );
}
