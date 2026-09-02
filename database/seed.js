import bcrypt from 'bcryptjs';
import { db, initDatabase } from './connection.js';

export function seedDatabase() {
  initDatabase();

  // Check if categories already seeded
  const existingCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (existingCategories.count > 0) {
    console.log('Database already contains data, skipping re-seed.');
    return;
  }

  console.log('Seeding fresh database for Nashwa...');

  // 1. Seed Users
  const passwordHash = bcrypt.hashSync('password123', 10);
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `);
  insertUser.run('Anik Admin', 'anik@example.com', passwordHash, 'admin');
  insertUser.run('Nour Customer', 'demo@nashwa.com', passwordHash, 'customer');

  // 2. Seed Categories
  const insertCategory = db.prepare(`
    INSERT INTO categories (name, slug, description, icon, image)
    VALUES (?, ?, ?, ?, ?)
  `);

  const categories = [
    {
      name: 'Artisan Crafts',
      slug: 'artisan-crafts',
      description: 'Handcrafted pottery, leather goods, and intricate metalwork forged by master artisans.',
      icon: 'sparkles',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Botanical & Wellness',
      slug: 'botanical-wellness',
      description: 'Pure essential oils, traditional herbal apothecary, and soothing organic soaps.',
      icon: 'leaf',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Organic Pantry',
      slug: 'organic-pantry',
      description: 'Heritage spices, wild mountain honey, and small-batch cold-pressed oils.',
      icon: 'coffee',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Books & Wisdom',
      slug: 'books-wisdom',
      description: 'Handbound journals, classical poetry, calligraphy tools, and philosophy prints.',
      icon: 'book-open',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Feasts & Gastronomy',
      slug: 'feasts-gastronomy',
      description: 'Traditional cookware, hammered brass teapots, and communal feast essentials.',
      icon: 'utensils',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    }
  ];

  for (const cat of categories) {
    insertCategory.run(cat.name, cat.slug, cat.description, cat.icon, cat.image);
  }

  // 3. Seed Shops
  const insertShop = db.prepare(`
    INSERT INTO shops (name, slug, description, rating, banner, logo, location, owner_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const shops = [
    {
      name: 'Al-Bazaar Botanicals',
      slug: 'al-bazaar-botanicals',
      description: 'Hand-distilled essential oils and botanical skincare rooted in ancestral recipes.',
      rating: 4.9,
      banner: 'https://images.unsplash.com/photo-1512290900672-1f416e9196d4?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=200&q=80',
      location: 'Marrakech & Global Shipping',
      owner_name: 'Fatima Noor'
    },
    {
      name: 'Damascus Forge & Leather',
      slug: 'damascus-forge-leather',
      description: 'Full-grain vegetable-tanned leather goods and hand-hammered brass coffee vessels.',
      rating: 4.95,
      banner: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80',
      location: 'Old Damascus Quarter',
      owner_name: 'Tarek Al-Masri'
    },
    {
      name: 'Atlas Terracotta Studio',
      slug: 'atlas-terracotta-studio',
      description: 'Sculptural and functional ceramics made with sun-dried mountain clay.',
      rating: 4.88,
      banner: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=200&q=80',
      location: 'Fez Medina',
      owner_name: 'Yasmin Cherif'
    },
    {
      name: 'Silk & Saffron Guild',
      slug: 'silk-saffron-guild',
      description: 'Heritage super-grade saffron and masterfully hand-spun raw silk tapestries.',
      rating: 4.92,
      banner: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=200&q=80',
      location: 'Kashmir Valley',
      owner_name: 'Harun Qureshi'
    },
    {
      name: 'Al-Hikmah Press & Bindery',
      slug: 'al-hikmah-press',
      description: 'Preserving the art of hand-stitched archival paper, leather journals, and inkcraft.',
      rating: 4.97,
      banner: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80',
      location: 'Cairo Historic District',
      owner_name: 'Dr. Zayd Mansour'
    }
  ];

  for (const shop of shops) {
    insertShop.run(
      shop.name,
      shop.slug,
      shop.description,
      shop.rating,
      shop.banner,
      shop.logo,
      shop.location,
      shop.owner_name
    );
  }

  // 4. Seed Products
  const insertProduct = db.prepare(`
    INSERT INTO products (name, description, price, original_price, rating, reviews_count, image, category_id, shop_id, in_stock, tags, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    {
      name: 'Royal Moroccan Amber Oud Oil',
      description: 'Aged 12 years with organic amber resin and wild agarwood notes. Deep, warm, and lingering.',
      price: 68.0,
      original_price: 85.0,
      rating: 4.95,
      reviews_count: 84,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      category_id: 2,
      shop_id: 1,
      tags: 'Fragrance, Luxury, Handcrafted',
      is_featured: 1
    },
    {
      name: 'Hand-Hammered Damascus Brass Teapot',
      description: 'Pure solid brass kettle engraved with geometric Arabesque flourishes. Built to last generations.',
      price: 120.0,
      original_price: 145.0,
      rating: 4.9,
      reviews_count: 52,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      category_id: 5,
      shop_id: 2,
      tags: 'Feasts, Brass, Tableware',
      is_featured: 1
    },
    {
      name: 'Atlas Terracotta Serving Platter',
      description: 'Hand-thrown mountain clay platter with food-safe botanical white glaze. Ideal for feast banquets.',
      price: 54.0,
      original_price: 65.0,
      rating: 4.85,
      reviews_count: 39,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      category_id: 1,
      shop_id: 3,
      tags: 'Ceramics, Kitchen, Artisan',
      is_featured: 1
    },
    {
      name: 'Heritage Grade Negi Saffron (5g Tin)',
      description: 'Highest potency crimson stigma threads harvested by hand at dawn in Kashmir Valley.',
      price: 48.0,
      original_price: 60.0,
      rating: 4.98,
      reviews_count: 112,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      category_id: 3,
      shop_id: 4,
      tags: 'Organic, Gourmet, Spices',
      is_featured: 1
    },
    {
      name: 'Hand-Stitched Full Grain Leather Journal',
      description: '240 pages of heavy cotton rag archival paper bound in vegetable-tanned distressed saddle leather.',
      price: 42.0,
      original_price: 50.0,
      rating: 4.92,
      reviews_count: 67,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      category_id: 4,
      shop_id: 5,
      tags: 'Journal, Leather, Stationery',
      is_featured: 1
    },
    {
      name: 'Wild Mountain Sidr Honey (500g)',
      description: 'Raw, unpasteurized monofloral honey harvested from high-altitude desert Sidr blossoms.',
      price: 36.0,
      original_price: 45.0,
      rating: 4.94,
      reviews_count: 94,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      category_id: 3,
      shop_id: 4,
      tags: 'Honey, Organic, Pantry',
      is_featured: 0
    },
    {
      name: 'Natural Olive & Laurel Aleppo Soap Bar',
      description: 'Cold-cured for nine months with 40% laurel berry oil. Rich in restorative minerals.',
      price: 14.0,
      original_price: 18.0,
      rating: 4.88,
      reviews_count: 140,
      image: 'https://images.unsplash.com/photo-1607006310458-204a1122a7f0?auto=format&fit=crop&w=800&q=80',
      category_id: 2,
      shop_id: 1,
      tags: 'Bath, Soap, Organic',
      is_featured: 0
    },
    {
      name: 'Traditional Carved Wood Spice Pestle',
      description: 'Sculpted from sustainably reclaimed olive wood with rich contrast grain and heavy grip.',
      price: 38.0,
      original_price: 48.0,
      rating: 4.82,
      reviews_count: 28,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
      category_id: 1,
      shop_id: 3,
      tags: 'Woodcraft, Kitchen, Handcarved',
      is_featured: 0
    },
    {
      name: 'Ancient Inkstone & Bamboo Quill Set',
      description: 'Hand-carved slate stone with traditional charcoal ink stick and three precision bamboo nibs.',
      price: 45.0,
      original_price: 55.0,
      rating: 4.87,
      reviews_count: 31,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
      category_id: 4,
      shop_id: 5,
      tags: 'Calligraphy, Art, Wisdom',
      is_featured: 0
    },
    {
      name: 'Zellige Pattern Ceramic Tea Tumblers (Set of 4)',
      description: 'Double-walled hand-painted ceramic tumblers that retain heat without burning fingers.',
      price: 58.0,
      original_price: 72.0,
      rating: 4.91,
      reviews_count: 46,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      category_id: 5,
      shop_id: 3,
      tags: 'Tea, Ceramics, Gift',
      is_featured: 0
    }
  ];

  for (const prod of products) {
    insertProduct.run(
      prod.name,
      prod.description,
      prod.price,
      prod.original_price,
      prod.rating,
      prod.reviews_count,
      prod.image,
      prod.category_id,
      prod.shop_id,
      1,
      prod.tags,
      prod.is_featured
    );
  }

  // 5. Seed University Courses
  const insertCourse = db.prepare(`
    INSERT INTO courses (title, instructor, duration, level, rating, price, image, category, students_count, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const courses = [
    {
      title: 'The Art of Natural Perfumery & Botanical Scent Blending',
      instructor: 'Fatima Noor (Master Distiller)',
      duration: '6 Weeks (Self-paced + Live Labs)',
      level: 'All Levels',
      rating: 4.96,
      price: 89.0,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      category: 'Botanical Wisdom',
      students_count: 420,
      description: 'Learn ancient distillation techniques, pyramid scent architecture, resin extraction, and formulate your own signature eau de parfum.'
    },
    {
      title: 'Artisan Business Mastery: From Workshop to Global Brand',
      instructor: 'Tarek Al-Masri & Guest Mentors',
      duration: '8 Weeks',
      level: 'Intermediate',
      rating: 4.93,
      price: 120.0,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      category: 'Entrepreneurship',
      students_count: 615,
      description: 'Pricing handmade goods, global logistics, supply transparency, brand storytelling, and scaling without sacrificing soulful craftsmanship.'
    },
    {
      title: 'Heritage Ceramics: Clay Sourcing, Throwing & Earth Glazes',
      instructor: 'Yasmin Cherif (Ceramist)',
      duration: '4 Weeks',
      level: 'Beginner to Intermediate',
      rating: 4.9,
      price: 75.0,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
      category: 'Traditional Craft',
      students_count: 310,
      description: 'Master wheel throwing, pinch technique, natural slip creation, and wood-fired kiln science.'
    },
    {
      title: 'Culinary Storytelling: The Ancient Spice Routes & Feasting Traditions',
      instructor: 'Chef Harun Qureshi',
      duration: '5 Weeks',
      level: 'All Levels',
      rating: 4.98,
      price: 65.0,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      category: 'Gastronomy',
      students_count: 540,
      description: 'Unlock flavor layering, historical saffron and cardamom pairings, bread fermentation, and host meaningful communal feasts.'
    }
  ];

  for (const c of courses) {
    insertCourse.run(
      c.title,
      c.instructor,
      c.duration,
      c.level,
      c.rating,
      c.price,
      c.image,
      c.category,
      c.students_count,
      c.description
    );
  }

  // 6. Seed Events
  const insertEvent = db.prepare(`
    INSERT INTO events (title, description, date, location, price, image, category, capacity, enrolled_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const events = [
    {
      title: 'Autumn Solstice Feast & Live Oud Night',
      description: 'A 5-course seasonal dinner curated by heritage chefs, paired with acoustic live Oud performances in an open-air courtyard.',
      date: 'Saturday, Oct 24, 2026 • 7:00 PM',
      location: 'Nashwa Andalusian Courtyard',
      price: 55.0,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      category: 'Feast & Music',
      capacity: 60,
      enrolled_count: 48
    },
    {
      title: 'Medina Artisan Night Souk & Exhibition',
      description: 'Meet 30+ master craftsmen, witness live glassblowing and carpet weaving, and enjoy spiced mint tea under the stars.',
      date: 'Friday, Nov 12, 2026 • 6:00 PM',
      location: 'Historic Medina Pavilion',
      price: 0.0,
      image: 'https://images.unsplash.com/photo-1512290900672-1f416e9196d4?auto=format&fit=crop&w=800&q=80',
      category: 'Community Souk',
      capacity: 200,
      enrolled_count: 142
    },
    {
      title: 'Scent-Blending & Botanical Distillation Workshop',
      description: 'An intimate, hands-on masterclass where every attendee distills orange blossoms and creates a bespoke 30ml scent to keep.',
      date: 'Sunday, Nov 28, 2026 • 2:00 PM',
      location: 'The Botanical Glasshouse',
      price: 70.0,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      category: 'Workshop',
      capacity: 25,
      enrolled_count: 19
    },
    {
      title: 'Wild Sourdough & Clay Hearth Baking Experience',
      description: 'Learn slow fermentation using ancient grain flours and bake wood-fired loaves in our traditional outdoor stone oven.',
      date: 'Saturday, Dec 05, 2026 • 10:00 AM',
      location: 'Heritage Kitchen Farmhouse',
      price: 45.0,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      category: 'Culinary Craft',
      capacity: 30,
      enrolled_count: 22
    }
  ];

  for (const ev of events) {
    insertEvent.run(
      ev.title,
      ev.description,
      ev.date,
      ev.location,
      ev.price,
      ev.image,
      ev.category,
      ev.capacity,
      ev.enrolled_count
    );
  }

  console.log('Database seeded successfully with users, categories, shops, products, courses, and events!');
}

if (process.argv[1] === import.meta.filename) {
  seedDatabase();
}
