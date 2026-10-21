import express from 'express';
import { db } from '../../database/connection.js';
import { supabase, isSupabaseConfigured } from '../../database/supabase.js';

const router = express.Router();

// POST /api/newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: cleanEmail }])
        .select()
        .single();

      if (error && error.code !== '23505') { // 23505 = unique_violation
        console.error('Supabase newsletter error:', error);
      }
    }

    // SQLite Fallback
    try {
      const insert = db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)');
      insert.run(cleanEmail);
    } catch (sqlErr) {
      // Ignore unique constraint violation if already subscribed
    }

    return res.status(200).json({
      success: true,
      message: 'Welcome to the Nashwa Chronicle! Your patron privilege voucher is unlocked.',
      coupon: 'NASHWA10',
      description: '10% off your initial acquisition + Free Nationwide Delivery with SLOWCRAFT'
    });
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    res.status(500).json({ error: 'Failed to subscribe to the newsletter.' });
  }
});

export default router;
