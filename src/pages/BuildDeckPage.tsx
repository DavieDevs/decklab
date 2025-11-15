import { useState } from "react";
import type { Card, DeckZone, YGOCardApi } from "../types/deck";

const initialDeckName = "New Deck";

const MAX_MAIN = 60;
const MAX_EXTRA = 15;
const MAX_SIDE = 15;

export default function BuildDeckPage() {
  const [deckName, setDeckName] = useState(initialDeckName);
  const [cardNameInput, setCardNameInput] = useState("");
  const [selectedZone, setSelectedZone] = useState<DeckZone>("main");
  const [main, setMain] = useState<Card[]>([]);
  const [extra, setExtra] = useState<Card[]>([]);
  const [side, setSide] = useState<Card[]>([]);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<YGOCardApi[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchCards = async () => {
    const query = cardNameInput.trim();
    if (!query) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);

      const res = await fetch(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(
          query
        )}&num=20&offset=0`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch cards");
      }

      const data = await res.json();

      if (!data.data || !Array.isArray(data.data)) {
        setSearchResults([]);
        setSearchError("No cards found.");
        return;
      }

      setSearchResults(data.data as YGOCardApi[]);
    } catch (err) {
      console.error(err);
      setSearchError("Error fetching cards. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const addCardFromApi = (card: YGOCardApi) => {
    addCardToSelectedZone(card.name, {
      apiId: card.id,
      imageUrl: card.card_images?.[0]?.image_url_small,
    });
  };

  const addCardToSelectedZone = (
    name: string,
    options?: { apiId?: number; imageUrl?: string }
  ) => {
    if (isZoneFull(selectedZone)) {
      const limit = getZoneLimit(selectedZone);
      setLimitError(
        selectedZone === "main"
          ? `Main Deck is full (${limit}/${limit}). Remove a card before adding more.`
          : selectedZone === "extra"
          ? `Extra Deck is full (${limit}/${limit}). Remove a card before adding more.`
          : `Side Deck is full (${limit}/${limit}). Remove a card before adding more.`
      );
      return;
    }

    const newCard: Card = {
      id: crypto.randomUUID(),
      name,
      zone: selectedZone,
      apiId: options?.apiId,
      imageUrl: options?.imageUrl,
    };

    if (selectedZone === "main") setMain((prev) => [...prev, newCard]);
    if (selectedZone === "extra") setExtra((prev) => [...prev, newCard]);
    if (selectedZone === "side") setSide((prev) => [...prev, newCard]);

    setLimitError(null);
  };

  const handleRemoveCard = (zone: DeckZone, id: string) => {
    if (zone === "main") setMain((prev) => prev.filter((c) => c.id !== id));
    if (zone === "extra") setExtra((prev) => prev.filter((c) => c.id !== id));
    if (zone === "side") setSide((prev) => prev.filter((c) => c.id !== id));
    setLimitError(null);
  };

  const getZoneLimit = (zone: DeckZone) => {
    if (zone === "main") return MAX_MAIN;
    if (zone === "extra") return MAX_EXTRA;
    return MAX_SIDE;
  };

  const getZoneCount = (zone: DeckZone) => {
    if (zone === "main") return main.length;
    if (zone === "extra") return extra.length;
    return side.length;
  };

  const isZoneFull = (zone: DeckZone) => {
    return getZoneCount(zone) >= getZoneLimit(zone);
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 text-neutral-100 md:flex-row">
      {/* Left column: deck info + “card search”/add */}
      <section className="w-full md:w-1/3">
        <h1 className="mb-4 text-2xl font-semibold">Build a Deck</h1>

        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-neutral-400">
          Deck Name
        </label>
        <input
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          className="mb-6 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchCards();
          }}
          className="space-y-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400">
              Card Name
            </label>
            <input
              value={cardNameInput}
              onChange={(e) => setCardNameInput(e.target.value)}
              placeholder="Blue-Eyes White Dragon"
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400">
              Zone
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value as DeckZone)}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              <option value="main">Main Deck</option>
              <option value="extra">Extra Deck</option>
              <option value="side">Side Deck</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={searchCards}
              className="flex-1 rounded-md border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-100 transition-colors hover:border-neutral-400 hover:text-white"
              disabled={isSearching || !cardNameInput.trim()}
            >
              {isSearching ? "Searching..." : "Search Cards"}
            </button>
          </div>
        </form>

        {searchError && (
          <p className="mt-3 text-xs text-red-400">{searchError}</p>
        )}

        {limitError && (
          <p className="mt-2 text-xs text-red-400">{limitError}</p>
        )}

        {searchResults.length > 0 && (
          <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-950/70 p-2">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Search Results
            </h2>
            <ul className="max-h-64 space-y-1 overflow-y-auto text-xs">
              {searchResults.map((card) => {
                const imageUrl =
                  card.card_images?.[0]?.image_url_small ||
                  card.card_images?.[0]?.image_url;

                return (
                  <li
                    key={card.id}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1 hover:bg-neutral-900"
                    onClick={() => addCardFromApi(card)}
                  >
                    <div className="flex items-center gap-2">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={card.name}
                          className="h-12 w-9 rounded-sm object-cover"
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="max-w-[9rem] truncate md:max-w-[12rem]">
                          {card.name}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          {card.type}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Right column: card counts + deck zones */}
      <section className="w-full space-y-4 md:w-2/3">
        {/* Card count row */}
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 px-3 py-2 text-xs text-neutral-300">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
              Card Counts
            </span>

            <span
              className={
                main.length > MAX_MAIN
                  ? "text-red-400"
                  : main.length === MAX_MAIN
                  ? "text-amber-300"
                  : "text-neutral-200"
              }
            >
              Main:{" "}
              <span className="font-semibold">
                {main.length} / {MAX_MAIN}
              </span>
            </span>

            <span
              className={
                extra.length > MAX_EXTRA
                  ? "text-red-400"
                  : extra.length === MAX_EXTRA
                  ? "text-amber-300"
                  : "text-neutral-200"
              }
            >
              Extra:{" "}
              <span className="font-semibold">
                {extra.length} / {MAX_EXTRA}
              </span>
            </span>

            <span
              className={
                side.length > MAX_SIDE
                  ? "text-red-400"
                  : side.length === MAX_SIDE
                  ? "text-amber-300"
                  : "text-neutral-200"
              }
            >
              Side:{" "}
              <span className="font-semibold">
                {side.length} / {MAX_SIDE}
              </span>
            </span>
          </div>
        </div>

        {/* Deck zones */}
        <DeckZoneColumn
          title={`Main Deck (${main.length})`}
          cards={main}
          zone="main"
          onRemove={handleRemoveCard}
          minHeight="min-h-64"
        />

        <DeckZoneColumn
          title={`Extra Deck (${extra.length})`}
          cards={extra}
          zone="extra"
          onRemove={handleRemoveCard}
          minHeight="min-h-48"
        />

        <DeckZoneColumn
          title={`Side Deck (${side.length})`}
          cards={side}
          zone="side"
          onRemove={handleRemoveCard}
          minHeight="min-h-32"
        />
      </section>
    </main>
  );
}

type DeckZoneColumnProps = {
  title: string;
  cards: Card[];
  zone: DeckZone;
  onRemove: (zone: DeckZone, id: string) => void;
  className?: string;
  minHeight?: string;
};

const DeckZoneColumn: React.FC<DeckZoneColumnProps> = ({
  title,
  cards,
  zone,
  onRemove,
  className = "",
  minHeight = "min-h-40",
}) => {
  return (
    <div
      className={`rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 ${minHeight} ${className}`}
    >
      <h2 className="mb-2 text-sm font-semibold text-neutral-200">{title}</h2>
      {cards.length === 0 ? (
        <p className="text-xs text-neutral-500">No cards yet.</p>
      ) : (
        <ul className="space-y-1">
          {cards.map((card) => (
            <li
              key={card.id}
              className="flex items-center justify-between gap-2 rounded-md bg-neutral-900 px-2 py-1 text-xs"
            >
              <div className="flex items-center gap-2">
                {card.imageUrl && (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="h-12 w-9 rounded-sm object-cover"
                  />
                )}
                <span className="max-w-[8rem] truncate md:max-w-[10rem]">
                  {card.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onRemove(zone, card.id)}
                className="text-[11px] text-red-400 hover:text-red-300"
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
