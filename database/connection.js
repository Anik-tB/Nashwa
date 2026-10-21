import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'nashwa.sqlite');
export const db = new DatabaseSync(dbPath);

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      avatar_url TEXT,
      guild_tier TEXT DEFAULT 'Artisan Fellow',
      patron_points INTEGER DEFAULT 340,
      provider TEXT DEFAULT 'email',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS shops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      rating REAL DEFAULT 5.0,
      banner TEXT,
      logo TEXT,
      location TEXT,
      owner_name TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      image TEXT,
      category_id INTEGER,
      shop_id INTEGER,
      in_stock INTEGER DEFAULT 1,
      tags TEXT,
      is_featured INTEGER DEFAULT 0,
      batch_code TEXT DEFAULT 'MKH-2026-0104',
      origin TEXT DEFAULT 'Marrakech Medina Atelier',
      materials TEXT DEFAULT '100% Organic & Ethically Sourced',
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (shop_id) REFERENCES shops(id)
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      instructor TEXT NOT NULL,
      duration TEXT NOT NULL,
      level TEXT NOT NULL,
      rating REAL DEFAULT 5.0,
      price REAL NOT NULL,
      image TEXT,
      category TEXT,
      students_count INTEGER DEFAULT 0,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      category TEXT,
      capacity INTEGER DEFAULT 50,
      enrolled_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      items_json TEXT NOT NULL,
      total_amount REAL NOT NULL,
      payment_method TEXT DEFAULT 'bkash',
      packaging_type TEXT DEFAULT 'linen',
      gift_note TEXT,
      status TEXT DEFAULT 'confirmed',
      tracking_stage INTEGER DEFAULT 2,
      courier_name TEXT DEFAULT 'Nashwa Royal Courier',
      tracking_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      is_verified_patron INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS artisan_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER NOT NULL,
      sender_name TEXT NOT NULL,
      sender_email TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (shop_id) REFERENCES shops(id)
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safe migration for existing SQLite orders table
  try {
    const tableInfo = db.prepare('PRAGMA table_info(orders)').all();
    const cols = tableInfo.map(c => c.name);
    if (!cols.includes('customer_phone')) {
      db.prepare('ALTER TABLE orders ADD COLUMN customer_phone TEXT').run();
    }
    if (!cols.includes('payment_method')) {
      db.prepare("ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'bkash'").run();
    }
  } catch (mErr) {
    // Table may not exist yet or already altered
  }

  // Safe migration for existing SQLite products table
  try {
    const pInfo = db.prepare('PRAGMA table_info(products)').all();
    const pCols = pInfo.map(c => c.name);
    if (!pCols.includes('batch_code')) {
      db.prepare("ALTER TABLE products ADD COLUMN batch_code TEXT DEFAULT 'MKH-2026-0104'").run();
    }
    if (!pCols.includes('origin')) {
      db.prepare("ALTER TABLE products ADD COLUMN origin TEXT DEFAULT 'Barlekha, Moulvibazar, Sylhet'").run();
    }
    if (!pCols.includes('materials')) {
      db.prepare("ALTER TABLE products ADD COLUMN materials TEXT DEFAULT '100% Organic & Ethically Sourced'").run();
    }
    if (!pCols.includes('craft_story')) {
      db.prepare("ALTER TABLE products ADD COLUMN craft_story TEXT").run();
    }
  } catch (mErr) {
    // Table may not exist yet or already altered
  }

  // Safe migration for existing SQLite reviews table
  try {
    const rInfo = db.prepare('PRAGMA table_info(reviews)').all();
    const rCols = rInfo.map(c => c.name);
    if (!rCols.includes('is_verified_patron')) {
      db.prepare("ALTER TABLE reviews ADD COLUMN is_verified_patron INTEGER DEFAULT 1").run();
    }
  } catch (mErr) {
    // Table may not exist yet or already altered
  }

  console.log('Database initialized successfully at', dbPath);
}
