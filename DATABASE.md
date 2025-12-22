# Database Setup Guide

## MySQL with Docker

This project uses PostgreSQL running in a Docker container.

### Prerequisites

- Docker and Docker Compose installed
- pnpm installed

### Start the Database

```bash
# Start MySQL container
docker-compose up -d

# Check if container is running
docker ps
```

### Environment Variables

The database configuration is in `api/.env`:

```env
DATABASE_URL=mysql://hivehub_user:hivehub_password@localhost:3306/hivehub
```

### Generate and Run Migrations

```bash
cd api
pnpm db:generate  # Generate migration from schema
pnpm db:migrate   # Run migrations
```

### Seed the Database

```bash
cd api
pnpm db:seed
```

This will:
1. Connect to MySQL
2. Clear existing movie data
3. Insert mock movie data

### Start the API

```bash
cd api
pnpm start:dev
```

The API will:
- Connect to MySQL
- Use Drizzle ORM for database operations
- Be available at http://localhost:3000

### Useful Docker Commands

```bash
# Stop the database
docker-compose down

# Stop and remove volumes (clears all data)
docker-compose down -v

# View database logs
docker logs hivehub-mysql

# Connect to MySQL CLI
docker exec -it hivehub-mysql mysql -u hivehub_user -p hivehub
```

### Database Schema

The `movies` table has the following structure:

```sql
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  director VARCHAR(255) NOT NULL,
  release_year INT NOT NULL,
  barcode VARCHAR(13) UNIQUE NOT NULL,
  genre VARCHAR(100) NOT NULL,
  rating DECIMAL(3,1)
);
```

### Troubleshooting

**Connection refused:**
- Make sure Docker is running
- Check if MySQL container is up: `docker ps`
- Restart the container: `docker-compose restart`

**Port already in use:**
- Another MySQL instance might be running
- Change the port in `docker-compose.yml` (e.g., `3307:3306`)
- Update the port in `DATABASE_URL` in `.env`

**Tables not created:**
- Run migrations: `pnpm db:generate && pnpm db:migrate`
- Check migration files in `migrations/` directory
- Run the seed script: `pnpm db:seed`
