import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this file (works in both dev and production)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database configuration
// - In Production (Vercel): Uses TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
// - In Development: Uses local file (dev.db) if Env vars are missing
const getDbConfig = () => {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.TURSO_TOKEN || process.env.AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

  // Use production config if URL is present (Token might be optional for some setups, or embedded)
  // But for Turso/LibSQL usually token is needed.
  if (url) {
    return { 
      url, 
      authToken: authToken || undefined 
    };
  }

  // Fallback to local file for development
  // lib/.. -> project root
  const localPath = join(__dirname, '..', 'dev.db');
  return { url: `file:${localPath}` };
};

const client = createClient(getDbConfig());

// Create Drizzle instance with schema
const db = drizzle(client, { schema });

export default db;

// Export schema for convenience
export { schema };
