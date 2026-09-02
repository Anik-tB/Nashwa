import express from 'express';
import { db } from '../../database/connection.js';
import { supabase, isSupabaseConfigured } from '../../database/supabase.js';

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    if (isSupabaseConfigured()) {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*, products(id)');

      if (error) throw error;

      const formatted = categories.map(c => ({
        ...c,
        product_count: c.products ? c.products.length : 0
      }));

      return res.json({ categories: formatted });
    }

    // Fallback SQLite
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.id ASC
    `).all();

    res.json({ categories });
  } catch (err) {
    console.error('Categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res) => {
  try {
    if (isSupabaseConfigured()) {
      const { data: category, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', req.params.slug)
        .single();

      if (catErr || !category) {
        return res.status(404).json({ error: 'Category not found.' });
      }

      const { data: products } = await supabase
        .from('products')
        .select('*, shops(name)')
        .eq('category_id', category.id);

      const formattedProducts = (products || []).map(p => ({
        ...p,
        shop_name: p.shops ? p.shops.name : null
      }));

      return res.json({ category, products: formattedProducts });
    }

    // Fallback SQLite
    const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    const products = db.prepare(`
      SELECT p.*, s.name as shop_name
      FROM products p
      LEFT JOIN shops s ON s.id = p.shop_id
      WHERE p.category_id = ?
    `).all(category.id);

    res.json({ category, products });
  } catch (err) {
    console.error('Category detail error:', err);
    res.status(500).json({ error: 'Failed to fetch category.' });
  }
});

export default router;
