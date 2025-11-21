const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Note: DATABASE_URL contains the Supabase project URL (https://...)
const supabaseUrl = process.env.DATABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing DATABASE_URL (Supabase project URL) environment variable!');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable!');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabase };
