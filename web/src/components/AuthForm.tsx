/**
 * AuthForm Component
 * Reusable form for login and registration
 */

import { useState, type FormEvent } from 'react';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (
    email: string,
    username: string,
    password: string,
  ) => Promise<void>;
  isSubmitting: boolean;
}

export function AuthForm({ mode, onSubmit, isSubmitting }: AuthFormProps) {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isRegisterMode = mode === 'register';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Username validation (register only)
    if (isRegisterMode && !username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    void onSubmit(email.trim(), username.trim(), password);
  };

  return (
    <form onSubmit={handleSubmit} className="movie-form">
      <div className="form-group">
        <label htmlFor="email">
          Email <span className="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          autoComplete="email"
        />
        {errors.email && (
          <span id="email-error" className="error-text" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {isRegisterMode && (
        <div className="form-group">
          <label htmlFor="username">
            Username <span className="required">*</span>
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
            autoComplete="username"
          />
          {errors.username && (
            <span id="username-error" className="error-text" role="alert">
              {errors.username}
            </span>
          )}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="password">
          Password <span className="required">*</span>
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
        />
        {errors.password && (
          <span id="password-error" className="error-text" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting
            ? isRegisterMode
              ? 'Creating Account...'
              : 'Logging In...'
            : isRegisterMode
              ? 'Create Account'
              : 'Log In'}
        </button>
      </div>
    </form>
  );
}
