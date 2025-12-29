import { defineConfig } from 'drizzle-kit';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get database path - same logic as lib/db.ts
const getDbPath = () => {
  const envPath = process.env.DATABASE_URL?.replace('file:', '').replace('./', '');
  if (envPath) {
    if (envPath.startsWith('/')) return envPath;
    return join(__dirname, envPath);
  }
  return join(__dirname, 'dev.db');
};

export default defineConfig({
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: getDbPath(),
  },
});
