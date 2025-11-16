export type DeckZone = "main" | "extra" | "side";
export type BanStatus = "forbidden" | "limited" | "semi-limited" | "unlimited";

export type Card = {
  id: string;
  name: string;
  zone: DeckZone;
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
  banStatus?: BanStatus;
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
  banlist_info?: {
    ban_tcg?: string;
    ban_ocg?: string;
    ban_goat?: string;
  };
};
