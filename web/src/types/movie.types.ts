/**
 * Movie Type Definitions
 * Interfaces for Movie entities and API requests/responses
 */

export interface Movie {
  id: number;
  title: string;
  director: string;
  releaseYear: number;
  barcode: string;
  genre: string;
  rating: number | null;
}

export interface CreateMovieRequest {
  title: string;
  director: string;
  releaseYear: number;
  barcode: string;
  genre: string;
  rating?: number | null;
}

export interface UpdateMovieRequest {
  title?: string;
  director?: string;
  releaseYear?: number;
  barcode?: string;
  genre?: string;
  rating?: number | null;
}

export interface MovieListResponse {
  items: Movie[];
  count: number;
}
