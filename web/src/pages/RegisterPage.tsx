/**
 * RegisterPage Component
 * Registration form page for new users
 */

import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthForm } from '../components/AuthForm';
import { ErrorMessage } from '../components/ErrorMessage';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  // If already logged in, redirect to movies
  if (user) {
    return <Navigate to="/movies" replace />;
  }

  const handleSubmit = async (
    email: string,
    username: string,
    password: string,
  ): Promise<void> => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await register(email, username, password);
      void navigate('/movies');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err : new Error('Failed to create account'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page add-movie-page">
      <header className="page-header">
        <h1>Create Account</h1>
        <p className="page-description">
          Sign up to start managing your movie collection
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
          mode="register"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--accent-color)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Log in here
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
