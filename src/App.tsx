import { useState, useEffect } from "react";
import "./App.css";
import BaseLayout from "./components/shared/BaseLayout";
import { Button } from "./components/ui/button";
import ColorPaletteLauncher from "./components/ColorPaletteLauncher";
import SpinningCube from "./components/SpinningCube";

// TODO: Add startup angel investments section somewhere on the site
// TODO: Redo cube interaction - consider adding links on home page and removing cube click entirely

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCube, setShowCube] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // Show cube first
      setShowCube(true);
    }, 2000);
    return () => clearTimeout(loadingTimer);
  }, []);

  // After cube fades in, show the header text
  useEffect(() => {
    if (showCube && !showContent) {
      const headerTimer = setTimeout(() => {
        setShowHeader(true);
      }, 1600); // Delay after cube appears
      return () => clearTimeout(headerTimer);
    }
  }, [showCube, showContent]);

  return (
    <BaseLayout
      showLoading={isLoading}
      showUIElements={showHeader}
      className="p-8 md:px-16 md:pb-16 md:pt-8"
    >
      {/* Fixed header - never moves */}
      {showHeader && (
        <div className="fixed top-8 left-8 md:left-16 z-50 animate-fade-in">
          <h1
            className={`text-2xl font-bold transition-colors ${showContent ? "cursor-pointer hover:text-muted-foreground" : ""}`}
            onClick={
              showContent
                ? () => {
                    setShowContent(false);
                    setIsMenuOpen(false);
                  }
                : undefined
            }
          >
            alexander nicita
          </h1>
        </div>
      )}

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
      {showCube && !showContent && (
        <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none animate-fade-in">
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

      {/* Color palette selector - Desktop only (bottom center) */}
      {showHeader && <ColorPaletteLauncher />}
    </BaseLayout>
  );
}

export default App;
