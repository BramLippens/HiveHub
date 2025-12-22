# Quick Start Guide - React Frontend

## First Time Setup

```bash
cd web
pnpm install
```

## Daily Development

### 1. Start Backend (Terminal 1)
```bash
cd api
pnpm start:dev
```

Backend runs at: http://localhost:3000

### 2. Start Frontend (Terminal 2)
```bash
cd web
pnpm dev
```

Frontend runs at: http://localhost:5173

### 3. Open Browser
Navigate to http://localhost:5173

You should see the Collection Management app with an API connection status indicator.

## Common Commands

```bash
# Development
pnpm dev              # Start dev server with hot reload

# Code Quality
pnpm lint             # Lint and auto-fix code
pnpm format           # Format code with Prettier
pnpm type-check       # Check TypeScript types

# Build
pnpm build            # Build for production
pnpm preview          # Preview production build
```

## Verifying Setup

1. Start the backend: `cd api && pnpm start:dev`
2. Start the frontend: `cd web && pnpm dev`
3. Open http://localhost:5173
4. You should see "Connected to API successfully!" with the API response

## Troubleshooting

**Frontend won't start:**
- Check if port 5173 is available
- Run `pnpm install` to ensure dependencies are installed

**API connection fails:**
- Ensure backend is running on http://localhost:3000
- Check `vite.config.ts` proxy configuration
- Check browser console for errors

**TypeScript errors:**
- Run `pnpm type-check` to see all errors
- Make sure all types are properly defined
- Check that imports are correct

**Linting errors:**
- Run `pnpm lint` to auto-fix most issues
- Check `eslint.config.mjs` for configuration

## File Structure Reminder

```
web/src/
├── api/            # API integration (fetch calls)
├── components/     # Reusable UI components
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── pages/          # Page-level components
├── types/          # TypeScript interfaces
└── utils/          # Helper functions
```

## Next Steps

Now that the frontend is set up, you can:

1. Add React Router for navigation
2. Create your first feature module (e.g., collections)
3. Add authentication with Context API
4. Build reusable UI components
5. Set up testing with Vitest and React Testing Library

See `README.md` for detailed documentation.
