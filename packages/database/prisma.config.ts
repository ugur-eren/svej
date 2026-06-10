/* eslint-disable import/no-extraneous-dependencies */

import 'dotenv/config';
import {defineConfig, env} from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx seed.ts',
  },
  datasource: {
    url: env('SVEJ_DATABASE_URL'),
  },
});
