export type DeckZone = "main" | "extra" | "side";

export type Card = {
  id: string;
  name: string;
  zone: DeckZone;
};

export type Deck = {
  name: string;
  main: Card[];
  extra: Card[];
  side: Card[];
};
