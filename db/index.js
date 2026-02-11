const Database = require("better-sqlite3");

const db = new Database("database.db");

// テーブル作成（起動時1回）
db.exec(`
  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date   TEXT NOT NULL,
    label_color TEXT,
    label_name TEXT,
    url TEXT,
    memo TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  )
`);

module.exports = db;
