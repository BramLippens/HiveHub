/**
 * Movies API
 * API integration layer for movie CRUD operations
 */

import { buildApiUrl } from './config';
import type {
  Movie,
  MovieListResponse,
  CreateMovieRequest,
  UpdateMovieRequest,
} from '../types/movie.types';

/**
 * Get all movies, optionally filtered by barcode
 */
export async function getMovies(barcode?: string): Promise<MovieListResponse> {
  try {
    const url = barcode
      ? buildApiUrl(`movies?barcode=${encodeURIComponent(barcode)}`)
      : buildApiUrl('movies');

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();
    return data as MovieListResponse;
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    throw error;
  }
}

/**
 * Get a single movie by ID
 */
export async function getMovieById(id: number): Promise<Movie> {
  try {
    const response = await fetch(buildApiUrl(`movies/${id}`));

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Movie not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();
    return data as Movie;
  } catch (error) {
    console.error(`Failed to fetch movie with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new movie
 */
export async function createMovie(
  movieData: CreateMovieRequest,
): Promise<Movie> {
  try {
    const response = await fetch(buildApiUrl('movies'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();
    return data as Movie;
  } catch (error) {
    console.error('Failed to create movie:', error);
    throw error;
  }
}

/**
 * Update an existing movie
 */
export async function updateMovie(
  id: number,
  movieData: UpdateMovieRequest,
): Promise<Movie> {
  try {
    const response = await fetch(buildApiUrl(`movies/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Movie not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();
    return data as Movie;
  } catch (error) {
    console.error(`Failed to update movie with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a movie
 */
export async function deleteMovie(id: number): Promise<void> {
  try {
    const response = await fetch(buildApiUrl(`movies/${id}`), {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Movie not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to delete movie with ID ${id}:`, error);
    throw error;
  }
}
