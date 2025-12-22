/**
 * Navigation Component
 * App navigation header with links to main pages
 */

import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Movie Collection
        </Link>
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
      </div>
    </nav>
  );
}
