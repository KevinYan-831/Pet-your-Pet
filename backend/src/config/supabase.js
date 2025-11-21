const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_PROJECT_URL || 'https://nyyraxgibahkehtujhpu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables!');
}

// Use service role key for backend (has admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabase };
