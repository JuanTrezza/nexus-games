/**
 * Tipos e interfaces TypeScript para la integración con RAWG.io API y la aplicación Nexus Games
 * Estrictamente tipado sin uso de 'any'
 */

export interface RAWGPlatformItem {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  year_end?: number | null;
  year_start?: number | null;
  games_count?: number;
  image_background?: string;
}

export interface RAWGPlatformSlot {
  platform: RAWGPlatformItem;
  released_at?: string;
  requirements?: {
    minimum?: string;
    recommended?: string;
  };
}

export interface RAWGParentPlatformSlot {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface RAWGGenre {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

export interface RAWGTag {
  id: number;
  name: string;
  slug: string;
  language: string;
  games_count: number;
  image_background: string;
}

export interface RAWGDeveloper {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

export interface RAWGPublisher {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

export interface RAWGShortScreenshot {
  id: number;
  image: string;
}

export interface RAWGScreenshot {
  id: number;
  image: string;
  width: number;
  height: number;
  is_deleted: boolean;
}

export interface RAWGGame {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  tba: boolean;
  background_image: string | null;
  rating: number;
  rating_top: number;
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  metacritic: number | null;
  playtime: number;
  suggestions_count: number;
  updated: string;
  genres: RAWGGenre[];
  platforms?: RAWGPlatformSlot[];
  parent_platforms?: RAWGParentPlatformSlot[];
  short_screenshots?: RAWGShortScreenshot[];
}

export interface RAWGGameDetail extends RAWGGame {
  description: string;
  description_raw?: string;
  background_image_additional: string | null;
  website: string | null;
  metacritic_url?: string | null;
  developers: RAWGDeveloper[];
  publishers: RAWGPublisher[];
  tags: RAWGTag[];
}

export interface RAWGResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface WishlistItem {
  id: number;
  name: string;
  background_image: string | null;
  rating: number;
  metacritic: number | null;
  added_at: number;
}

export interface FilterState {
  search: string;
  platforms: string[];
  genres: string[];
  ordering: string;
  minYear: number;
  minMetacritic: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export type TrendingTabKey = '-added' | '-rating' | '-released' | '-metacritic';
