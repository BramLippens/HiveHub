# Project Context for Claude

## Project Overview

This is a collection management project built as a **monorepo** containing:
- **Backend API**: NestJS (currently in development)
- **Frontend**: React (planned for future development)

The monorepo structure allows for shared TypeScript types, coordinated deployments, and easier development across the full stack.

## Tech Stack

### Backend
- **Framework**: NestJS 11.x
- **Runtime**: Node.js with TypeScript 5.7.x
- **Platform**: Express (via @nestjs/platform-express)
- **Reactive Programming**: RxJS 7.x

### Development Tools
- **TypeScript**: 5.7.3
- **Testing**: Jest 30.x with ts-jest
- **Linting**: ESLint 9.x with TypeScript ESLint
- **Formatting**: Prettier 3.4.x
- **Build Tool**: NestJS CLI 11.x

## Project Structure (Monorepo)

```
collection-project/          # Root monorepo
├── api/                    # NestJS backend application
│   ├── src/               # Source code
│   │   ├── main.ts        # Application entry point
│   │   ├── app.module.ts  # Root module
│   │   ├── app.controller.ts
│   │   └── app.service.ts
│   ├── test/              # E2E tests
│   ├── api-requests.http  # HTTP client test requests
│   └── package.json       # Backend dependencies
├── web/                    # React frontend (planned)
│   └── (to be added)
├── shared/                 # Shared types/utilities (optional)
│   └── (to be added)
├── .idea/                  # PyCharm configuration
│   └── runConfigurations/ # Run configurations
├── CLAUDE.MD              # This file
└── .gitignore             # Git ignore rules
```

## Package Manager

This project uses **pnpm** for package management. Install it globally if you haven't:
```bash
npm install -g pnpm
```

## Available Scripts (API)

All commands should be run from the `api/` directory:

- `pnpm start` - Start the application
- `pnpm start:dev` - Start in watch mode (development)
- `pnpm start:debug` - Start in debug mode with watch
- `pnpm start:prod` - Start production build
- `pnpm build` - Build the application
- `pnpm test` - Run unit tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:cov` - Run tests with coverage
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm lint` - Lint and fix TypeScript files
- `pnpm format` - Format code with Prettier

## PyCharm Run Configurations

- **API Dev**: Runs `pnpm start:dev` in the api directory for development

## Development Guidelines

### Code Style
- Follow NestJS conventions and best practices
- Use TypeScript strict mode
- Apply dependency injection patterns
- Organize code by feature modules

### Testing
- Write unit tests for services and controllers
- Use Jest for testing framework
- Maintain test coverage
- Write E2E tests for critical user flows

### File Organization
- Controllers handle HTTP requests
- Services contain business logic
- Modules organize related functionality
- DTOs for data validation and transfer

## Common Tasks

### Adding a New Feature Module
1. Generate module: `nest g module <name>`
2. Generate controller: `nest g controller <name>`
3. Generate service: `nest g service <name>`
4. Import module in app.module.ts

### Running the Application
- Development: `npm run start:dev`
- Production: `npm run build && npm run start:prod`

### Debugging
- Use `npm run start:debug`
- Connect debugger on default Node.js debug port

## Important Notes

- This is a **monorepo** - multiple projects in one repository
- Uses **pnpm** as the package manager
- This is a private, unlicensed project
- Uses reflection metadata for decorators
- Express is the underlying HTTP platform
- All source files are in TypeScript

## Monorepo Benefits

1. **Shared Types**: TypeScript interfaces/DTOs can be shared between API and frontend
2. **Atomic Commits**: Changes spanning frontend/backend in one commit
3. **Simplified Development**: One repo to clone, one set of conventions
4. **Coordinated Releases**: Deploy related changes together

## Testing Endpoints

Use the `api/api-requests.http` file with PyCharm's HTTP Client to test API endpoints without leaving the IDE.

## Dependencies Notes

### Core Dependencies
- `@nestjs/common` - Common NestJS utilities and decorators
- `@nestjs/core` - Core NestJS framework
- `@nestjs/platform-express` - Express adapter
- `reflect-metadata` - Required for decorators to work
- `rxjs` - Reactive extensions for JavaScript

### When Working on This Project
1. Maintain TypeScript type safety
2. Follow NestJS module structure
3. Use decorators appropriately (@Controller, @Injectable, etc.)
4. Keep business logic in services
5. Validate input using DTOs
6. Write tests for new features
7. Run linter before committing
