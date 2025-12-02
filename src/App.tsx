import { useState, useEffect } from "react";
import "./App.css";
import BaseLayout from "./components/shared/BaseLayout";
import { Button } from "./components/ui/button";
import ColorPaletteLauncher from "./components/ColorPaletteLauncher";
import SpinningCube from "./components/SpinningCube";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BaseLayout
      showLoading={isLoading}
      className="p-8 md:px-16 md:pb-16 md:pt-8"
      afterThemeIndicator={
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>AI</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <Button
              asChild
              variant="outline"
              size="xs"
              className="font-medium text-xs"
            >
              <a href="tel:+13322236026">+1 (332) 223-6026</a>
            </Button>
          </div>
        </div>
      }
    >
      {/* Fixed header - never moves */}
      <div className="fixed top-8 left-8 md:left-16 z-50">
        <h1 className="text-2xl font-bold">alexander nicita</h1>
      </div>

      {/* Fixed menu toggle - only shows after cube click */}
      {showContent && (
        <div className="fixed top-8 right-8 md:right-16 z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-4xl md:text-5xl font-light leading-none hover:text-muted-foreground transition-all duration-200 hover:scale-110 animate-fade-in"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? "−" : "+"}
          </button>
        </div>
      )}

      {/* Cube - fixed center, doesn't affect layout */}
      {!showContent && (
        <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <SpinningCube onClick={() => setShowContent(true)} />
          </div>
        </div>
      )}

      {showContent && (
        <main className="max-w-2xl mx-auto animate-fade-in pt-20 md:pt-24">
          <section className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              today: <br />
              <span className="text-muted-foreground">
                alexploring the intersection of capital & technology
              </span>
            </h2>
            <p className="text-muted-foreground mb-8 mt-16">
              currently: <br />
              <span className="text-foreground">
                <a
                  href="https://en.wikipedia.org/wiki/Special_situation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-muted-foreground transition-colors"
                >
                  special situations
                </a>{" "}
                strategy consultant
              </span>
            </p>
            <p className="text-muted-foreground mb-8">
              previously: <br />
              <span className="text-foreground">
                software engineer at startups
              </span>
            </p>
            <p
              className={`text-muted-foreground mb-8 ${isMenuOpen ? "block" : "hidden"}`}
            >
              more: <br />
              <span className="text-foreground">
                <a
                  href="https://ans.consulting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-muted-foreground transition-colors"
                >
                  consulting
                </a>
                {" · "}
                <a
                  href="https://academiccommons.columbia.edu/doi/10.7916/wxey-cr42"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-muted-foreground transition-colors"
                >
                  thesis
                </a>
                {" · "}
                <a
                  href="/blog"
                  className="underline hover:text-muted-foreground transition-colors"
                >
                  blog
                </a>
                {" · "}
                <a
                  href="https://alexnicita.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-muted-foreground transition-colors"
                >
                  os
                </a>
              </span>
            </p>
          </section>

          <footer className="mt-16 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              raising $?{" "}
              <a
                href="mailto:alex@nicita.cc"
                className="hover:text-muted-foreground transition-colors"
              >
                email <span className="underline">alex@nicita.cc</span>
              </a>
            </p>
            <div className="mt-4">
              <a
                href="https://x.com/nicitaalex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors mr-4"
              >
                x
              </a>
              <a
                href="https://linkedin.com/in/alexander-nicita"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors mr-4"
              >
                linkedin
              </a>
              <a
                href="https://github.com/alexnicita"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                github
              </a>
            </div>
          </footer>
        </main>
      )}

      {/* Phone number - Desktop version (bottom left corner) */}
      <div className="hidden md:flex fixed z-40 bottom-8 left-8 items-end gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span>AI</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
        <Button
          asChild
          variant="outline"
          className="font-medium leading-none translate-y-[10px]"
        >
          <a href="tel:+13322236026">+1 (332) 223-6026</a>
        </Button>
      </div>

      {/* Color palette selector - Desktop only (bottom center) */}
      <ColorPaletteLauncher />
    </BaseLayout>
  );
}

export default App;
