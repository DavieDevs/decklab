import { useState } from "react";
import type { FC } from "react";
import type { Card, DeckZone, YGOCardApi } from "../types/deck";
import { CardDetailModal } from "../components/CardDetailModal";
import { supabase } from "../lib/supabaseClient";

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
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const getCardBanMeta = (
    card: YGOCardApi
  ): { status: Card["banStatus"]; limit: number } => {
    const raw = card.banlist_info?.ban_tcg;

    if (!raw) {
      return { status: "unlimited", limit: 3 };
    }

    const normalized = raw.toLowerCase();

    if (normalized === "banned" || normalized === "forbidden") {
      return { status: "forbidden", limit: 0 };
    }

    if (normalized === "limited") {
      return { status: "limited", limit: 1 };
    }

    if (normalized.startsWith("semi")) {
      return { status: "semi-limited", limit: 2 };
    }

    return { status: "unlimited", limit: 3 };
  };

  const getCurrentCopiesByApiId = (apiId?: number): number => {
    if (apiId == null) return 0;
    const allCards = [...main, ...extra, ...side];
    return allCards.filter((c) => c.apiId === apiId).length;
  };

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
    if (!isCardAllowedInZone(card, selectedZone)) {
      if (selectedZone === "main") {
        setLimitError(
          "Extra Deck monsters (Fusion, Synchro, Xyz, Link) must be placed in the Extra Deck."
        );
      } else if (selectedZone === "extra") {
        setLimitError(
          "Only Fusion, Synchro, Xyz, and Link monsters can be placed in the Extra Deck."
        );
      } else {
        setLimitError("This card type can't be added to the selected zone.");
      }
      return;
    }
    const { status, limit } = getCardBanMeta(card);

    if (limit === 0) {
      setLimitError(
        "This card is Forbidden in the TCG banlist and can't be added to the deck."
      );
      return;
    }

    const currentCopies = getCurrentCopiesByApiId(card.id);

    if (currentCopies >= limit) {
      if (limit === 1) {
        setLimitError(
          "This card is Limited in the TCG banlist (max 1 copy across Main, Extra, and Side)."
        );
      } else if (limit === 2) {
        setLimitError(
          "This card is Semi-Limited in the TCG banlist (max 2 copies across Main, Extra, and Side)."
        );
      } else {
        setLimitError(
          "You already have the maximum 3 copies of this card across Main, Extra, and Side."
        );
      }
      return;
    }

    addCardToSelectedZone(card.name, {
      apiId: card.id,
      imageUrl: card.card_images?.[0]?.image_url_small,
      fullImageUrl: card.card_images?.[0]?.image_url,
      type: card.type,
      desc: card.desc,
      atk: card.atk,
      def: card.def,
      level: card.level,
      attribute: card.attribute,
      banLimit: limit,
      banStatus: status,
    });
  };

  const addCardToSelectedZone = (
    name: string,
    options?: {
      apiId?: number;
      imageUrl?: string;
      fullImageUrl?: string;
      type?: string;
      desc?: string;
      atk?: number;
      def?: number;
      level?: number;
      attribute?: string;
      banLimit?: number;
      banStatus?: Card["banStatus"];
    }
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
      fullImageUrl: options?.fullImageUrl,
      type: options?.type,
      desc: options?.desc,
      atk: options?.atk,
      def: options?.def,
      level: options?.level,
      attribute: options?.attribute,
      banLimit: options?.banLimit,
      banStatus: options?.banStatus,
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

  const isExtraDeckType = (cardType: string) => {
    const extraKeywords = ["Fusion", "Synchro", "XYZ", "Xyz", "Link"];
    return extraKeywords.some((kw) => cardType.includes(kw));
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

  const isCardAllowedInZone = (card: YGOCardApi, zone: DeckZone) => {
    const isExtra = isExtraDeckType(card.type);

    if (zone === "extra") return isExtra;
    if (zone === "main") return !isExtra;
    if (zone === "side") return true;
    return true;
  };

  const handleSaveDeck = async () => {
    setSaveError(null);
    setSaveMessage(null);

    // You can decide how strict you want this
    if (main.length === 0 && extra.length === 0 && side.length === 0) {
      setSaveError("You can't save an empty deck.");
      return;
    }

    setIsSaving(true);
    try {
      // 1) Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setSaveError("You need to be logged in to save decks.");
        return;
      }

      // 2) Build the payload
      const payload = {
        user_id: user.id,
        name: deckName.trim() || "Untitled Deck",
        format: "tcg",
        main,
        extra,
        side,
      };

      // 3) Insert into decks table
      const { error: insertError } = await supabase
        .from("decks")
        .insert(payload);

      if (insertError) {
        console.error(insertError);
        setSaveError("Failed to save deck. Please try again.");
        return;
      }

      setSaveMessage("Deck saved successfully!");
    } catch (err) {
      console.error(err);
      setSaveError("Something went wrong while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 text-neutral-100 md:flex-row">
        {/* Left column: deck info + card search */}
        <section className="w-full md:w-1/3">
          <h1 className="mb-4 text-2xl font-semibold">Build a Deck</h1>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-neutral-400">
            Deck Name
          </label>
          <div className="mb-4 flex gap-2">
            <input
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleSaveDeck}
              disabled={isSaving}
              className="whitespace-nowrap rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-neutral-700"
            >
              {isSaving ? "Saving..." : "Save Deck"}
            </button>
          </div>

          {saveError && (
            <p className="mb-2 text-xs text-red-400">{saveError}</p>
          )}

          {saveMessage && (
            <p className="mb-2 text-xs text-emerald-400">{saveMessage}</p>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchCards();
            }}
            className="space-y-3"
          >
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400">
                Zone
              </label>
              <select
                value={selectedZone}
                onChange={(e) => {
                  setSelectedZone(e.target.value as DeckZone);
                  setLimitError(null);
                  setSearchError(null);
                }}
                className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              >
                <option value="main">Main Deck</option>
                <option value="extra">Extra Deck</option>
                <option value="side">Side Deck</option>
              </select>
            </div>
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

          <ul className="grid grid-cols-2 gap-2 max-h-100 overflow-y-auto pr-1 md:grid-cols-3 py-2">
            {searchResults.map((card) => {
              const imageUrl =
                card.card_images?.[0]?.image_url_small ||
                card.card_images?.[0]?.image_url;

              const { limit } = getCardBanMeta(card);

              return (
                <li
                  key={card.id}
                  className="group relative cursor-pointer overflow-hidden bg-neutral-900"
                  onClick={() => addCardFromApi(card)}
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={card.name}
                      className="h-40 w-full object-cover shadow-md"
                    />
                  )}

                  {/* Copies limit badge in bottom-right (0, 1, or 2). No badge for 3/unlimited */}
                  {limit < 3 && (
                    <span
                      className={
                        "absolute bottom-1 right-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold shadow-md " +
                        (limit === 0
                          ? "bg-red-700 text-red-50 border border-red-300"
                          : "bg-black/80 text-amber-200 border border-amber-300")
                      }
                    >
                      {limit}
                    </span>
                  )}

                  {/* Hover highlight */}
                  <div className="absolute inset-0 hidden bg-white/10 group-hover:block" />
                </li>
              );
            })}
          </ul>
        </section>

        {/* Right column: card counts + deck zones */}
        <section className="w-full space-y-4 md:w-2/3">
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

          <DeckZoneColumn
            title={`Main Deck (${main.length})`}
            cards={main}
            zone="main"
            onRemove={handleRemoveCard}
            minHeight="min-h-64"
            onCardClick={setSelectedCard}
          />

          <DeckZoneColumn
            title={`Extra Deck (${extra.length})`}
            cards={extra}
            zone="extra"
            onRemove={handleRemoveCard}
            minHeight="min-h-48"
            onCardClick={setSelectedCard}
          />

          <DeckZoneColumn
            title={`Side Deck (${side.length})`}
            cards={side}
            zone="side"
            onRemove={handleRemoveCard}
            minHeight="min-h-32"
            onCardClick={setSelectedCard}
          />
        </section>
      </main>

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
}

