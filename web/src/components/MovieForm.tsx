/**
 * MovieForm Component
 * Reusable form for creating and editing movies
 */

import { useState, type FormEvent } from 'react';
import type {
  Movie,
  CreateMovieRequest,
  UpdateMovieRequest,
} from '../types/movie.types';

interface MovieFormProps {
  movie?: Movie;
  onSubmit: (
    movieData: CreateMovieRequest | UpdateMovieRequest,
  ) => Promise<void>;
  isSubmitting: boolean;
  submitLabel?: string;
}

export function MovieForm({
  movie,
  onSubmit,
  isSubmitting,
  submitLabel = 'Submit',
}: MovieFormProps) {
  const [title, setTitle] = useState<string>(movie?.title || '');
  const [director, setDirector] = useState<string>(movie?.director || '');
  const [releaseYear, setReleaseYear] = useState<string>(
    movie?.releaseYear?.toString() || '',
  );
  const [barcode, setBarcode] = useState<string>(movie?.barcode || '');
  const [genre, setGenre] = useState<string>(movie?.genre || '');
  const [rating, setRating] = useState<string>(
    movie?.rating !== null && movie?.rating !== undefined
      ? movie.rating.toString()
      : '',
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!director.trim()) {
      newErrors.director = 'Director is required';
    }

    if (!releaseYear.trim()) {
      newErrors.releaseYear = 'Release year is required';
    } else {
      const year = parseInt(releaseYear, 10);
      if (isNaN(year) || year < 1800 || year > new Date().getFullYear() + 10) {
        newErrors.releaseYear = 'Please enter a valid year';
      }
    }

    if (!barcode.trim()) {
      newErrors.barcode = 'Barcode is required';
    }

    if (!genre.trim()) {
      newErrors.genre = 'Genre is required';
    }

    if (rating.trim()) {
      const ratingNum = parseFloat(rating);
      if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
        newErrors.rating = 'Rating must be between 0 and 10';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const movieData: CreateMovieRequest | UpdateMovieRequest = {
      title: title.trim(),
      director: director.trim(),
      releaseYear: parseInt(releaseYear, 10),
      barcode: barcode.trim(),
      genre: genre.trim(),
      rating: rating.trim() ? parseFloat(rating) : null,
    };

    void onSubmit(movieData);
  };

  return (
    <form onSubmit={handleSubmit} className="movie-form">
      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <span id="title-error" className="error-text" role="alert">
            {errors.title}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="director">
          Director <span className="required">*</span>
        </label>
        <input
          type="text"
          id="director"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.director}
          aria-describedby={errors.director ? 'director-error' : undefined}
        />
        {errors.director && (
          <span id="director-error" className="error-text" role="alert">
            {errors.director}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="releaseYear">
          Release Year <span className="required">*</span>
        </label>
        <input
          type="number"
          id="releaseYear"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          disabled={isSubmitting}
          min="1800"
          max={new Date().getFullYear() + 10}
          aria-required="true"
          aria-invalid={!!errors.releaseYear}
          aria-describedby={
            errors.releaseYear ? 'releaseYear-error' : undefined
          }
        />
        {errors.releaseYear && (
          <span id="releaseYear-error" className="error-text" role="alert">
            {errors.releaseYear}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="barcode">
          Barcode <span className="required">*</span>
        </label>
        <input
          type="text"
          id="barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.barcode}
          aria-describedby={errors.barcode ? 'barcode-error' : undefined}
        />
        {errors.barcode && (
          <span id="barcode-error" className="error-text" role="alert">
            {errors.barcode}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="genre">
          Genre <span className="required">*</span>
        </label>
        <input
          type="text"
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.genre}
          aria-describedby={errors.genre ? 'genre-error' : undefined}
        />
        {errors.genre && (
          <span id="genre-error" className="error-text" role="alert">
            {errors.genre}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="rating">Rating (0-10)</label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          disabled={isSubmitting}
          min="0"
          max="10"
          step="0.1"
          aria-invalid={!!errors.rating}
          aria-describedby={errors.rating ? 'rating-error' : undefined}
        />
        {errors.rating && (
          <span id="rating-error" className="error-text" role="alert">
            {errors.rating}
          </span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Submitting...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
