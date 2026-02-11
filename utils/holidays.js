/**
 * ---------------------------------------------------------
 * 祝日データ管理
 * ---------------------------------------------------------
 */
const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");

const HOLIDAY_FILE = path.join(__dirname, "..", "data", "holidays.json");

/**
 * CSVから祝日データ取得
 */
async function loadHolidays() {
    const res = await fetch(
        "https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv"
    );

    const buffer = Buffer.from(await res.arrayBuffer());
    const text = iconv.decode(buffer, "Shift_JIS");

    const holidays = {};

    text
        .split("\n")
        .slice(1)
        .forEach(line => {
            if (!line.trim()) return;

            const [date, name] = line.split(",");
            if (!date || !name) return;

            const [y, m, d] = date.replace(/\uFEFF/g, "").trim().split("/");
            const key = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

            holidays[key] = name.trim();
        });

    return holidays;
}

/**
 * 起動時祝日設定
 */
async function setHolidays() {
    try {
        const holidays = await loadHolidays();
        fs.writeFileSync(
            HOLIDAY_FILE,
            JSON.stringify(holidays, null, 2),
            "utf-8"
        );
        console.log("祝日データをCSVから取得 → JSON保存");
        return holidays;
    } catch (err) {
        if (!fs.existsSync(HOLIDAY_FILE)) {
            console.error("祝日データの取得に失敗しました");
            return {};
        }
        console.log("祝日データをJSONから取得");
        return JSON.parse(fs.readFileSync(HOLIDAY_FILE, "utf-8"));
    }
}

module.exports = { setHolidays };