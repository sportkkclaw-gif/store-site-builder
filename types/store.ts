export type StoreTheme = 'japanese' | 'premium' | 'playful';

export interface StoreImage {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface StoreCategory {
  id: string;
  name: string;
  slug?: string;
  image: string;
  description?: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  description?: string;
}
