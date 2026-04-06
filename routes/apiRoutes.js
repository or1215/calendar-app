const express = require("express");
const router = express.Router();

const {
    INSERT_schedules,
    UPDATE_schedules,
    DELETE_schedules
} = require("../db/schedules");

const toNull = v => (v === "" ? null : v);

/* スケジュール追加 */
router.post('/addEvent', async (req, res) => {  // ← async追加
    console.log(req.body); 
    try {
        const {
            title,
            startDate,
            endDate,
            labelColor,
            labelName,
            url,
            memo
        } = req.body;

        // ↓ .run() を await に変更、引数をオブジェクトで渡す
        const result = await INSERT_schedules({
            title,
            start_date: startDate,
            end_date: endDate,
            label_color: toNull(labelColor),
            label_name: toNull(labelName),
            url: toNull(url),
            memo: toNull(memo)
        });

        // ↓ 本番(PostgreSQL)はRETURNING *でidが返る、開発(SQLite)はlastInsertRowid
        const id = result.id ?? result.lastInsertRowid;

        global.SCHEDULES[id] = {
            id,
            title,
            start_date: startDate,
            end_date: endDate,
            label_color: toNull(labelColor),
            label_name: toNull(labelName),
            url: toNull(url),
            memo: toNull(memo)
        };
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

/* スケジュール削除 */
router.post('/deleteEvent', async (req, res) => {  // ← async追加
    try {
        const { id } = req.body;
        await DELETE_schedules(id);  // ← awaitに変更
        delete global.SCHEDULES[id];
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

/* スケジュール更新 */
router.post('/updateEvent', async (req, res) => {  // ← async追加
    try {
        const {
            id, title, startDate, endDate,
            labelColor, labelName, url, memo
        } = req.body;

        // ↓ .run() を await に変更、引数をオブジェクトで渡す
        await UPDATE_schedules({
            id,
            title,
            start_date: startDate,
            end_date: endDate,
            label_color: toNull(labelColor),
            label_name: toNull(labelName),
            url: toNull(url),
            memo: toNull(memo)
        });

        global.SCHEDULES[id] = {
            id,
            title,
            start_date: startDate,
            end_date: endDate,
            label_color: toNull(labelColor),
            label_name: toNull(labelName),
            url: toNull(url),
            memo: toNull(memo)
        };

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;