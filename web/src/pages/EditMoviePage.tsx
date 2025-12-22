/**
 * EditMoviePage Component
 * Form to edit an existing movie
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMovie } from '../hooks/useMovies';
import { useMovieMutations } from '../hooks/useMovieMutations';
import { MovieForm } from '../components/MovieForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import type {
  CreateMovieRequest,
  UpdateMovieRequest,
} from '../types/movie.types';

export function EditMoviePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = id ? parseInt(id, 10) : undefined;

  const { movie, loading, error, refetch } = useMovie(movieId);
  const { update, updating } = useMovieMutations();

  const [submitError, setSubmitError] = useState<Error | null>(null);

  const handleSubmit = async (
    movieData: CreateMovieRequest | UpdateMovieRequest,
  ): Promise<void> => {
    if (!movieId) return;

    try {
      setSubmitError(null);
      await update(movieId, movieData);
      void navigate(`/movies/${movieId}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err : new Error('Failed to update movie'),
      );
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading movie details..." />;
  }

  if (error) {
    return (
      <div className="page edit-movie-page">
        <ErrorMessage error={error} onRetry={refetch} />
        <Link to="/movies" className="back-link">
          Back to Movies
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="page edit-movie-page">
        <h1>Movie Not Found</h1>
        <p>The requested movie could not be found.</p>
        <Link to="/movies" className="back-link">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="page edit-movie-page">
      <div className="page-actions">
        <Link to={`/movies/${movie.id}`} className="back-link">
          Back to Movie Details
        </Link>
      </div>

      <header className="page-header">
        <h1>Edit Movie</h1>
        <p className="page-description">
          Update the details for <strong>{movie.title}</strong>
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
          movie={movie}
          onSubmit={handleSubmit}
          isSubmitting={updating}
          submitLabel="Update Movie"
        />
      </section>
    </div>
  );
}
