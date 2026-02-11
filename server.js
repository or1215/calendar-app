const express = require("express");
const fs = require("fs");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 3000;

/* -------------------------------
   グローバルデータ
-------------------------------- */
let HOLIDAYS = {};
global.SCHEDULES = {};

/* -------------------------------
   middleware
-------------------------------- */
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------------------
   routes
-------------------------------- */
const pageRoutes = require("./routes/pageRoutes");
const apiRoutes  = require("./routes/apiRoutes");

app.use("/", (req, res, next) => {
    req.HOLIDAYS = HOLIDAYS;
    next();
});

app.use("/", pageRoutes);
app.use("/api", apiRoutes);

/* -------------------------------
   utils / db
-------------------------------- */
const { setHolidays } = require("./utils/holidays");
const { SELECT_schedules } = require("./db/schedules");

/* -------------------------------
   起動時処理
-------------------------------- */
async function bootstrap() {
    // 祝日データ
    HOLIDAYS = await setHolidays();

    // 予定データ
    await setSchedules();

    app.listen(PORT, "0.0.0.0", () => {
        const url = `http://localhost:${PORT}`;
        console.log(`Server running at ${url}`);
    });
}
bootstrap();
/* -------------------------------
   functions
-------------------------------- */
async function setSchedules() {
    try {
        const rows = SELECT_schedules.all();
        global.SCHEDULES = {};

        rows.forEach(row => {
            global.SCHEDULES[row.id] = {
                id          : row.id,
                title       : row.title,
                start_date  : row.start_date,
                end_date    : row.end_date,
                label_color : row.label_color,
                label_name  : row.label_name,
                url         : row.url,
                memo        : row.memo,
            };
        });

        console.log("予定データをDBから取得");
        return true;
    } catch (err) {
        console.error("予定データの取得に失敗しました。");
        console.error(err);
        return false;
    }
}
