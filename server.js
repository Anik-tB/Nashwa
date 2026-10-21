import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './database/connection.js';
import { seedDatabase } from './database/seed.js';

import authRoutes from './backend/routes/auth.js';
import productsRoutes from './backend/routes/products.js';
import categoriesRoutes from './backend/routes/categories.js';
import shopsRoutes from './backend/routes/shops.js';
import universityRoutes from './backend/routes/university.js';
import eventsRoutes from './backend/routes/events.js';
import ordersRoutes from './backend/routes/orders.js';
import newsletterRoutes from './backend/routes/newsletter.js';

// Initialize and ensure database is ready
initDatabase();
seedDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger for dev
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Nashwa - The Path to Growth API',
    time: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/shops', shopsRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Favicon & Chrome DevTools probes
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.all('/.well-known/*', (req, res) => res.status(204).end());

// Root info
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    name: 'Nashwa - The Path to Growth API',
    version: '1.0.0'
  });
});

// Fallback 404 for all unhandled routes (prevents Express default-src 'none' CSP on unhandled requests)
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`✨ Nashwa Backend API running on http://localhost:${PORT}`);
});
