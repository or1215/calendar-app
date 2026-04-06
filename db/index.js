require('dotenv').config();
const env = process.env.NODE_ENV || 'development';

let db;

if (env === 'production') {
  const { Pool } = require('pg');
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  const Database = require('better-sqlite3');
  db = new Database(process.env.DB_PATH || './database.db');
}

module.exports = db;