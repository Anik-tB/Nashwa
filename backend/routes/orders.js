import express from 'express';
import { db } from '../../database/connection.js';
import { supabase, isSupabaseConfigured } from '../../database/supabase.js';

const router = express.Router();

// POST /api/orders (Place Order)
router.post('/', async (req, res) => {
  try {
    const { user_id, customer_name, customer_email, address, city, items, total_amount } = req.body;

    if (!customer_name || !customer_email || !address || !city || !items || !items.length) {
      return res.status(400).json({ error: 'Customer details, shipping address, and cart items are required.' });
    }

    if (isSupabaseConfigured()) {
      const { data: newOrder, error } = await supabase
        .from('orders')
        .insert([{
          user_id: user_id || null,
          customer_name,
          customer_email,
          address,
          city,
          items_json: items,
          total_amount: Number(total_amount),
          status: 'confirmed'
        }])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        message: 'Order placed successfully! Thank you for supporting independent artisans.',
        order: {
          id: newOrder.id,
          customer_name: newOrder.customer_name,
          customer_email: newOrder.customer_email,
          total_amount: Number(newOrder.total_amount),
          status: newOrder.status,
          created_at: newOrder.created_at
        }
      });
    }

    // Fallback SQLite
    const insert = db.prepare(`
      INSERT INTO orders (user_id, customer_name, customer_email, address, city, items_json, total_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')
    `);

    const result = insert.run(
      user_id || null,
      customer_name,
      customer_email,
      address,
      city,
      JSON.stringify(items),
      Number(total_amount)
    );

    const orderId = Number(result.lastInsertRowid);

    res.status(201).json({
      message: 'Order placed successfully! Thank you for supporting independent artisans.',
      order: {
        id: orderId,
        customer_name,
        customer_email,
        total_amount,
        status: 'confirmed',
        created_at: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to place order.' });
  }
});

// GET /api/orders (Orders list)
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;

    if (isSupabaseConfigured()) {
      let query = supabase.from('orders').select('*').order('id', { ascending: false }).limit(20);
      if (email) {
        query = query.eq('customer_email', email);
      }
      const { data: orders, error } = await query;
      if (error) throw error;

      const parsed = (orders || []).map(o => ({
        ...o,
        items: Array.isArray(o.items_json) ? o.items_json : JSON.parse(o.items_json || '[]')
      }));

      return res.json({ orders: parsed });
    }

    // Fallback SQLite
    let sql = 'SELECT * FROM orders';
    const params = [];

    if (email) {
      sql += ' WHERE customer_email = ?';
      params.push(email);
    }

    sql += ' ORDER BY id DESC LIMIT 20';
    const orders = db.prepare(sql).all(...params);

    const parsedOrders = orders.map(o => ({
      ...o,
      items: JSON.parse(o.items_json || '[]')
    }));

    res.json({ orders: parsedOrders });
  } catch (err) {
    console.error('Orders fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

export default router;
