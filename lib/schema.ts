import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ============================================
// SCHEMA DEFINITIONS (seperti models.py Flask)
// ============================================

// Model untuk Produk Emas/Gadget
export const products = sqliteTable('Product', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),        // Harga Buka (Open Bid)
  weight: real('weight').notNull(),      // Berat dalam gram
  imageUrl: text('imageUrl').notNull(),  // Path gambar yang diupload
  category: text('category').default('GOLD'),       // "GOLD" or "GADGET"
  status: text('status').default('AVAILABLE'),      // "AVAILABLE" or "SOLD"
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

// Model untuk Login Admin
export const admins = sqliteTable('Admin', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  password: text('password').notNull(),
});

// Konfigurasi Global Sistem
export const globalSettings = sqliteTable('GlobalSettings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  telegramUrl: text('telegramUrl').default('https://t.me/'),
});

// Type exports untuk TypeScript
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type GlobalSetting = typeof globalSettings.$inferSelect;
