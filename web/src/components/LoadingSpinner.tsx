/**
 * LoadingSpinner Component
 * Displays a loading indicator
 */

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({
  message = 'Loading...',
}: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}