type DeckZoneColumnProps = {
  title: string;
  cards: Card[];
  zone: DeckZone;
  onRemove: (zone: DeckZone, id: string) => void;
  className?: string;
  minHeight?: string;
  onCardClick?: (card: Card) => void;
};

const DeckZoneColumn: FC<DeckZoneColumnProps> = ({
  title,
  cards,
  zone,
  onRemove,
  className = "",
  minHeight = "min-h-40",
  onCardClick,
}) => {
  return (
    <div
      className={`rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 ${minHeight} ${className}`}
    >
      <h2 className="mb-2 text-sm font-semibold text-neutral-200">{title}</h2>
      {cards.length === 0 ? (
        <p className="text-xs text-neutral-500">No cards yet.</p>
      ) : (
        <ul className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5">
          {cards.map((card) => (
            <li
              key={card.id}
              className="group relative cursor-pointer"
              onClick={() => onCardClick?.(card)}
            >
              {card.imageUrl ? (
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full rounded-md object-cover shadow-md"
                />
              ) : (
                <div className="flex h-24 items-center justify-center rounded-md bg-neutral-900 px-2 text-[11px] text-center text-neutral-200">
                  {card.name}
                </div>
              )}

              {typeof card.banLimit === "number" && card.banLimit < 3 && (
                <span
                  className={
                    "absolute bottom-1 right-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold shadow-md " +
                    (card.banLimit === 0
                      ? "bg-red-700 text-red-50 border border-red-300"
                      : "bg-black/80 text-amber-200 border border-amber-300")
                  }
                >
                  {card.banLimit}
                </span>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(zone, card.id);
                }}
                className="absolute right-1 top-1 hidden rounded bg-red-600 px-1.5 py-0.5 text-[10px] text-white shadow-md group-hover:block"
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
