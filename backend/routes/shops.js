import express from 'express';
import { db } from '../../database/connection.js';
import { supabase, isSupabaseConfigured } from '../../database/supabase.js';

const router = express.Router();

// GET /api/shops
router.get('/', async (req, res) => {
  try {
    if (isSupabaseConfigured()) {
      const { data: shops, error } = await supabase
        .from('shops')
        .select('*, products(id)')
        .order('rating', { ascending: false });

      if (error) throw error;

      const formatted = shops.map(s => ({
        ...s,
        product_count: s.products ? s.products.length : 0
      }));

      return res.json({ shops: formatted });
    }

    // Fallback SQLite
    const shops = db.prepare(`
      SELECT s.*, COUNT(p.id) as product_count
      FROM shops s
      LEFT JOIN products p ON p.shop_id = s.id
      GROUP BY s.id
      ORDER BY s.rating DESC
    `).all();

    res.json({ shops });
  } catch (err) {
    console.error('Shops error:', err);
    res.status(500).json({ error: 'Failed to fetch shops.' });
  }
});

// GET /api/shops/:id
router.get('/:id', async (req, res) => {
  try {
    const isNum = !isNaN(Number(req.params.id));

    if (isSupabaseConfigured()) {
      let query = supabase.from('shops').select('*');
      if (isNum) {
        query = query.eq('id', Number(req.params.id));
      } else {
        query = query.eq('slug', req.params.id);
      }
      const { data: shop, error: shopErr } = await query.single();
      if (shopErr || !shop) {
        return res.status(404).json({ error: 'Shop not found.' });
      }

      const { data: products } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('shop_id', shop.id);

      const formatted = (products || []).map(p => ({
        ...p,
        category_name: p.categories ? p.categories.name : null
      }));

      return res.json({ shop, products: formatted });
    }

    // Fallback SQLite
    const shop = db.prepare('SELECT * FROM shops WHERE id = ? OR slug = ?').get(req.params.id, req.params.id);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found.' });
    }

    const products = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.shop_id = ?
    `).all(shop.id);

    res.json({ shop, products });
  } catch (err) {
    console.error('Shop detail error:', err);
    res.status(500).json({ error: 'Failed to fetch shop.' });
  }
});

export default router;
