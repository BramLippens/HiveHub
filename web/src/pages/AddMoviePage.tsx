/**
 * AddMoviePage Component
 * Form to create a new movie
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMovieMutations } from '../hooks/useMovieMutations';
import { MovieForm } from '../components/MovieForm';
import { ErrorMessage } from '../components/ErrorMessage';
import type {
  CreateMovieRequest,
  UpdateMovieRequest,
} from '../types/movie.types';

export function AddMoviePage() {
  const navigate = useNavigate();
  const { create, creating } = useMovieMutations();
  const [submitError, setSubmitError] = useState<Error | null>(null);

  const handleSubmit = async (
    movieData: CreateMovieRequest | UpdateMovieRequest,
  ): Promise<void> => {
    try {
      setSubmitError(null);
      const newMovie = await create(movieData as CreateMovieRequest);
      void navigate(`/movies/${newMovie.id}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err : new Error('Failed to create movie'),
      );
    }
  };

  return (
    <div className="page add-movie-page">
      <div className="page-actions">
        <Link to="/movies" className="back-link">
          Back to Movies
        </Link>
      </div>

      <header className="page-header">
        <h1>Add New Movie</h1>
        <p className="page-description">
          Fill in the details to add a new movie to your collection
        </p>
      </header>

      {submitError && (
        <ErrorMessage
          error={submitError}
          onRetry={() => setSubmitError(null)}
        />
      )}

      <section className="form-section">
        <MovieForm
          onSubmit={handleSubmit}
          isSubmitting={creating}
          submitLabel="Add Movie"
        />
      </section>
    </div>
  );
}
