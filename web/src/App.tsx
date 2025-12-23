/**
 * App Component
 * Root component with routing configuration
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MoviesListPage } from './pages/MoviesListPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { AddMoviePage } from './pages/AddMoviePage';
import { EditMoviePage } from './pages/EditMoviePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return <Navigate to={user ? '/movies' : '/login'} replace />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="app">
            <Navigation />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/movies"
                  element={
                    <ProtectedRoute>
                      <MoviesListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/movies/new"
                  element={
                    <ProtectedRoute>
                      <AddMoviePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/movies/:id"
                  element={
                    <ProtectedRoute>
                      <MovieDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/movies/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditMoviePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
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
