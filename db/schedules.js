require('dotenv').config();
const db = require('./index');
const env = process.env.NODE_ENV || 'development';

/* テーブル作成（起動時1回） */
const initTable = async () => {
  if (env === 'production') {
    await db.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        label_color TEXT,
        label_name TEXT,
        url TEXT,
        memo TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
  } else {
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
  }
};

/* INSERT */
const INSERT_schedules = async ({ title, start_date, end_date, label_color, label_name, url, memo }) => {
  if (env === 'production') {
    const res = await db.query(
      `INSERT INTO schedules (title, start_date, end_date, label_color, label_name, url, memo)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, start_date, end_date, label_color, label_name, url, memo]
    );
    return res.rows[0];
  } else {
    return db.prepare(
      `INSERT INTO schedules (title, start_date, end_date, label_color, label_name, url, memo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(title, start_date, end_date, label_color, label_name, url, memo);
  }
};

/* UPDATE */
const UPDATE_schedules = async ({ title, start_date, end_date, label_color, label_name, url, memo, id }) => {
  if (env === 'production') {
    const res = await db.query(
      `UPDATE schedules SET title=$1, start_date=$2, end_date=$3,
       label_color=$4, label_name=$5, url=$6, memo=$7,
       updated_at=NOW() WHERE id=$8 RETURNING *`,
      [title, start_date, end_date, label_color, label_name, url, memo, id]
    );
    return res.rows[0];
  } else {
    return db.prepare(
      `UPDATE schedules SET title=?, start_date=?, end_date=?,
       label_color=?, label_name=?, url=?, memo=?,
       updated_at=datetime('now','localtime') WHERE id=?`
    ).run(title, start_date, end_date, label_color, label_name, url, memo, id);
  }
};

/* DELETE */
const DELETE_schedules = async (id) => {
  if (env === 'production') {
    const res = await db.query(
      `DELETE FROM schedules WHERE id=$1 RETURNING *`, [id]
    );
    return res.rows[0];
  } else {
    return db.prepare(`DELETE FROM schedules WHERE id=?`).run(id);
  }
};

/* SELECT */
const SELECT_schedules = async () => {
  if (env === 'production') {
    const res = await db.query(`SELECT * FROM schedules ORDER BY id`);
    return res.rows;
  } else {
    return db.prepare(`SELECT * FROM schedules`).all();
  }
};

module.exports = {
  initTable,
  INSERT_schedules,
  UPDATE_schedules,
  DELETE_schedules,
  SELECT_schedules
};