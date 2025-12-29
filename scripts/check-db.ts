// Script to check and update database schema for Drizzle migration
import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = process.env.DATABASE_URL?.replace('file:', '') || join(process.cwd(), 'dev.db');
const db = new Database(dbPath);

console.log('📦 Checking database schema...\n');

// Get current schema
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables found:', tables.map((t: any) => t.name).join(', '));

// Check Product table structure
try {
  const productInfo = db.prepare("PRAGMA table_info(Product)").all();
  console.log('\nProduct table columns:');
  productInfo.forEach((col: any) => {
    console.log(`  - ${col.name} (${col.type})`);
  });
  
  // Check if category column exists
  const hasCategory = productInfo.some((col: any) => col.name === 'category');
  if (!hasCategory) {
    console.log('\n⚠️ Adding missing "category" column...');
    db.exec("ALTER TABLE Product ADD COLUMN category TEXT DEFAULT 'GOLD'");
    console.log('✅ Added category column');
  }
  
  // Check if status column exists
  const hasStatus = productInfo.some((col: any) => col.name === 'status');
  if (!hasStatus) {
    console.log('\n⚠️ Adding missing "status" column...');
    db.exec("ALTER TABLE Product ADD COLUMN status TEXT DEFAULT 'AVAILABLE'");
    console.log('✅ Added status column');
  }
} catch (err) {
  console.log('\n❌ Product table does not exist, creating...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS Product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      weight REAL NOT NULL,
      imageUrl TEXT NOT NULL,
      category TEXT DEFAULT 'GOLD',
      status TEXT DEFAULT 'AVAILABLE',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Product table created');
}

// Check Admin table
try {
  const adminInfo = db.prepare("PRAGMA table_info(Admin)").all();
  console.log('\nAdmin table columns:');
  adminInfo.forEach((col: any) => {
    console.log(`  - ${col.name} (${col.type})`);
  });
} catch (err) {
  console.log('\n❌ Admin table does not exist, creating...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS Admin (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
  console.log('✅ Admin table created');
}

// Check GlobalSettings table
try {
  const settingsInfo = db.prepare("PRAGMA table_info(GlobalSettings)").all();
  console.log('\nGlobalSettings table columns:');
  settingsInfo.forEach((col: any) => {
    console.log(`  - ${col.name} (${col.type})`);
  });
} catch (err) {
  console.log('\n❌ GlobalSettings table does not exist, creating...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS GlobalSettings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegramUrl TEXT DEFAULT 'https://t.me/'
    )
  `);
  console.log('✅ GlobalSettings table created');
}

// Show product count
try {
  const count = db.prepare("SELECT COUNT(*) as count FROM Product").get() as any;
  console.log(`\n📊 Products in database: ${count.count}`);
} catch (err) {
  console.log('\n📊 Could not count products');
}

console.log('\n✅ Database schema check complete!');
db.close();
