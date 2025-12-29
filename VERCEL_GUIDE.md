# Deploying to Vercel

The current application is optimized for a VPS (Virtual Private Server) environment. To deploy on Vercel, you need to address two main incompatibilities due to Vercel's Serverless/Edge architecture.

## 1. Database (SQLite File)

**Current:** Uses `better-sqlite3` which reads `lelong.db` from the local disk.
**Problem:** Vercel filesystem is ephemeral (deleted after request).
**Solution:** Migrate to **Turso** (LibSQL) or **Cloudflare D1**.
Turso is compatible with SQLite, so you don't need to change your database schema.

### Steps to migrate to Turso:

1.  Sign up at [turso.tech](https://turso.tech).
2.  Create a database.
3.  Install the client: `npm install @libsql/client drizzle-orm`.
4.  Update `lib/db.ts` to use `@libsql/client` instead of `better-sqlite3`.
5.  Set `DATABASE_URL` and `TURSO_AUTH_TOKEN` in Vercel.

## 2. File Uploads (Images)

**Current:** Uploads images to `public/uploads` on the local disk.
**Problem:** You cannot write to `public/` folder on Vercel at runtime.
**Solution:** Use **Vercel Blob** or **UploadThing** or **AWS S3**.
Vercel Blob is the easiest integration.

### Steps to migrate to Vercel Blob:

1.  `npm install @vercel/blob`.
2.  Update `modules/product/actions.ts` to upload to Vercel Blob instead of `fs.writeFile`.
3.  Update the database to save the Blob URL.

## Summary

You cannot simply "upload" this code to Vercel without these code changes.

**Recommendation:**
If you want to use Vercel, I can refactor the code to support these services.

- Database: Turso (Free tier available)
- Storage: Vercel Blob (Free tier available)
