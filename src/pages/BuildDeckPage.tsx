import { useState } from "react";
import type { Card, DeckZone } from "../types/deck";

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

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cardNameInput.trim();
    if (!trimmed) return;

    const newCard: Card = {
      id: crypto.randomUUID(),
      name: trimmed,
      zone: selectedZone,
    };

    if (selectedZone === "main") setMain((prev) => [...prev, newCard]);
    if (selectedZone === "extra") setExtra((prev) => [...prev, newCard]);
    if (selectedZone === "side") setSide((prev) => [...prev, newCard]);

    setCardNameInput("");
  };

  const handleRemoveCard = (zone: DeckZone, id: string) => {
    if (zone === "main") setMain((prev) => prev.filter((c) => c.id !== id));
    if (zone === "extra") setExtra((prev) => prev.filter((c) => c.id !== id));
    if (zone === "side") setSide((prev) => prev.filter((c) => c.id !== id));
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

        <form onSubmit={handleAddCard} className="space-y-3">
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

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-neutral-700"
            disabled={!cardNameInput.trim()}
          >
            Add Card
          </button>
        </form>
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

type DeckZoneVariant = "main" | "extra" | "side";

type DeckZoneColumnProps = {
  title: string;
  cards: Card[];
  zone: DeckZone;
  variant?: DeckZoneVariant;
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
              className="flex items-center justify-between rounded-md bg-neutral-900 px-2 py-1 text-xs"
            >
              <span>{card.name}</span>
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
