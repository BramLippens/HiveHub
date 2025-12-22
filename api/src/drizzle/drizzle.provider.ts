import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/mysql2';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';

export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';

export type DatabaseProvider = MySql2Database<typeof schema> & {
  $client: mysql.Pool;
};

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const databaseUrl = configService.get<string>('DATABASE_URL');

      if (!databaseUrl) {
        throw new Error('DATABASE_URL is not configured');
      }

      const connection = mysql.createPool({
        uri: databaseUrl,
        connectionLimit: 5,
      });

      return drizzle(connection, {
        schema,
        mode: 'default',
      });
    },
  },
];

export const InjectDrizzle = () => Inject(DrizzleAsyncProvider);
