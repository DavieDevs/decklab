// src/pages/MyDecksPage.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Card } from "../types/deck";

type DeckRow = {
  id: string;
  name: string;
  format?: string | null;
  main: Card[];
  extra: Card[];
  side: Card[];
  created_at: string;
};

export default function MyDecksPage() {
  const [decks, setDecks] = useState<DeckRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadDecks = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("You need to be logged in to view your decks.");
        setLoading(false);
        return;
      }

      setUserEmail(user.email ?? null);

      const { data, error: decksError } = await supabase
        .from("decks")
        .select("*")
        .order("created_at", { ascending: false });

      if (decksError) {
        console.error(decksError);
        setError("Failed to load decks. Please try again.");
        setLoading(false);
        return;
      }

      setDecks((data ?? []) as DeckRow[]);
      setLoading(false);
    };

    loadDecks();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 text-neutral-100">
      <header className="mb-6 flex items-baseline justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">My Decks</h1>
          <p className="mt-1 text-xs text-neutral-400">
            View the decks you&apos;ve saved from the DeckLab builder.
          </p>
        </div>

        {userEmail && (
          <p className="text-[11px] text-neutral-500">
            Logged in as <span className="font-medium">{userEmail}</span>
          </p>
        )}
      </header>

      {loading && (
        <p className="text-sm text-neutral-400">Loading your decks...</p>
      )}

      {!loading && error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && !error && decks.length === 0 && (
        <p className="text-sm text-neutral-400">
          You don&apos;t have any saved decks yet. Build one on the{" "}
          <a
            href="/build"
            className="text-indigo-400 underline underline-offset-2 hover:text-indigo-300"
          >
            Deck Builder
          </a>{" "}
          page and click <span className="font-semibold">Save Deck</span>.
        </p>
      )}

      {!loading && !error && decks.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          {decks.map((deck) => {
            const mainCount = deck.main?.length ?? 0;
            const extraCount = deck.extra?.length ?? 0;
            const sideCount = deck.side?.length ?? 0;

            const previewCards = (deck.main ?? []).slice(0, 3);

            return (
              <article
                key={deck.id}
                className="flex flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-950/70 p-4 shadow-md"
              >
                <div>
                  <h2 className="text-lg font-semibold">{deck.name}</h2>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-neutral-500">
                    Format: {deck.format || "TCG"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-neutral-300">
                    <span>
                      Main: <span className="font-semibold">{mainCount}</span>
                    </span>
                    <span>
                      Extra: <span className="font-semibold">{extraCount}</span>
                    </span>
                    <span>
                      Side: <span className="font-semibold">{sideCount}</span>
                    </span>
                  </div>

                  {/* small card image preview row */}
                  {previewCards.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {previewCards.map((card) => (
                        <div
                          key={card.id}
                          className="h-20 w-14 overflow-hidden rounded-md bg-neutral-900 shadow-sm"
                        >
                          {card.imageUrl ? (
                            <img
                              src={card.imageUrl}
                              alt={card.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-1 text-[9px] text-center text-neutral-300">
                              {card.name}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-neutral-500">
                  <span>
                    Created: {new Date(deck.created_at).toLocaleDateString()}
                  </span>

                  {/* Placeholder for future: load into builder */}
                  <button
                    type="button"
                    className="rounded-md border border-neutral-700 px-2 py-1 text-[11px] font-medium text-neutral-100 hover:border-indigo-400 hover:text-indigo-300"
                    // TODO: later: onClick={() => handleLoadDeck(deck)}
                  >
                    View / Load (coming soon)
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
