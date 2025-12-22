/**
 * MovieDetailPage Component
 * Shows detailed information about a single movie with edit/delete actions
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMovie } from '../hooks/useMovies';
import { useMovieMutations } from '../hooks/useMovieMutations';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = id ? parseInt(id, 10) : undefined;

  const { movie, loading, error, refetch } = useMovie(movieId);
  const { remove, deleting } = useMovieMutations();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<Error | null>(null);

  const handleDeleteClick = (): void => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = (): void => {
    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  const handleConfirmDelete = (): void => {
    if (!movieId) return;

    void (async () => {
      try {
        setDeleteError(null);
        await remove(movieId);
        void navigate('/movies');
      } catch (err) {
        setDeleteError(
          err instanceof Error ? err : new Error('Failed to delete movie'),
        );
      }
    })();
  };

  if (loading) {
    return <LoadingSpinner message="Loading movie details..." />;
  }

  if (error) {
    return (
      <div className="page movie-detail-page">
        <ErrorMessage error={error} onRetry={refetch} />
        <Link to="/movies" className="back-link">
          Back to Movies
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="page movie-detail-page">
        <h1>Movie Not Found</h1>
        <p>The requested movie could not be found.</p>
        <Link to="/movies" className="back-link">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="page movie-detail-page">
      <div className="page-actions">
        <Link to="/movies" className="back-link">
          Back to Movies
        </Link>
        <div className="action-buttons">
          <Link to={`/movies/${movie.id}/edit`} className="edit-button">
            Edit Movie
          </Link>
          <button
            onClick={handleDeleteClick}
            className="delete-button"
            disabled={deleting}
          >
            Delete Movie
          </button>
        </div>
      </div>

      <article className="movie-detail">
        <header className="movie-detail-header">
          <h1>{movie.title}</h1>
          <span className="movie-year">{movie.releaseYear}</span>
        </header>

        <dl className="movie-details-list">
          <div className="detail-item">
            <dt>Director</dt>
            <dd>{movie.director}</dd>
          </div>

          <div className="detail-item">
            <dt>Genre</dt>
            <dd>{movie.genre}</dd>
          </div>

          <div className="detail-item">
            <dt>Barcode</dt>
            <dd>{movie.barcode}</dd>
          </div>

          <div className="detail-item">
            <dt>Release Year</dt>
            <dd>{movie.releaseYear}</dd>
          </div>

          {movie.rating !== null && (
            <div className="detail-item">
              <dt>Rating</dt>
              <dd>{movie.rating}/10</dd>
            </div>
          )}

          <div className="detail-item">
            <dt>ID</dt>
            <dd>{movie.id}</dd>
          </div>
        </dl>
      </article>

      {showDeleteConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete <strong>{movie.title}</strong>?
              This action cannot be undone.
            </p>

            {deleteError && <ErrorMessage error={deleteError} />}

            <div className="modal-actions">
              <button
                onClick={handleCancelDelete}
                className="cancel-button"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="confirm-delete-button"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
