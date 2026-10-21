import express from 'express';
import { db } from '../../database/connection.js';
import { supabase, isSupabaseConfigured } from '../../database/supabase.js';

const router = express.Router();

// GET /api/products
// Supports: ?q=search&category=id|slug&shop=id&sort=price_asc|price_desc|rating|featured
router.get('/', async (req, res) => {
  try {
    const { q, category, shop, sort, featured } = req.query;

    if (isSupabaseConfigured()) {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (name, slug),
          shops (name, location, rating)
        `);

      if (q) {
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,tags.ilike.%${q}%`);
      }

      if (category) {
        if (isNaN(Number(category))) {
          // fetch category id by slug first
          const { data: catData } = await supabase.from('categories').select('id').eq('slug', category).single();
          if (catData) query = query.eq('category_id', catData.id);
        } else {
          query = query.eq('category_id', Number(category));
        }
      }

      if (shop) {
        query = query.eq('shop_id', Number(shop));
      }

      if (featured === 'true' || featured === '1') {
        query = query.eq('is_featured', true);
      }

      // Sorting
      if (sort === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (sort === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else if (sort === 'rating') {
        query = query.order('rating', { ascending: false });
      } else {
        query = query.order('is_featured', { ascending: false }).order('id', { ascending: true });
      }

      const { data: products, error } = await query;
      if (error) throw error;

      const formatted = (products || []).map(p => ({
        ...p,
        category_name: p.categories?.name || null,
        category_slug: p.categories?.slug || null,
        shop_name: p.shops?.name || null,
        shop_location: p.shops?.location || null
      }));

      return res.json({
        count: formatted.length,
        products: formatted
      });
    }

    // Fallback SQLite
    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug, s.name as shop_name, s.location as shop_location
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN shops s ON s.id = p.shop_id
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)`;
      const searchPattern = `%${q}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (category) {
      if (isNaN(Number(category))) {
        sql += ` AND c.slug = ?`;
        params.push(category);
      } else {
        sql += ` AND p.category_id = ?`;
        params.push(Number(category));
      }
    }

    if (shop) {
      sql += ` AND p.shop_id = ?`;
      params.push(Number(shop));
    }

    if (featured === 'true' || featured === '1') {
      sql += ` AND p.is_featured = 1`;
    }

    if (sort === 'price_asc') {
      sql += ` ORDER BY p.price ASC`;
    } else if (sort === 'price_desc') {
      sql += ` ORDER BY p.price DESC`;
    } else if (sort === 'rating') {
      sql += ` ORDER BY p.rating DESC`;
    } else {
      sql += ` ORDER BY p.is_featured DESC, p.id ASC`;
    }

    const products = db.prepare(sql).all(...params);

    res.json({
      count: products.length,
      products
    });
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    if (isSupabaseConfigured()) {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name, slug),
          shops (name, location, rating)
        `)
        .eq('id', req.params.id)
        .single();

      if (error || !product) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      const { data: related } = await supabase
        .from('products')
        .select('*, shops(name)')
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .limit(3);

      const formatted = {
        ...product,
        category_name: product.categories?.name || null,
        category_slug: product.categories?.slug || null,
        shop_name: product.shops?.name || null,
        shop_location: product.shops?.location || null,
        shop_rating: product.shops?.rating || null
      };

      const formattedRelated = (related || []).map(r => ({
        ...r,
        shop_name: r.shops?.name || null
      }));

      return res.json({ product: formatted, related: formattedRelated });
    }

    // Fallback SQLite
    const product = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, s.name as shop_name, s.location as shop_location, s.rating as shop_rating
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN shops s ON s.id = p.shop_id
      WHERE p.id = ?
    `).get(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const related = db.prepare(`
      SELECT p.*, s.name as shop_name
      FROM products p
      LEFT JOIN shops s ON s.id = p.shop_id
      WHERE p.category_id = ? AND p.id != ?
      LIMIT 3
    `).all(product.category_id, product.id);

    res.json({ product, related });
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

// GET /api/products/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (isSupabaseConfigured()) {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('id', { ascending: false });

      if (error) throw error;

      const total = (reviews || []).length;
      const avg = total > 0 ? ((reviews || []).reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 5.0;

      return res.json({
        product_id: productId,
        average_rating: Number(avg),
        total_reviews: total,
        reviews: reviews || []
      });
    }

    const reviews = db.prepare(`
      SELECT * FROM reviews 
      WHERE product_id = ? 
      ORDER BY id DESC
    `).all(productId);

    // Compute stats
    const total = reviews.length;
    const avg = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 5.0;

    res.json({
      product_id: productId,
      average_rating: Number(avg),
      total_reviews: total,
      reviews
    });
  } catch (err) {
    console.error('Fetch reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch product reviews.' });
  }
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const { user_name, rating, comment } = req.body;

    if (!user_name || !rating || !comment) {
      return res.status(400).json({ error: 'Name, rating, and review comment are required.' });
    }

    const numRating = Math.max(1, Math.min(5, Number(rating)));

    if (isSupabaseConfigured()) {
      const { data: newReview, error: insertError } = await supabase
        .from('reviews')
        .insert([{
          product_id: productId,
          user_name: user_name.trim(),
          rating: numRating,
          comment: comment.trim()
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Re-calculate stats
      const { data: allReviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);

      if (allReviews && allReviews.length > 0) {
        const total = allReviews.length;
        const avg = Number((allReviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(2));
        await supabase
          .from('products')
          .update({ rating: avg, reviews_count: total })
          .eq('id', productId);
      }

      return res.status(201).json({
        message: 'Thank you for reviewing this handcrafted creation! Your review is now live.',
        review: newReview
      });
    }

    const result = db.prepare(`
      INSERT INTO reviews (product_id, user_name, rating, comment)
      VALUES (?, ?, ?, ?)
    `).run(productId, user_name.trim(), numRating, comment.trim());

    // Update product rating and reviews count
    const stats = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as count 
      FROM reviews 
      WHERE product_id = ?
    `).get(productId);

    if (stats && stats.count > 0) {
      db.prepare(`
        UPDATE products 
        SET rating = ROUND(?, 2), reviews_count = ?
        WHERE id = ?
      `).run(stats.avg_rating, stats.count, productId);
    }

    res.status(201).json({
      message: 'Thank you for reviewing this handcrafted creation! Your review is now live.',
      review: {
        id: Number(result.lastInsertRowid),
        product_id: productId,
        user_name: user_name.trim(),
        rating: numRating,
        comment: comment.trim(),
        created_at: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Post review error:', err);
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

export default router;
