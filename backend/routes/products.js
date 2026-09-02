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

export default router;
