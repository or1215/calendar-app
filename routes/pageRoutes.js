const express = require("express");
const router = express.Router();
const HOLIDAYS = require("../data/holidays");
const main = 'main-container';

router.get("/", (req, res) => {
    const today = new Date();
    res.render(`${main}/year`, {
        year: today.getFullYear(),
        css: "year",
        page: "year",
        holidays: HOLIDAYS,
        schedules: global.SCHEDULES
    });
});

router.get("/year", (req, res) => {
    res.render(`${main}/year`, {
        year: Number(req.query.year),
        css: "year",
        page: "year",
        holidays: HOLIDAYS,
        schedules: global.SCHEDULES
    });
});

router.get("/month", (req, res) => {
    res.render(`${main}/month`, {
        year: Number(req.query.year),
        month: Number(req.query.month),
        css: "month",
        page: "month",
        holidays: HOLIDAYS,
        schedules: global.SCHEDULES
    });
});

router.get("/day", (req, res) => {
    res.render(`${main}/day`, {
        year: Number(req.query.year),
        month: Number(req.query.month),
        day: Number(req.query.day),
        css: "day",
        page: "day",
        holidays: HOLIDAYS,
        schedules: global.SCHEDULES
    });
});

router.get("/today", (req, res) => {
    const today = new Date();
    res.render(`${main}/day`, {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        css: "day",
        page: "day",
        holidays: HOLIDAYS,
        schedules: global.SCHEDULES
    });
});

router.get("/updEvent", (req, res) => {
    res.render(`${main}/updEvent`, {
        year: Number(req.query.year),
        month: Number(req.query.month),
        day: Number(req.query.day),
        css: "updEvent",
        page: "updEvent",
        holidays: HOLIDAYS,
        schedules: global.SCHEDULES,
        id: Number(req.query.id)
    });
});

module.exports = router;