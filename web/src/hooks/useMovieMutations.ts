/**
 * useMovieMutations Hook
 * Custom hook for movie create, update, and delete operations
 */

import { useState } from 'react';
import { createMovie, updateMovie, deleteMovie } from '../api/movies.api';
import type {
  Movie,
  CreateMovieRequest,
  UpdateMovieRequest,
} from '../types/movie.types';

interface MutationState {
  loading: boolean;
  error: Error | null;
}

interface UseMovieMutationsResult {
  create: (movieData: CreateMovieRequest) => Promise<Movie>;
  update: (id: number, movieData: UpdateMovieRequest) => Promise<Movie>;
  remove: (id: number) => Promise<void>;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: Error | null;
}

/**
 * Hook for movie mutation operations (create, update, delete)
 */
export function useMovieMutations(): UseMovieMutationsResult {
  const [createState, setCreateState] = useState<MutationState>({
    loading: false,
    error: null,
  });

  const [updateState, setUpdateState] = useState<MutationState>({
    loading: false,
    error: null,
  });

  const [deleteState, setDeleteState] = useState<MutationState>({
    loading: false,
    error: null,
  });

  const create = async (movieData: CreateMovieRequest): Promise<Movie> => {
    try {
      setCreateState({ loading: true, error: null });
      const newMovie = await createMovie(movieData);
      setCreateState({ loading: false, error: null });
      return newMovie;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to create movie');
      setCreateState({ loading: false, error });
      throw error;
    }
  };

  const update = async (
    id: number,
    movieData: UpdateMovieRequest,
  ): Promise<Movie> => {
    try {
      setUpdateState({ loading: true, error: null });
      const updatedMovie = await updateMovie(id, movieData);
      setUpdateState({ loading: false, error: null });
      return updatedMovie;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to update movie');
      setUpdateState({ loading: false, error });
      throw error;
    }
  };

  const remove = async (id: number): Promise<void> => {
    try {
      setDeleteState({ loading: true, error: null });
      await deleteMovie(id);
      setDeleteState({ loading: false, error: null });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to delete movie');
      setDeleteState({ loading: false, error });
      throw error;
    }
  };

  const error =
    createState.error || updateState.error || deleteState.error || null;

  return {
    create,
    update,
    remove,
    creating: createState.loading,
    updating: updateState.loading,
    deleting: deleteState.loading,
    error,
  };
}
