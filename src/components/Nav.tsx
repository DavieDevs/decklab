import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/decklab_logo.png";
import { supabase } from "../lib/supabaseClient";

type NavItem = {
  label: string;
  href: string;
};

const centerNavItems: NavItem[] = [
  { label: "Build Deck", href: "/build" },
  { label: "My Decks", href: "/decks" },
];

export const Nav = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!isMounted) return;
      setIsAuthenticated(!!user);
    };

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        setIsAuthenticated(!!session?.user);
      }
    );

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <nav
        className="mx-auto flex w-full items-center justify-between px-4"
        aria-label="Main navigation"
      >
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="DeckLab home"
        >
          <img src={Logo} alt="DeckLab logo" className="w-32" />
        </Link>

        {/* Center: Nav links (desktop) */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <ul className="flex gap-6 text-md font-medium text-neutral-200">
            {centerNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="transition-colors hover:text-white hover:underline hover:underline-offset-4"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Login / Logout (desktop) */}
        <div className="hidden items-center md:flex">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-neutral-700 px-4 py-1.5 text-sm font-medium text-neutral-100 transition-colors hover:border-red-500 hover:text-red-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-neutral-700 px-4 py-1.5 text-sm font-medium text-neutral-100 transition-colors hover:border-neutral-400 hover:text-white"
            >
              Login
            </Link>
          )}
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
                  <Link
                    to={item.href}
                    className="block rounded-md px-2 py-2 hover:bg-neutral-800"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li className="pt-2">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileOpen(false);
                      handleLogout();
                    }}
                    className="block w-full rounded-full border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-200 hover:border-red-500 hover:bg-neutral-900"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block rounded-full border border-neutral-700 px-3 py-2 text-center hover:border-neutral-400 hover:bg-neutral-900"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
