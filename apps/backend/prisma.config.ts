/// <reference types="node" />
import { defineConfig } from 'prisma/config';

// Prisma 7 config (replaces the deprecated package.json#prisma block). We read DATABASE_URL from
// process.env directly (not the `env()` helper, which resolves eagerly and would throw during the
// build-time `prisma generate`, when DATABASE_URL isn't set). At migrate-time the container env
// (docker-compose env_file) provides it; for local CLI runs it's passed inline.
export default defineConfig({
  schema: 'prisma/schema',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL ?? '' },
});
