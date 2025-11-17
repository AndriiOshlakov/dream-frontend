// src/types/goods.ts

/** Відповідь бекенду при пагінації */
export interface PageResponse {
  items: RawGood[];
  total: number;
}

/** Як бекенд надсилає товар (сирі поля) */
export interface RawGood {
  _id: { $oid: string };
  name: string;
  image: string;
  price: {
    value: number;
    currency: string;
  };
  category?: { $oid: string };
  size?: string[];
  description?: string;
  prevDescription?: string;
  feedbacks?: { $oid: string }[];
  gender?: string;
  characteristics?: string[];
}

/** Як ми використовуємо товар у UI */
export interface Good {
  id: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  categoryId?: string;
  sizes: string[];
  reviewsCount: number;
  rating?: number;
  prevDescription?: string;
  characteristics?: string[];
}
