# NASHWA (নাসওয়া) — The Path to Growth
### Ultra-Luxury Artisan Heritage E-Commerce & Academy (Bangladesh Edition)

> *“Crafted by Living Hands. Dedicated to the Slow Arts & Generational Heritage of Bengal.”*

---

## 🏛️ Project Overview
**Nashwa** is a production-tier luxury artisan marketplace connecting discerning patrons with master craftsmen across Bangladesh:
- **Sylhet Agarwood & Dehn Al-Oud Distillers** (Barlekha, Moulvibazar)
- **Dhamrai Lost-Wax Bell-Metal & Brass Guild** (Dhamrai, Dhaka)
- **Sundarbans Wild Khalisha Blossom Honey & Apiary** (Sundarbans Biosphere Reserve)
- **Sonargaon Jamdani & Tangail Desi Cotton Khadi Guild** (Tangail & Sonargaon)
- **Bijoypur Lalmai White Clay & Terracotta Studio** (Comilla)
- **Natore Wooden Ghani Cold-Pressed Mustard & Kalonji Oil** (Natore)

---

## 💎 Production Features
1. **Bangladesh Domestic Commerce Engine**:
   - **Default Currency**: Bangladeshi Taka (৳ BDT) with South Asian numbering (`৳7,800`, `৳1,20,000`).
   - **Payment Gateways**: Dedicated selectors for **bKash (বিকাশ)**, **Nagad (নগদ)**, **Cards / Bank (SSLCommerz)**, and **Cash on Delivery (ক্যাশ অন ডেলিভারি)**.
   - **64-District Courier Logistics**: Real-time integration options for Steadfast, Pathao, and eCourier with Dhaka 24h Express and nationwide delivery.
   - **Recipient BD Mobile Verification**: Mandated 11-digit `01XXXXXXXXX` phone validation with SMS/OTP readiness.
   - **Complimentary Golden Jute Packaging**: Hand-wrapped in organic raw golden jute cloth, Bengal muslin, and sealed with traditional red lac wax.

2. **Google OAuth & Real Gmail Authentication**:
   - Google 1-Click Sign-In via Supabase Auth.
   - Passwordless Magic Link email authentication with direct "Open Gmail Inbox ↗" deep-link.
   - 5-Tier Password Strength Meter (Weak -> Artisan Shield).
   - Brute-force security lock (30s lock after 5 failed attempts).

3. **Master Artisan Provenance & Quality Traceability**:
   - **Certificate of Authenticity Modal**: Batch tracking codes (`BD-2026-XXXX`), material purity verification, craft methodology, and fair artisan living wage certification.
   - **Recently Admired Works**: LocalStorage-persisted carousel tracking recently viewed pieces.
   - **Patron Guild Dashboard**: Loyalty tiers (*Apprentice Patron*, *Artisan Fellow*, *Grand Guild Patron*), patron points, order ledger, and security controls.

---

## 🚀 Technology Stack
- **Frontend**: React 19, Vite 6, TailwindCSS 4, `@mynaui/icons-react`
- **Backend**: Express.js (Node 20+), REST API
- **Cloud Database**: **Supabase PostgreSQL 15+** with Row Level Security (RLS) & Triggers
- **Local Fallback DB**: `better-sqlite3` (auto-detects Supabase connectivity; seamless offline mode)

---

## 🛠️ Environment Configuration

### Root `.env` (Backend):
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://kdhlmxaekrgyfssyztun.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=nashwa_artisan_secret_production_key_2026
```

### `frontend/.env`:
```env
VITE_SUPABASE_URL=https://kdhlmxaekrgyfssyztun.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📦 Quick Start

### 1. Install Dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

### 2. Verify Supabase Cloud Connection
```bash
node database/test_supabase.js
```

### 3. Seed Local Fallback SQLite (Optional)
```bash
node database/seed.js --force
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend API (Port 5000)
npm run dev

# Terminal 2: Frontend Vite (Port 5173)
cd frontend && npm run dev
```

---

## 📜 Database Schema & Triggers
The comprehensive schema is available in [`database/supabase_schema.sql`](./database/supabase_schema.sql):
- Automatic Google OAuth user synchronization (`handle_new_user` trigger).
- Dynamic product rating & review aggregations (`update_product_rating_on_review` trigger).
- Row Level Security (RLS) policies for user privacy.
