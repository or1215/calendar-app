/* -------------------------------
   データベース接続設定
   db connection setup
 -------------------------------- */
const Database = require('better-sqlite3');
const db = new Database(process.env.DB_PATH || './database.db');

module.exports = db;