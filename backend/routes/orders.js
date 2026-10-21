import express from 'express';
import { db } from '../../database/connection.js';
import { supabase, isSupabaseConfigured } from '../../database/supabase.js';

const router = express.Router();

// POST /api/orders (Place Order)
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      address,
      city,
      items,
      total_amount,
      packaging_type,
      gift_note,
      payment_method
    } = req.body;

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
          customer_phone: customer_phone || null,
          address,
          city,
          items_json: items,
          total_amount: Number(total_amount),
          packaging_type: packaging_type || 'linen',
          gift_note: gift_note || null,
          payment_method: payment_method || 'bkash',
          status: 'confirmed'
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase order insert error:', error);
        // If schema doesn't yet have newly added optional fields, fallback insert core columns
        const { data: fallbackOrder, error: fbError } = await supabase
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

        if (fbError) throw fbError;
        return res.status(201).json({
          message: 'Order placed successfully! Thank you for supporting independent artisans.',
          order: {
            id: fallbackOrder.id,
            customer_name: fallbackOrder.customer_name,
            customer_email: fallbackOrder.customer_email,
            total_amount: Number(fallbackOrder.total_amount),
            status: fallbackOrder.status,
            created_at: fallbackOrder.created_at
          }
        });
      }

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
      INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, address, city, items_json, total_amount, packaging_type, gift_note, payment_method, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
    `);

    const result = insert.run(
      user_id || null,
      customer_name,
      customer_email,
      customer_phone || null,
      address,
      city,
      JSON.stringify(items),
      Number(total_amount),
      packaging_type || 'linen',
      gift_note || null,
      payment_method || 'bkash'
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

// POST /api/orders/validate-coupon
router.post('/validate-coupon', (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Promo code is required.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const currentSubtotal = Number(subtotal) || 0;

    const couponRules = {
      NASHWA10: {
        code: 'NASHWA10',
        type: 'percentage',
        value: 10,
        description: '10% Welcome to Nashwa Craft Circle',
        minSpend: 0
      },
      BANGLA10: {
        code: 'BANGLA10',
        type: 'percentage',
        value: 10,
        description: '10% Bengal Artisan Heritage Celebration',
        minSpend: 0
      },
      HERITAGE20: {
        code: 'HERITAGE20',
        type: 'percentage',
        value: 20,
        description: '20% Master Craftsman Guild Special',
        minSpend: 25
      },
      SLOWCRAFT: {
        code: 'SLOWCRAFT',
        type: 'shipping',
        value: 1.0,
        description: 'Complimentary 64-District Express Courier (৳120 Waived)',
        minSpend: 0
      },
      GROWTH15: {
        code: 'GROWTH15',
        type: 'percentage',
        value: 15,
        description: '15% Patron of the Slow Arts Discount',
        minSpend: 20
      }
    };

    const coupon = couponRules[cleanCode];

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid or expired promotional code. Try NASHWA10 or BANGLA10.' });
    }

    if (currentSubtotal < coupon.minSpend) {
      return res.status(400).json({
        error: `Code ${cleanCode} requires a minimum order of $${coupon.minSpend.toFixed(2)}.`
      });
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (currentSubtotal * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.min(coupon.value, currentSubtotal);
    } else if (coupon.type === 'shipping') {
      discountAmount = coupon.value;
    }

    res.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      discount_amount: Number(discountAmount.toFixed(2)),
      description: coupon.description
    });
  } catch (err) {
    console.error('Coupon error:', err);
    res.status(500).json({ error: 'Failed to validate promo code.' });
  }
});

// GET /api/orders/:id/track
router.get('/:id/track', async (req, res) => {
  try {
    const orderId = req.params.id;
    let order = null;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).maybeSingle();
      if (!error && data) {
        order = data;
      }
    }

    if (!order) {
      order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const orderDate = new Date(order.created_at || Date.now());
    const trackingCode = `BD-${(Number(orderId) * 31415 + 10420).toString().slice(0, 8)}`;

    const formatOffset = (days) => {
      const d = new Date(orderDate);
      d.setDate(d.getDate() + days);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const trackingData = {
      order_id: Number(orderId),
      tracking_number: trackingCode,
      carrier: 'Nashwa Express Logistics (Steadfast & Pathao 64 Districts)',
      estimated_delivery: formatOffset(2),
      current_status: 'Hand-Packaged & Wax-Sealed by Bengal Guild',
      destination: `${order.city || 'Dhaka'}, Bangladesh`,
      milestones: [
        {
          step: 1,
          name: 'Order Placed & Artisan Guild Notified',
          timestamp: formatOffset(0),
          status: 'completed',
          location: 'Nashwa Artisan Ledger (Dhaka)'
        },
        {
          step: 2,
          name: 'Handcrafted & Packed in Golden Jute / Heirloom Box',
          timestamp: formatOffset(1),
          status: 'completed',
          location: 'Master Atelier (Sylhet / Dhamrai / Sundarbans)'
        },
        {
          step: 3,
          name: 'Central Quality & Authenticity Wax Seal Applied',
          timestamp: formatOffset(1),
          status: 'current',
          location: 'Nashwa Inspection & Curation Hub (Tejgaon, Dhaka)'
        },
        {
          step: 4,
          name: 'Handed to Courier for 64-District Transit',
          timestamp: formatOffset(2),
          status: 'pending',
          location: 'Steadfast / Pathao Express Dispatch'
        },
        {
          step: 5,
          name: 'Delivered to Recipient Doorstep',
          timestamp: formatOffset(2),
          status: 'pending',
          location: `${order.address}, ${order.city}`
        }
      ]
    };

    res.json(trackingData);
  } catch (err) {
    console.error('Order tracking error:', err);
    res.status(500).json({ error: 'Failed to retrieve tracking details.' });
  }
});

export default router;
