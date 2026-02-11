const db = require("./index");

/* INSERT */
const INSERT_schedules = db.prepare(`
    INSERT INTO schedules
    (title, start_date, end_date, label_color, label_name, url, memo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

/* UPDATE */
const UPDATE_schedules = db.prepare(`
    UPDATE 
        schedules
    SET
        title = ?,
        start_date = ?,
        end_date = ?,
        label_color = ?,
        label_name = ?,
        url = ?,
        memo = ?,
        updated_at = datetime('now','localtime')
    WHERE id = ?
`);

/* DELETE */
const DELETE_schedules = db.prepare(`
  DELETE FROM schedules WHERE id = ?
`);

/* SELECT */
const SELECT_schedules = db.prepare(`
  SELECT * FROM schedules
`);

module.exports = {
  INSERT_schedules,
  UPDATE_schedules,
  DELETE_schedules,
  SELECT_schedules
};
