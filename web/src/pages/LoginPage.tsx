/**
 * LoginPage Component
 * Login form page with authentication
 */

import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthForm } from '../components/AuthForm';
import { ErrorMessage } from '../components/ErrorMessage';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  // If already logged in, redirect to movies
  if (user) {
    return <Navigate to="/movies" replace />;
  }

  const handleSubmit = async (
    email: string,
    _username: string,
    password: string,
  ): Promise<void> => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await login(email, password);
      void navigate('/movies');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err : new Error('Failed to log in'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page add-movie-page">
      <header className="page-header">
        <h1>Log In</h1>
        <p className="page-description">
          Sign in to your account to manage your movie collection
        </p>
      </header>

      {submitError && (
        <ErrorMessage
          error={submitError}
          onRetry={() => setSubmitError(null)}
        />
      )}

      <section className="form-section">
        <AuthForm
          mode="login"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--accent-color)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Create one here
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
