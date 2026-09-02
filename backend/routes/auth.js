import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../database/connection.js';
import { supabase, isSupabaseConfigured } from '../../database/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'nashwa_super_secret_jwt_key_2026_growth';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: name.trim()
          }
        }
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const user = {
        id: data.user?.id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'customer'
      };

      const token = data.session?.access_token || jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        message: 'Account created successfully!',
        user,
        token
      });
    }

    // Fallback SQLite
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const insert = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, 'customer')
    `);
    const result = insert.run(name.trim(), email.toLowerCase().trim(), passwordHash);

    const user = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'customer'
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully!',
      user,
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to create account.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      const user = {
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || email.split('@')[0],
        email: data.user.email,
        role: 'customer'
      };

      const token = data.session?.access_token || jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        message: 'Welcome back!',
        user,
        token
      });
    }

    // Fallback SQLite
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Welcome back!',
      user: userData,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to log in.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    if (isSupabaseConfigured()) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();

      return res.json({
        user: {
          id: req.user.id,
          name: profile?.full_name || req.user.name,
          email: profile?.email || req.user.email,
          role: profile?.role || 'customer'
        }
      });
    }

    const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Auth me error:', err);
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

export default router;
