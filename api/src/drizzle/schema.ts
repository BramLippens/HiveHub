import {
  int,
  mysqlTable,
  varchar,
  float,
  uniqueIndex,
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
