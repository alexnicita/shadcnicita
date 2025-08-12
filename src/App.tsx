import { useState, useEffect } from "react";
import "./App.css";
import BaseLayout from "./components/shared/BaseLayout";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BaseLayout showLoading={isLoading} className="p-8 md:p-16">
      <header className="flex justify-between items-center mb-16">
        <h1 className="text-2xl font-bold">alexander nicita</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            menu
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
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
        </section>

        <nav className={`${isMenuOpen ? "block" : "hidden"} space-y-4`}>
          <a
            href="https://ans.consulting"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-muted-foreground hover:text-foreground transition-colors"
          >
            consulting
          </a>
          <a
            href="https://academiccommons.columbia.edu/doi/10.7916/wxey-cr42"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-muted-foreground hover:text-foreground transition-colors"
          >
            thesis
          </a>
          <a
            href="/blog"
            className="block text-muted-foreground hover:text-foreground transition-colors"
          >
            blog
          </a>
          <a
            href="https://alexnicita.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-muted-foreground hover:text-foreground transition-colors"
          >
            os
          </a>
        </nav>

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
    </BaseLayout>
  );
}

export default App;
