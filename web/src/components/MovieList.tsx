/**
 * MovieList Component
 * Displays a list of movie cards
 */

import { MovieCard } from './MovieCard';
import type { Movie } from '../types/movie.types';

interface MovieListProps {
  movies: Movie[];
}

export function MovieList({ movies }: MovieListProps) {
  if (movies.length === 0) {
    return (
      <div className="empty-state">
        <p>No movies found.</p>
      </div>
    );
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
