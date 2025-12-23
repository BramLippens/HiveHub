/**
 * Navigation Component
 * App navigation header with links to main pages
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ThemeSelector } from './ThemeSelector';
import { UserMenu } from './UserMenu';

export function Navigation() {
  const { user } = useAuth();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Movie Collection
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user ? (
            <>
              <ul className="nav-links">
                <li>
                  <Link to="/movies">All Movies</Link>
                </li>
                <li>
                  <Link to="/movies/new" className="nav-button-primary">
                    Add Movie
                  </Link>
                </li>
              </ul>
              <ThemeSelector />
              <UserMenu />
            </>
          ) : (
            <>
              <ul className="nav-links">
                <li>
                  <Link to="/login">Log In</Link>
                </li>
                <li>
                  <Link to="/register" className="nav-button-primary">
                    Sign Up
                  </Link>
                </li>
              </ul>
              <ThemeSelector />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
