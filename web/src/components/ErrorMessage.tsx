/**
 * ErrorMessage Component
 * Displays error messages with optional retry functionality
 */

interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="error-message" role="alert" aria-live="assertive">
      <h3>Error</h3>
      <p>{errorMessage}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
}
