import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.SUPABASE_URL || 'https://kdhlmxaekrgyfssyztun.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkaGxteGFla3JneWZzc3l6dHVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjU5MzA1MiwiZXhwIjoyMTA4MTY5MDUyfQ.1QxbyJMhmSCzEmc0h1fUUr3GC4GHU-CsqTjhOE40wKw';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseKey.includes('your-anon-key')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

if (isSupabaseConfigured()) {
  console.log('⚡ Connected to Supabase Cloud Database:', supabaseUrl);
} else {
  console.log('ℹ️ Supabase credentials not detected in .env - running in SQLite fallback mode.');
}
