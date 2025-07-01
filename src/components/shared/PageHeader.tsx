import { useState } from "react";
import { Link } from "react-router-dom";

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

interface PageHeaderProps {
  title?: string;
  showMenu?: boolean;
  navigationItems?: NavigationItem[];
  className?: string;
}

const defaultNavigationItems: NavigationItem[] = [
  {
    label: "consulting",
    href: "https://ans.consulting",
    external: true,
  },
  {
    label: "thesis",
    href: "https://academiccommons.columbia.edu/doi/10.7916/wxey-cr42",
    external: true,
  },
  {
    label: "os",
    href: "https://alexnicita.com",
    external: true,
  },
  // {
  //   label: "blog",
  //   href: "/blog",
  //   external: false,
  // },
];

export default function PageHeader({
  title = "alexander nicita",
  showMenu = true,
  navigationItems = defaultNavigationItems,
  className = "",
}: PageHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`flex justify-between items-center mb-16 ${className}`}>
      <Link
        to="/"
        className="text-2xl font-bold hover:text-muted-foreground transition-colors"
      >
        {title}
      </Link>

      {showMenu && (
        <>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-sm hover:text-muted-foreground transition-colors"
            >
              menu
            </button>
          </div>

          <nav
            className={`${isMenuOpen ? "block" : "hidden"} absolute top-20 left-0 right-0 bg-background p-8 border-t border-border space-y-4 md:relative md:top-0 md:block md:bg-transparent md:border-0 md:p-0 md:space-y-0 md:space-x-6 md:flex`}
          >
            {navigationItems.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-foreground transition-colors md:inline"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block text-muted-foreground hover:text-foreground transition-colors md:inline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </>
      )}
    </header>
  );
}
