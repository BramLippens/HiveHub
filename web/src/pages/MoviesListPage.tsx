/**
 * MoviesListPage Component
 * Displays all movies with search by barcode functionality
 */

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useMovies } from '../hooks/useMovies';
import { MovieList } from '../components/MovieList';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function MoviesListPage() {
  const [barcodeSearch, setBarcodeSearch] = useState<string>('');
  const [activeBarcode, setActiveBarcode] = useState<string | undefined>(
    undefined,
  );

  const { movies, count, loading, error, refetch } = useMovies(activeBarcode);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setActiveBarcode(barcodeSearch.trim() || undefined);
  };

  const handleClearSearch = (): void => {
    setBarcodeSearch('');
    setActiveBarcode(undefined);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setBarcodeSearch(e.target.value);
  };

  return (
    <div className="page movies-list-page">
      <header className="page-header">
        <h1>Movies Collection</h1>
        <p className="page-description">
          Browse and manage your movie collection
        </p>
      </header>

      <section className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-group">
            <label htmlFor="barcode-search" className="sr-only">
              Search by barcode
            </label>
            <input
              type="text"
              id="barcode-search"
              placeholder="Search by barcode..."
              value={barcodeSearch}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
            {activeBarcode && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="clear-button"
              >
                Clear
              </button>
            )}
          </div>
        </form>
        {activeBarcode && (
          <p className="search-info">
            Showing results for barcode: <strong>{activeBarcode}</strong>
          </p>
        )}
      </section>

      <section className="movies-section">
        {loading ? (
          <LoadingSpinner message="Loading movies..." />
        ) : error ? (
          <ErrorMessage error={error} onRetry={refetch} />
        ) : (
          <>
            <div className="movies-count">
              <p>
                {count} {count === 1 ? 'movie' : 'movies'} found
              </p>
            </div>
            <MovieList movies={movies} />
          </>
        )}
      </section>
    </div>
  );
}
