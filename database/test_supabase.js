import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('\n========================================');
console.log('   NASHWA SUPABASE CONNECTIVITY TEST');
console.log('========================================\n');

console.log('Target URL:', supabaseUrl || '(none)');
console.log('Key Status:', supabaseKey ? 'Provided (' + supabaseKey.substring(0, 12) + '...)' : '(none)');

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-ref') || supabaseKey.includes('your-anon-key')) {
  console.log('\n⚠️  Supabase is currently NOT configured with real credentials.');
  console.log('To connect Nashwa to Supabase Cloud:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select or create your project.');
  console.log('3. Navigate to Project Settings -> API.');
  console.log('4. Copy "Project URL" and "anon public" key.');
  console.log('5. Paste them into .env and frontend/.env:');
  console.log('   - SUPABASE_URL=https://[YOUR-ID].supabase.co');
  console.log('   - SUPABASE_ANON_KEY=[YOUR-ANON-KEY]');
  console.log('6. Open SQL Editor in Supabase and run database/supabase_schema.sql\n');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const tables = [
    'categories',
    'shops',
    'products',
    'courses',
    'events',
    'reviews',
    'artisan_inquiries',
    'orders',
    'wishlists',
    'newsletter_subscribers',
    'profiles'
  ];
  let allPass = true;

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: false })
        .limit(3);

      if (error) {
        console.error(`❌ Table "${table}": Error - ${error.message} (Code: ${error.code})`);
        allPass = false;
      } else {
        console.log(`✅ Table "${table}": Connected successfully! Found ${count ?? data.length} rows.`);
      }
    } catch (err) {
      console.error(`❌ Table "${table}": Failed -`, err.message);
      allPass = false;
    }
  }

  if (allPass) {
    console.log('\n🎉 ALL SUPABASE TABLES VERIFIED SUCCESSFULLY! Nashwa is connected to Supabase Cloud.\n');
  } else {
    console.log('\n⚠️  Some tables were missing or had errors. Make sure you ran database/supabase_schema.sql in the Supabase SQL Editor.\n');
  }
}

testConnection();
