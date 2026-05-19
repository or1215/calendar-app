require('dotenv').config();
const db = require('./index');
const env = process.env.NODE_ENV || 'development';

/* テーブル作成（起動時1回） */
const initTable = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      label_color TEXT,
      label_name TEXT,
      url TEXT,
      memo TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    )
  `);
};

/* INSERT */
const INSERT_schedules = ({ title, start_date, end_date, label_color, label_name, url, memo }) => {
  return db.prepare(
    `INSERT INTO schedules (title, start_date, end_date, label_color, label_name, url, memo)
      VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(title, start_date, end_date, label_color, label_name, url, memo);
};

/* UPDATE */
const UPDATE_schedules = ({ title, start_date, end_date, label_color, label_name, url, memo, id }) => {
  return db.prepare(
    `UPDATE schedules SET title=?, start_date=?, end_date=?,
    label_color=?, label_name=?, url=?, memo=?,
    updated_at=datetime('now','localtime') WHERE id=?`
  ).run(title, start_date, end_date, label_color, label_name, url, memo, id);
};

/* DELETE */
const DELETE_schedules = (id) => {
  return db.prepare(`DELETE FROM schedules WHERE id=?`).run(id);  
};

/* SELECT */
const SELECT_schedules = () => {
  return db.prepare(`SELECT * FROM schedules`).all();
};

module.exports = {
  initTable,
  INSERT_schedules,
  UPDATE_schedules,
  DELETE_schedules,
  SELECT_schedules
};