import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema';
import { mockMovies } from '../data/mock-movies';

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 5,
});

const db = drizzle(connection, {
  schema,
  mode: 'default',
});

async function resetDatabase() {
  console.log('🗑️  Resetting database...');

  await db.delete(schema.movies);

  console.log('✅ Database reset completed\n');
}

async function seedMovies() {
  console.log('🎬 Seeding movies...');

  await db.insert(schema.movies).values(mockMovies);

  console.log('✅ Movies seeded successfully\n');
}

async function main() {
  console.log('🌱 Starting database seeding...\n');

  await resetDatabase();
  await seedMovies();

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .then(async () => {
    await connection.end();
  })
  .catch(async (e) => {
    console.error(e);
    await connection.end();
    process.exit(1);
  });
