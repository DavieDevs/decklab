// src/pages/HomePage.tsx
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-12 md:flex-row md:items-center md:pt-16">
        {/* Left: text */}
        <div className="flex-1">
          <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-300">
            Early Access · DeckLab
          </span>

          <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
            Modern <span className="text-emerald-400">Yu-Gi-Oh!</span> deck
            builder for serious duelists.
          </h1>

          <p className="mt-3 max-w-xl text-sm text-neutral-300 md:text-base">
            Search cards instantly, follow the banlist, save your decks to the
            cloud, and keep everything organized in a clean, distraction-free
            interface.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/build"
              className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-colors hover:bg-emerald-500"
            >
              Start building free
            </Link>

            <Link
              to="/login"
              className="text-sm font-medium text-neutral-300 underline underline-offset-4 hover:text-neutral-100"
            >
              Log in to your decks
            </Link>
          </div>

          <p className="mt-3 text-xs text-neutral-500">
            No credit card. Just building decks.
          </p>
        </div>

        {/* Right: hero preview */}
        <div className="flex-1">
          <div className="relative rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-4 shadow-2xl">
            {/* Fake browser chrome */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] text-neutral-500">
                decklab.app/build
              </span>
            </div>

            {/* Main app preview skeleton */}
            <div className="grid gap-4 md:grid-cols-[1.1fr,1.4fr]">
              {/* Left pane */}
              <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900/80 p-3">
                <div className="h-3 w-24 rounded bg-neutral-700/80" />
                <div className="h-8 rounded-md bg-neutral-800" />
                <div className="h-3 w-20 rounded bg-neutral-700/80" />
                <div className="h-8 rounded-md bg-neutral-800" />

                <div className="mt-3 h-px w-full bg-neutral-800" />

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Card Counts</span>
                    <span className="text-neutral-500">
                      Main / Extra / Side
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] text-neutral-300">
                    <span className="rounded-full bg-neutral-800 px-2 py-0.5">
                      Main: 40 / 60
                    </span>
                    <span className="rounded-full bg-neutral-800 px-2 py-0.5">
                      Extra: 10 / 15
                    </span>
                    <span className="rounded-full bg-neutral-800 px-2 py-0.5">
                      Side: 0 / 15
                    </span>
                  </div>
                </div>
              </div>

              {/* Right pane: card grid */}
              <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900/80 p-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Main Deck</span>
                  <span className="text-[10px] text-neutral-500">
                    Visual grid view
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[5/7] overflow-hidden rounded-md bg-gradient-to-br from-neutral-800 to-neutral-900"
                    >
                      <div className="h-2/3 bg-neutral-700/60" />
                      <div className="h-1/3 px-1 py-1">
                        <div className="h-2 w-10 rounded bg-neutral-600/90" />
                        <div className="mt-1 h-2 w-6 rounded bg-neutral-700/80" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-neutral-500">
                  Click a card to view details, check ban status, and manage
                  copies.
                </p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] text-neutral-500">
            Screenshot inspired preview of the DeckLab builder interface.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-neutral-900 bg-neutral-950/80">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-lg font-semibold md:text-xl">
            Build decks the way you actually play.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-300">
            DeckLab is built for Yu-Gi-Oh! players who want a clean, fast
            builder that respects real TCG rules and doesn’t get in the way.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-4">
              <h3 className="text-sm font-semibold">Instant card search</h3>
              <p className="mt-2 text-xs text-neutral-300">
                Search thousands of Yu-Gi-Oh! cards by name and type in
                milliseconds, powered by the YGOProDeck API.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-4">
              <h3 className="text-sm font-semibold">Banlist-aware builder</h3>
              <p className="mt-2 text-xs text-neutral-300">
                See at a glance which cards are Limited, Semi-Limited, or
                Forbidden and avoid illegal deck lists before you play.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-4">
              <h3 className="text-sm font-semibold">
                Saved decks in the cloud
              </h3>
              <p className="mt-2 text-xs text-neutral-300">
                Log in, save your deck, duplicate versions, and come back to
                edit from any device—your lists stay in sync.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary preview / “How it works” */}
      <section className="border-t border-neutral-900 bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-lg font-semibold md:text-xl">
                A deck builder that matches how duelists think.
              </h2>
              <p className="mt-2 text-sm text-neutral-300">
                Main, Extra, and Side Decks are split into their own zones, so
                you always know where every card belongs. Card images stay front
                and center so you&apos;re not just reading wall-of-text lists.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                <li>• Visual grid view of your Main Deck</li>
                <li>• Quick removal and card detail modals</li>
                <li>• Clear counts for all three zones</li>
              </ul>
            </div>

            {/* Simple layout mock for deck zones */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
              <div className="space-y-3">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-3">
                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <span>Main Deck (40)</span>
                    <span className="text-[10px] text-neutral-500">
                      Monsters · Spells · Traps
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-8 gap-1">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[5/7] rounded-sm bg-neutral-800"
                      />
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-3">
                    <div className="flex items-center justify-between text-xs text-neutral-300">
                      <span>Extra Deck (10)</span>
                      <span className="text-[10px] text-neutral-500">
                        Fusion · Synchro · Xyz · Link
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-6 gap-1">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[5/7] rounded-sm bg-neutral-800"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-3">
                    <div className="flex items-center justify-between text-xs text-neutral-300">
                      <span>Side Deck (0)</span>
                      <span className="text-[10px] text-neutral-500">
                        Tech & matchup answers
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-6 gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[5/7] rounded-sm bg-neutral-900"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-neutral-900 bg-neutral-950/95">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">
          <h2 className="text-lg font-semibold md:text-xl">
            Ready to build your next deck?
          </h2>
          <p className="mt-2 text-sm text-neutral-300">
            Create an account, save your lists, and start testing ideas in
            minutes.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/build"
              className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-colors hover:bg-emerald-500"
            >
              Start building free
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-100 transition-colors hover:border-neutral-500 hover:text-white"
            >
              Log in
            </Link>
          </div>

          <p className="mt-3 text-xs text-neutral-500">
            Yu-Gi-Oh! TCG deck builder · banlist-aware · made for duelists.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
