/**
 * MovieCard Component
 * Displays movie information in a card format
 */

import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie.types';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="movie-card-header">
        <h3>
          <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
        </h3>
        <span className="movie-year">{movie.releaseYear}</span>
      </div>
      <div className="movie-card-body">
        <p className="movie-director">
          <strong>Director:</strong> {movie.director}
        </p>
        <p className="movie-genre">
          <strong>Genre:</strong> {movie.genre}
        </p>
        <p className="movie-barcode">
          <strong>Barcode:</strong> {movie.barcode}
        </p>
        {movie.rating !== null && (
          <p className="movie-rating">
            <strong>Rating:</strong> {movie.rating}/10
          </p>
        )}
      </div>
      <div className="movie-card-footer">
        <Link to={`/movies/${movie.id}`} className="card-link">
          View Details
        </Link>
        <Link to={`/movies/${movie.id}/edit`} className="card-link-secondary">
          Edit
        </Link>
      </div>
    </div>
  );
}
