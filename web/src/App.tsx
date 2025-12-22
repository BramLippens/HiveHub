import { useEffect, useState } from 'react';
import './App.css';
import { getHealthStatus, type HealthResponse } from './api/health.api';

interface ApiState {
  loading: boolean;
  error: string | null;
  data: HealthResponse | null;
}

function App() {
  const [apiState, setApiState] = useState<ApiState>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        setApiState({ loading: true, error: null, data: null });
        const response = await getHealthStatus();
        setApiState({ loading: false, error: null, data: response });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to connect to API';
        setApiState({ loading: false, error: errorMessage, data: null });
      }
    };

    void checkApiConnection();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Collection Management</h1>
        <p>React + TypeScript + Vite + NestJS</p>
      </header>

      <main className="app-main">
        <section className="api-status">
          <h2>API Connection Status</h2>

          {apiState.loading && (
            <div className="status loading">
              <p>Checking API connection...</p>
            </div>
          )}

          {apiState.error && (
            <div className="status error">
              <p>Error: {apiState.error}</p>
              <p className="help-text">
                Make sure the NestJS backend is running on http://localhost:3000
              </p>
            </div>
          )}

          {apiState.data && (
            <div className="status success">
              <p>Connected to API successfully!</p>
              <pre>{JSON.stringify(apiState.data, null, 2)}</pre>
            </div>
          )}
        </section>

        <section className="info">
          <h2>Getting Started</h2>
          <ul>
            <li>
              <strong>Frontend:</strong> React + TypeScript running on Vite dev
              server (port 5173)
            </li>
            <li>
              <strong>Backend:</strong> NestJS API (port 3000)
            </li>
            <li>
              <strong>API Proxy:</strong> Requests to <code>/api/*</code> are
              proxied to backend
            </li>
            <li>
              <strong>Hot Reload:</strong> Edit files and see changes instantly
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
