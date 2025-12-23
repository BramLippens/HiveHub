import {
  int,
  mysqlTable,
  varchar,
  float,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/mysql-core';

export const movies = mysqlTable(
  'movies',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    title: varchar('title', { length: 255 }).notNull(),
    director: varchar('director', { length: 255 }).notNull(),
    releaseYear: int('release_year').notNull(),
    barcode: varchar('barcode', { length: 13 }).notNull(),
    genre: varchar('genre', { length: 100 }).notNull(),
    rating: float('rating'),
  },
  (table) => [uniqueIndex('idx_barcode_unique').on(table.barcode)],
);

export const users = mysqlTable(
  'users',
  {
    id: int('id', { unsigned: true }).primaryKey().autoincrement(),
    email: varchar('email', { length: 255 }).notNull(),
    username: varchar('username', { length: 100 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('idx_email_unique').on(table.email),
    uniqueIndex('idx_username_unique').on(table.username),
  ],
);
