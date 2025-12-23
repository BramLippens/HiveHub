/**
 * App Component
 * Root component with routing configuration
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navigation } from './components/Navigation';
import { MoviesListPage } from './pages/MoviesListPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { AddMoviePage } from './pages/AddMoviePage';
import { EditMoviePage } from './pages/EditMoviePage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app">
          <Navigation />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Navigate to="/movies" replace />} />
              <Route path="/movies" element={<MoviesListPage />} />
              <Route path="/movies/new" element={<AddMoviePage />} />
              <Route path="/movies/:id" element={<MovieDetailPage />} />
              <Route path="/movies/:id/edit" element={<EditMoviePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

/**
 * NotFoundPage Component
 * 404 page for invalid routes
 */
function NotFoundPage() {
  return (
    <div className="page not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/movies" className="back-link">
        Go to Movies
      </a>
    </div>
  );
}

export default App;
