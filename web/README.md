# Collection Management - React Frontend

React + TypeScript frontend application for the Collection Management project, following HOGENT Frontend Web Development course patterns.

## Tech Stack

- **Framework**: React 19.x
- **Language**: TypeScript 5.9.x (strict mode)
- **Build Tool**: Vite 7.x
- **Linting**: ESLint 9.x with TypeScript ESLint
- **Formatting**: Prettier 3.7.x
- **Package Manager**: pnpm

## Project Structure

```
web/src/
├── components/     # Reusable UI components
├── pages/          # Route-level components (full pages)
├── contexts/       # React Context providers for global state
├── api/            # API integration layer
├── hooks/          # Custom React hooks
├── types/          # TypeScript interfaces and types
└── utils/          # Utility functions and helpers
```

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- pnpm (install globally: `npm install -g pnpm`)
- Backend API running on http://localhost:3000

### Installation

From the `web/` directory:

```bash
pnpm install
```

### Development

Start the development server with hot reload:

```bash
pnpm dev
```

The app will be available at http://localhost:5173

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production (includes TypeScript compilation)
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Lint and auto-fix TypeScript/React files
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript compiler without emitting files
- `pnpm test` - Run tests (placeholder for now)

## Configuration

### API Proxy

The Vite dev server is configured to proxy API requests to the backend:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- All requests to `/api/*` are automatically proxied to the backend

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Available variables:

- `VITE_API_BASE_URL` - Base URL for API calls (default: `/api`)

## Code Style

This project follows strict TypeScript and React best practices:

### TypeScript

- Strict mode enabled with all checks
- No `any` types allowed (use explicit types)
- Explicit return types recommended
- Proper null checking with `strictNullChecks`

### React Patterns

- Functional components only (no class components)
- React hooks for state and side effects
- Context API for global state
- Custom hooks for reusable logic
- One component per file with named exports

### Code Organization

- **Components**: Reusable UI elements (Button, Card, Input, etc.)
- **Pages**: Full page components tied to routes
- **Contexts**: Global state management via React Context
- **API Layer**: Centralized API calls with proper error handling
- **Hooks**: Custom hooks for data fetching and reusable logic
- **Types**: Shared TypeScript interfaces (preferably shared with backend)

## Development Guidelines

### Adding a New Feature

1. Create necessary types in `src/types/`
2. Add API integration in `src/api/`
3. Create custom hooks in `src/hooks/` if needed
4. Build UI components in `src/components/`
5. Create page component in `src/pages/`
6. Add route in `App.tsx`

### State Management

- **Local state**: Use `useState` for component-level state
- **Global state**: Use Context API for app-wide state (auth, theme, etc.)
- **Server state**: Custom hooks with `useEffect` for data fetching

### Error Handling

- All API calls should handle errors gracefully
- Display user-friendly error messages
- Implement loading states for async operations
- Handle edge cases (empty states, no data, etc.)

### Accessibility

- Use semantic HTML elements
- Include ARIA labels where appropriate
- Ensure keyboard navigation works
- Test with screen readers

## Testing

Tests will use:

- React Testing Library
- Vitest
- User-centric testing approach (test behavior, not implementation)

(Testing setup to be completed in future sprint)

## Integration with Backend

### API Structure

The backend runs on port 3000 with routes prefixed with `/api`:

```
Backend: http://localhost:3000
Endpoints: /api/collections, /api/items, etc.

Frontend proxy: /api/* → http://localhost:3000/api/*
```

### Type Sharing

TypeScript types should be shared between frontend and backend via the `shared/` directory at the monorepo root when possible.

## Troubleshooting

### Port already in use

If port 5173 is already in use, Vite will automatically try the next available port (5174, 5175, etc.)

### API connection fails

1. Ensure the backend is running on http://localhost:3000
2. Check that the backend has CORS properly configured
3. Verify the proxy configuration in `vite.config.ts`

### TypeScript errors

Run `pnpm type-check` to see all TypeScript errors without building.

### Linting errors

Run `pnpm lint` to automatically fix most linting issues.

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [HOGENT Frontend Course](https://github.com/HOGENT-frontendweb/frontendweb-cursus)
