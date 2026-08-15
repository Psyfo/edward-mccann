// Applies a SQL file from db/ inside a single transaction.
//
// This is not a migration framework and is not trying to be one. The schema
// was built by Payload's development push, so there is no migration history to
// extend; these files exist so that the handful of changes made outside push
// are written down, reviewable, and repeatable against the production database
// when there is one. Adopting Payload migrations properly is a separate job,
// noted in docs/content-open-questions.md.
//
// Usage:
//   doppler run --project edward-mccann --config stg -- node tools/db-apply.mjs db/001-user-roles.sql

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

const file = process.argv[2];
if (!file) {
  console.error('usage: node tools/db-apply.mjs <path to .sql>');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Run under `doppler run --project edward-mccann --config <cfg>`.');
  process.exit(1);
}

const sql = await readFile(path.resolve(file), 'utf8');
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
try {
  await client.query('BEGIN');
  await client.query(sql);
  await client.query('COMMIT');
  console.log(`applied ${path.basename(file)}`);
} catch (error) {
  await client.query('ROLLBACK');
  console.error(`rolled back ${path.basename(file)}: ${error.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
