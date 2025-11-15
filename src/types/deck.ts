export type DeckZone = "main" | "extra" | "side";

export type Card = {
  id: string;
  name: string;
  zone: DeckZone;
  apiId?: number;
  imageUrl?: string;
};

export type Deck = {
  name: string;
  main: Card[];
  extra: Card[];
  side: Card[];
};

export type YGOCardApi = {
  id: number;
  name: string;
  type: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  card_images: {
    id: number;
    image_url: string;
    image_url_small: string;
  }[];
};
