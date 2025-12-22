# Quick Start Guide

## Setup Steps

### 1. Start MySQL

```bash
docker-compose up -d
```

### 2. Install Dependencies

```bash
cd api
pnpm install
```

### 3. Generate and Run Migrations

```bash
cd api
pnpm db:generate
pnpm db:migrate
```

### 4. Seed the Database

```bash
cd api
pnpm db:seed
```

You should see:
```
🌱 Starting database seeding...
🗑️  Resetting database...
✅ Database reset completed
🎬 Seeding movies...
✅ Movies seeded successfully
🎉 Database seeding completed successfully!
```

### 5. Start the API

Run the **API Dev** configuration in PyCharm, or:

```bash
cd api
pnpm start:dev
```

### 6. Test the API

Open `api/api-requests.http` and click the green play buttons to test:

- ✅ Get all movies
- ✅ Get movie by ID
- ✅ Search by barcode
- ✅ Create new movie
- ✅ Update movie
- ✅ Delete movie

## What Changed from Mock Data?

### Before (Chapter 3):
- In-memory array of movies
- Data reset on restart
- No persistence

### After (Chapter 4 - with Drizzle):
- MySQL database
- **Drizzle ORM** (as taught in HOGENT course)
- Data persists between restarts
- Migration-based schema management

### Key Files Added:
- `docker-compose.yml` - MySQL container
- `api/.env` - Environment variables (DATABASE_URL)
- `api/drizzle.config.ts` - Drizzle configuration
- `api/src/drizzle/schema.ts` - Drizzle schema definition
- `api/src/drizzle/drizzle.provider.ts` - Drizzle async provider
- `api/src/drizzle/drizzle.module.ts` - Drizzle module
- `api/src/database/seed.ts` - Database seeding

### Key Files Modified:
- `api/src/app.module.ts` - Removed TypeORM, kept ConfigModule
- `api/src/movies/movies.module.ts` - Imports DrizzleModule
- `api/src/movies/movies.service.ts` - Now uses Drizzle queries
- `api/src/movies/movies.controller.ts` - Added async/await

## HOGENT Course Patterns Applied:

✓ **Drizzle ORM** (exactly as taught in course)
✓ Environment-based configuration with ConfigModule
✓ Async provider pattern for database connection
✓ Schema-first approach with Drizzle
✓ Migration-based database management
✓ Database seeding with dedicated script
✓ Docker for local MySQL development
✓ Connection pooling (5 connections)
✓ Proper cleanup on module destroy

## Next Steps:

- Add validation with class-validator (Chapter 5)
- Add authentication (Chapter 6)
- Add API documentation with Swagger (Chapter 7)
