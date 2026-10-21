import bcrypt from 'bcryptjs';
import { db, initDatabase } from './connection.js';

export function seedDatabase(force = false) {
  initDatabase();

  if (force) {
    console.log('Force re-seeding: clearing existing catalog tables...');
    db.exec(`
      DELETE FROM reviews;
      DELETE FROM products;
      DELETE FROM shops;
      DELETE FROM categories;
      DELETE FROM courses;
      DELETE FROM events;
    `);
  } else {
    const existing = db.prepare('SELECT COUNT(*) as count FROM products').get();
    if (existing.count > 0) {
      console.log('Database already contains catalog data. Pass force=true to re-seed.');
      return;
    }
  }

  console.log('Seeding Bangladesh Heritage Artisan Database for Nashwa...');

  // 1. Seed Users
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    const passwordHash = bcrypt.hashSync('password123', 10);
    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);
    insertUser.run('Anik Admin', 'anik@example.com', passwordHash, 'admin');
    insertUser.run('Nour Customer', 'demo@nashwa.com', passwordHash, 'customer');
  }

  // 2. Seed Categories
  const insertCategory = db.prepare(`
    INSERT INTO categories (id, name, slug, description, icon, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const categories = [
    {
      id: 1,
      name: 'Artisan Crafts',
      slug: 'artisan-crafts',
      description: 'Handcrafted pottery, leather goods, and intricate metalwork forged by master artisans.',
      icon: 'sparkles',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Botanical & Wellness',
      slug: 'botanical-wellness',
      description: 'Pure essential oils, traditional herbal apothecary, and soothing organic soaps.',
      icon: 'leaf',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      name: 'Organic Pantry',
      slug: 'organic-pantry',
      description: 'Heritage spices, wild mountain honey, and small-batch cold-pressed oils.',
      icon: 'coffee',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      name: 'Books & Wisdom',
      slug: 'books-wisdom',
      description: 'Handbound journals, classical poetry, calligraphy tools, and philosophy prints.',
      icon: 'book-open',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      name: 'Feasts & Gastronomy',
      slug: 'feasts-gastronomy',
      description: 'Traditional cookware, hammered brass teapots, and communal feast essentials.',
      icon: 'utensils',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    }
  ];

  for (const cat of categories) {
    insertCategory.run(cat.id, cat.name, cat.slug, cat.description, cat.icon, cat.image);
  }

  // 3. Seed Shops (Bangladesh Heritage Guilds & Ateliers)
  const insertShop = db.prepare(`
    INSERT INTO shops (id, name, slug, description, rating, banner, logo, location, owner_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const shops = [
    {
      id: 1,
      name: 'Sylhet Agarwood & Dehn Al-Oud Distillers',
      slug: 'sylhet-agarwood-oud',
      description: 'Traditional forest distillation of authentic wild Agarwood attar rooted in ancient Barlekha recipes.',
      rating: 4.96,
      banner: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=200&q=80',
      location: 'Barlekha, Moulvibazar, Sylhet',
      owner_name: 'Al-Hajj Nazrul Islam'
    },
    {
      id: 2,
      name: 'Dhamrai Brass & Bell-Metal Guild',
      slug: 'dhamrai-brass-guild',
      description: 'Centuries-old lost-wax bell metal casting and hand-hammered heirloom brass dining vessels.',
      rating: 4.98,
      banner: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80',
      location: 'Dhamrai Artisan Quarter, Dhaka',
      owner_name: 'Sukanta Banik'
    },
    {
      id: 3,
      name: 'Bijoypur Terracotta & Ceramic Studio',
      slug: 'bijoypur-terracotta',
      description: 'Sculptural and tableware red pottery hand-thrown using mineral-rich Lalmai mountain clay.',
      rating: 4.90,
      banner: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=200&q=80',
      location: 'Bijoypur Hills, Comilla',
      owner_name: 'Narayan Pal'
    },
    {
      id: 4,
      name: 'Sundarbans Wild Honey & Forest Botanicals',
      slug: 'sundarbans-wild-honey',
      description: 'Unpasteurized monofloral Khalisha and Bain blossom honey gathered deep within mangrove reserves.',
      rating: 4.95,
      banner: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=200&q=80',
      location: 'Sundarbans Biosphere & Mongla',
      owner_name: 'Mizanur Rahman (Mawali)'
    },
    {
      id: 5,
      name: 'Sonargaon Jamdani & Rajshahi Silk Guild',
      slug: 'sonargaon-jamdani-silk',
      description: 'Preserving 200-count heritage Jamdani geometric weaves and pure mulberry Rajshahi silk.',
      rating: 4.99,
      banner: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
      logo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80',
      location: 'Sonargaon Weavers Colony & Rajshahi',
      owner_name: 'Begum Shahana Akter'
    }
  ];

  for (const shop of shops) {
    insertShop.run(
      shop.id,
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

  // 4. Seed Products (Handcrafted Heritage Creations)
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, name, description, price, original_price, rating, reviews_count, image,
      category_id, shop_id, in_stock, tags, is_featured, batch_code, origin, materials
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    {
      id: 1,
      name: 'Pure Sylhet Dehn Al-Oud Kalakassi (12ml)',
      description: 'Aged 12 years with wild Barlekha agarwood heartwood. Deep, warm resinous luxury aroma that lingers for days.',
      price: 65.0,
      original_price: 85.0,
      rating: 4.96,
      reviews_count: 94,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      category_id: 2,
      shop_id: 1,
      in_stock: 1,
      tags: 'Fragrance, Luxury, Attar, Sylhet',
      is_featured: 1,
      batch_code: 'SYL-2026-0081',
      origin: 'Barlekha, Moulvibazar, Sylhet',
      materials: '100% Pure Wild Agarwood Dehn Al-Oud'
    },
    {
      id: 2,
      name: 'Hand-Hammered Dhamrai Bell-Metal (Kasha) Teapot',
      description: 'Pure bell-metal (কাঁসা) cast using ancient lost-wax technique. Built to retain heat and enrich every brew.',
      price: 95.0,
      original_price: 115.0,
      rating: 4.98,
      reviews_count: 62,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      category_id: 5,
      shop_id: 2,
      in_stock: 1,
      tags: 'Kasha, Brass, Tableware, Dhamrai',
      is_featured: 1,
      batch_code: 'DHM-2026-0014',
      origin: 'Dhamrai Metal Heritage Guild, Dhaka',
      materials: 'Bell Metal (78% Copper, 22% Tin), Lost-Wax Cast'
    },
    {
      id: 3,
      name: 'Bijoypur Terracotta Hand-Thrown Serving Platter',
      description: 'Sculpted from natural Lalmai red mountain clay with food-safe botanical white glaze. Ideal for feasts.',
      price: 32.0,
      original_price: 42.0,
      rating: 4.88,
      reviews_count: 44,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      category_id: 1,
      shop_id: 3,
      in_stock: 1,
      tags: 'Ceramics, Terracotta, Comilla',
      is_featured: 1,
      batch_code: 'BJP-2026-0033',
      origin: 'Bijoypur Red Clay Kilns, Comilla',
      materials: 'High-Fired Lalmai Red Clay, Natural Mineral Slip'
    },
    {
      id: 4,
      name: 'Sundarbans Wild Khalisha Flower Raw Honey (500g)',
      description: 'Harvested by certified Mawalis at dawn deep within mangrove reserves. Rich, thick, aromatic and unfiltered.',
      price: 22.0,
      original_price: 28.0,
      rating: 4.97,
      reviews_count: 128,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      category_id: 3,
      shop_id: 4,
      in_stock: 1,
      tags: 'Honey, Sundarbans, Raw, Organic',
      is_featured: 1,
      batch_code: 'SBN-2026-0062',
      origin: 'Sundarbans Mangrove Reserve, Khulna',
      materials: '100% Raw Unpasteurized Wild Khalisha Nectar'
    },
    {
      id: 5,
      name: 'Hand-Spun Tangail Fine Khadi & Indigo Scarf',
      description: 'Woven on wooden pit-looms using hand-spun desi cotton and fermented true botanical indigo vat dyes.',
      price: 38.0,
      original_price: 48.0,
      rating: 4.94,
      reviews_count: 76,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      category_id: 4,
      shop_id: 5,
      in_stock: 1,
      tags: 'Handloom, Indigo, Tangail, Textile',
      is_featured: 1,
      batch_code: 'TGL-2026-0009',
      origin: 'Tangail Handloom Weavers Colony',
      materials: '100% Hand-Spun Desi Cotton, Natural Fermented Indigo'
    },
    {
      id: 6,
      name: 'Pure Mustard Seed & Kalonji Cold-Pressed Ghani Oil (250ml)',
      description: 'Stone-crushed at ambient room temperature in traditional wooden Ghani presses. Intensely aromatic.',
      price: 14.0,
      original_price: 18.0,
      rating: 4.92,
      reviews_count: 105,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      category_id: 3,
      shop_id: 4,
      in_stock: 1,
      tags: 'Ghani, Mustard, Pantry, Organic',
      is_featured: 0,
      batch_code: 'NTR-2026-0019',
      origin: 'Natore Wooden Ghani Guild',
      materials: '100% Cold-Pressed Black Mustard & Black Cumin Seeds'
    },
    {
      id: 7,
      name: 'Natural Turmeric & Sandalwood Herbal Bath Bar',
      description: 'Cold-cured with organic hill tracts turmeric, wild sandalwood oil, and virgin coconut butter.',
      price: 10.0,
      original_price: 14.0,
      rating: 4.89,
      reviews_count: 156,
      image: 'https://images.unsplash.com/photo-1607006310458-204a1122a7f0?auto=format&fit=crop&w=800&q=80',
      category_id: 2,
      shop_id: 1,
      in_stock: 1,
      tags: 'Soap, Herbal, Turmeric, Wellness',
      is_featured: 0,
      batch_code: 'CHT-2026-0028',
      origin: 'Chittagong Hill Tracts Botanical Atelier',
      materials: 'Hill Tracts Wild Turmeric, Red Sandalwood, Coconut Oil'
    },
    {
      id: 8,
      name: 'Traditional Carved Jashore Date-Palm Wood Spice Mortar',
      description: 'Sculpted from aged reclaimed date-palm and tamarind heartwood with rich deep contrast grain.',
      price: 28.0,
      original_price: 36.0,
      rating: 4.86,
      reviews_count: 32,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
      category_id: 1,
      shop_id: 3,
      in_stock: 1,
      tags: 'Woodcraft, Kitchen, Handcarved, Jashore',
      is_featured: 0,
      batch_code: 'JSR-2026-0045',
      origin: 'Jashore Woodcarvers Guild',
      materials: 'Salvaged Tamarind & Date-Palm Heartwood'
    },
    {
      id: 9,
      name: 'Handmade Golden Jute & Leather Archival Journal',
      description: '240 deckle-edge cotton rag pages bound in golden unbleached jute cloth and vegetable-tanned leather.',
      price: 25.0,
      original_price: 32.0,
      rating: 4.90,
      reviews_count: 48,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
      category_id: 4,
      shop_id: 5,
      in_stock: 1,
      tags: 'Jute, Journal, Leather, Stationery',
      is_featured: 0,
      batch_code: 'DHK-2026-0077',
      origin: 'Dhaka Guild Paper Bindery',
      materials: 'Natural Golden Jute Fiber, Cotton Rag Archival Paper'
    },
    {
      id: 10,
      name: 'Clay Hearth Terracotta Tea Tumblers (Matir Bhar - Set of 4)',
      description: 'Double-walled hand-thrown clay tumblers that impart authentic earthen aroma to every cup of Cha.',
      price: 18.0,
      original_price: 24.0,
      rating: 4.93,
      reviews_count: 85,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      category_id: 5,
      shop_id: 3,
      in_stock: 1,
      tags: 'Tea, Cha, Terracotta, Matir Bhar',
      is_featured: 0,
      batch_code: 'RYB-2026-0088',
      origin: 'Rayerbazar Potter’s Quarter, Dhaka',
      materials: 'Unglazed Natural River Silt Terracotta Clay'
    }
  ];

  for (const prod of products) {
    insertProduct.run(
      prod.id,
      prod.name,
      prod.description,
      prod.price,
      prod.original_price,
      prod.rating,
      prod.reviews_count,
      prod.image,
      prod.category_id,
      prod.shop_id,
      prod.in_stock,
      prod.tags,
      prod.is_featured,
      prod.batch_code,
      prod.origin,
      prod.materials
    );
  }

  // 5. Seed University Courses
  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, instructor, duration, level, rating, price, image, category, students_count, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const courses = [
    {
      id: 1,
      title: 'The Heritage of Sylhet Agarwood & Dehn Al-Oud Perfumery',
      instructor: 'Al-Hajj Nazrul Islam (Master Distiller)',
      duration: '6 Weeks (Online + Live Scent Labs)',
      level: 'All Levels',
      rating: 4.98,
      price: 75.0,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      category: 'Botanical Wisdom',
      students_count: 480,
      description: 'Learn ancient hydro-distillation, agarwood tree aging, top-heart-base resin blending, and formulate bespoke attars.'
    },
    {
      id: 2,
      title: 'Artisan Business Mastery: Taking Bangladesh Craft Global',
      instructor: 'Shahana Akter & Tarek Banik',
      duration: '8 Weeks',
      level: 'Intermediate',
      rating: 4.95,
      price: 95.0,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      category: 'Entrepreneurship',
      students_count: 720,
      description: 'Export logistics, international brand storytelling, packaging with wax seals, and scaling without losing handmade authenticity.'
    },
    {
      id: 3,
      title: 'Dhamrai Lost-Wax Metal Casting & Bell-Metal Metallurgy',
      instructor: 'Sukanta Banik (Master Sculptor)',
      duration: '4 Weeks',
      level: 'Beginner to Intermediate',
      rating: 4.92,
      price: 60.0,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      category: 'Traditional Craft',
      students_count: 350,
      description: 'Master beeswax sculpting, clay mold casing, molten bell-metal pouring, and traditional hand-chasing techniques.'
    },
    {
      id: 4,
      title: 'Bengali Culinary Heritage: Ancient Spices & Coastal Feasts',
      instructor: 'Chef Harun & Guest Gastronomes',
      duration: '5 Weeks',
      level: 'All Levels',
      rating: 4.99,
      price: 50.0,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      category: 'Gastronomy',
      students_count: 610,
      description: 'Unlock authentic Shorshe, Panch Phoron, wild sundarbans honey pairings, slow earthenware cooking, and host seasonal Nabanna banquets.'
    }
  ];

  for (const c of courses) {
    insertCourse.run(
      c.id,
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
    INSERT INTO events (id, title, description, date, location, price, image, category, capacity, enrolled_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const events = [
    {
      id: 1,
      title: 'Nabanna Autumn Harvest Feast & Acoustic Courtyard Oud',
      description: 'A 5-course heritage dinner curated by culinary archivists, paired with live acoustic sitar and oud in an open courtyard.',
      date: 'Saturday, Nov 14, 2026 • 7:00 PM',
      location: 'Nashwa Andalusian Courtyard, Gulshan, Dhaka',
      price: 35.0,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      category: 'Feast & Music',
      capacity: 60,
      enrolled_count: 52
    },
    {
      id: 2,
      title: 'Dhamrai Bell-Metal & Sonargaon Jamdani Grand Souk',
      description: 'Meet 40+ master guild artisans, witness live lost-wax casting and handloom spinning, and enjoy clay-cup Cha.',
      date: 'Friday, Dec 04, 2026 • 5:00 PM',
      location: 'Historic Heritage Pavilion, Dhaka',
      price: 0.0,
      image: 'https://images.unsplash.com/photo-1512290900672-1f416e9196d4?auto=format&fit=crop&w=800&q=80',
      category: 'Community Souk',
      capacity: 250,
      enrolled_count: 184
    },
    {
      id: 3,
      title: 'Sylhet Agarwood Scent Blending Masterclass',
      description: 'An intimate hands-on workshop where attendees distill floral notes, blend Barlekha aged oud, and bottle 15ml bespoke attar.',
      date: 'Sunday, Dec 20, 2026 • 2:00 PM',
      location: 'The Botanical Glasshouse, Dhaka',
      price: 50.0,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      category: 'Workshop',
      capacity: 25,
      enrolled_count: 21
    },
    {
      id: 4,
      title: 'Clay Hearth Baking & Sundarbans Raw Honey Tasting',
      description: 'Learn slow clay tandoor baking using heritage heirloom flours and taste raw Khalisha blossom honey straight from the honeycomb.',
      date: 'Saturday, Jan 09, 2027 • 10:00 AM',
      location: 'Heritage Farmhouse Kitchen, Savar, Dhaka',
      price: 30.0,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      category: 'Culinary Craft',
      capacity: 30,
      enrolled_count: 26
    }
  ];

  for (const ev of events) {
    insertEvent.run(
      ev.id,
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

  // 7. Seed Sample Reviews
  const insertReview = db.prepare(`
    INSERT INTO reviews (id, product_id, user_name, rating, comment, is_verified_patron, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const reviews = [
    {
      id: 1,
      product_id: 1,
      user_name: 'Barrister Farhan Ahmed (Dhaka)',
      rating: 5,
      comment: 'The Barlekha Dehn Al-Oud is unmatched. It opens with rich smoky leather and settles into sweet balsam. Lasts on panjabi fabric for over 48 hours.',
      is_verified_patron: 1,
      created_at: '2026-09-14 10:20:00'
    },
    {
      id: 2,
      product_id: 1,
      user_name: 'Tasnim Zubaida (Sylhet)',
      rating: 5,
      comment: 'True Sylheti agarwood. You can instantly distinguish the natural distillation from synthetic perfumes. Arrived in a gorgeous wax-sealed wooden box.',
      is_verified_patron: 1,
      created_at: '2026-10-02 14:15:00'
    },
    {
      id: 3,
      product_id: 2,
      user_name: 'Mahmudur Rahman (Chittagong)',
      rating: 5,
      comment: 'Dhamrai bell metal (kasha) at its absolute finest. The weight, balance, and acoustic resonance of the teapot are sublime. An heirloom piece for our dining table.',
      is_verified_patron: 1,
      created_at: '2026-09-28 18:30:00'
    },
    {
      id: 4,
      product_id: 3,
      user_name: 'Farzana Chowdhury (Uttara, Dhaka)',
      rating: 5,
      comment: 'Stunning terracotta finish. Used it for serving feast flatbreads and kebabs during our family gathering. Everyone was asking where we acquired it.',
      is_verified_patron: 1,
      created_at: '2026-10-05 09:45:00'
    },
    {
      id: 5,
      product_id: 4,
      user_name: 'Dr. Kazi Moinuddin (Dhanmondi)',
      rating: 5,
      comment: 'The raw Sundarbans Khalisha honey is authentic. Thick, unpasteurized, with an aromatic floral bite. Will be ordering regularly for our family.',
      is_verified_patron: 1,
      created_at: '2026-10-10 11:00:00'
    },
    {
      id: 6,
      product_id: 5,
      user_name: 'Nabila Haque (Rajshahi)',
      rating: 5,
      comment: 'The Tangail khadi weave is feather-light and the natural indigo depth is breathtaking. Proud to support our local weavers.',
      is_verified_patron: 1,
      created_at: '2026-10-12 16:20:00'
    },
    {
      id: 7,
      product_id: 10,
      user_name: 'Tanvir Hasan (Banani, Dhaka)',
      rating: 5,
      comment: 'Drinking authentic spiced cha in these unglazed Matir Bhar tumblers brings back old memories. Retains heat beautifully without burning hands.',
      is_verified_patron: 1,
      created_at: '2026-10-15 13:10:00'
    }
  ];

  for (const r of reviews) {
    insertReview.run(r.id, r.product_id, r.user_name, r.rating, r.comment, r.is_verified_patron, r.created_at);
  }

  console.log('✅ SQLite database seeded successfully with authentic Bangladesh heritage items!');
}

if (process.argv[1] === import.meta.filename) {
  const force = process.argv.includes('--force');
  seedDatabase(force);
}
