/**
 * useMovies Hook
 * Custom hook for fetching movies with loading and error states
 */

import { useState, useEffect } from 'react';
import { getMovies, getMovieById } from '../api/movies.api';
import type { Movie, MovieListResponse } from '../types/movie.types';

interface UseMoviesResult {
  movies: Movie[];
  count: number;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Fetch all movies, optionally filtered by barcode
 */
export function useMovies(barcode?: string): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const data: MovieListResponse = await getMovies(barcode);

        if (isMounted) {
          setMovies(data.items);
          setCount(data.count);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error('Failed to fetch movies'),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchMovies();

    return () => {
      isMounted = false;
    };
  }, [barcode, refreshKey]);

  const refetch = (): void => {
    setRefreshKey((prev) => prev + 1);
  };

  return { movies, count, loading, error, refetch };
}

interface UseMovieResult {
  movie: Movie | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Fetch a single movie by ID
 */
export function useMovie(id: number | undefined): UseMovieResult {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    if (id === undefined) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchMovie = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const data: Movie = await getMovieById(id);

        if (isMounted) {
          setMovie(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error('Failed to fetch movie'),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchMovie();

    return () => {
      isMounted = false;
    };
  }, [id, refreshKey]);

  const refetch = (): void => {
    setRefreshKey((prev) => prev + 1);
  };

  return { movie, loading, error, refetch };
}
