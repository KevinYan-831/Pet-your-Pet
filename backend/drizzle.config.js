require('dotenv').config();

/** @type { import("drizzle-kit").Config } */
module.exports = {
  schema: './src/db/schema.js',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_URL,
  },
  verbose: true,
  strict: true,
};