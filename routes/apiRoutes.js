const express = require("express");
const router = express.Router();

const {
    INSERT_schedules,
    UPDATE_schedules,
    DELETE_schedules
} = require("../db/schedules");

const toNull = v => (v === "" ? null : v);

/* スケジュール追加 */
router.post('/addEvent', (req, res) => {
    console.log(req.body); // ← これ
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
        const result = INSERT_schedules.run(
            title, startDate, endDate,
            labelColor, labelName, url, memo
        );
        const toNull = v => v === "" ? null : v;
        const id = result.lastInsertRowid;
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
router.post('/deleteEvent', (req, res) => {
    try {
        const { id } = req.body;
        DELETE_schedules.run(id);
        delete global.SCHEDULES[id];
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

/* スケジュール更新 */
router.post('/updateEvent', (req, res) => {
    try {
        const {
            id, title, startDate, endDate,
            labelColor, labelName, url, memo
        } = req.body;

        UPDATE_schedules.run(
            title, startDate, endDate,
            labelColor, labelName, url, memo, id
        );

        const toNull = v => v === "" ? null : v;
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