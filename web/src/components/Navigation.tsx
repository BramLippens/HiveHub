/**
 * Navigation Component
 * App navigation header with links to main pages
 */

import { Link } from 'react-router-dom';
import { ThemeSelector } from './ThemeSelector';

export function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Movie Collection
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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
        </div>
      </div>
    </nav>
  );
}
