import { useState } from "react";
import Logo from "../assets/decklab_logo.png";

type NavItem = {
  label: string;
  href: string;
};

const centerNavItems: NavItem[] = [
  { label: "Build Deck", href: "/build" },
  { label: "My Decks", href: "/decks" },
  { label: "Card Search", href: "/cards" },
];

export const Nav = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <nav
        className="mx-auto flex w-full items-center justify-between px-4"
        aria-label="Main navigation"
      >
        <a
          href="/"
          className="flex items-center gap-2"
          aria-label="DeckLab home"
        >
          <img src={Logo} alt="DeckLab logo" className="w-32" />
        </a>

        {/* Center: Nav links (desktop) */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <ul className="flex gap-6 text-md font-medium text-neutral-200">
            {centerNavItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="transition-colors hover:text-white hover:underline hover:underline-offset-4"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Login (desktop) */}
        <div className="hidden items-center md:flex">
          <a
            href="/login"
            className="rounded-full border border-neutral-700 px-4 py-1.5 text-sm font-medium text-neutral-100 transition-colors hover:border-neutral-400 hover:text-white"
          >
            Login
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-neutral-200 hover:bg-neutral-800 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileOpen}
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Open main menu</span>
          {/* Simple hamburger / close icon */}
          <div className="space-y-1">
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                isMobileOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-opacity ${
                isMobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                isMobileOpen ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu panel */}
      {isMobileOpen && (
        <div className="border-b border-neutral-800 bg-neutral-950 md:hidden">
          <div className="mx-auto max-w-6xl px-4 pb-4 pt-2 md:px-6">
            <ul className="space-y-2 text-sm font-medium text-neutral-100">
              {centerNavItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block rounded-md px-2 py-2 hover:bg-neutral-800"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="/login"
                  className="block rounded-full border border-neutral-700 px-3 py-2 text-center hover:border-neutral-400 hover:bg-neutral-900"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
