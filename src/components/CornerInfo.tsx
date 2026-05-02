import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail } from "lucide-react";
import PrimaryLinks from "./shared/PrimaryLinks";

interface CornerInfoProps {
  className?: string;
  variant?: "desktop" | "mobile" | "mobile-social";
  fixedDesktop?: boolean;
}

function SocialLinks({ className }: { className?: string }) {
  const socialLinkClasses =
    "group flex h-7 w-7 items-center justify-center rounded-full text-foreground/40 transition-colors duration-200 hover:text-foreground/80 focus-visible:text-foreground/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <nav
      aria-label="Social links"
      className={cn("flex items-center gap-3", className)}
    >
      <a
        href="https://x.com/NicitaAlex"
        target="_blank"
        rel="noopener noreferrer"
        className={socialLinkClasses}
        aria-label="X"
        title="Open X profile"
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[13px] w-[13px] fill-current"
        >
          <title>X</title>
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      </a>
      <a
        href="https://www.linkedin.com/in/alexander-nicita/"
        target="_blank"
        rel="noopener noreferrer"
        className={socialLinkClasses}
        aria-label="LinkedIn"
        title="Open LinkedIn profile"
      >
        <Linkedin size={13} strokeWidth={1.7} />
      </a>
      <a
        href="https://github.com/alexnicita"
        target="_blank"
        rel="noopener noreferrer"
        className={socialLinkClasses}
        aria-label="GitHub"
        title="Open GitHub profile"
      >
        <Github size={13} />
      </a>
      <a
        href="mailto:alex@nicita.cc"
        className={socialLinkClasses}
        aria-label="Email"
        title="Send email"
      >
        <Mail size={13} strokeWidth={1.7} />
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
