const express = require("express");
const router = express.Router();

// Top 10 players by total wins
router.get("/", async (req, res) => {
  try {
    const [rows] = await req.db.query(
      "SELECT username, wins FROM users ORDER BY wins DESC LIMIT 10"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Winners grouped by date (day, week, month)
router.get("/by-date", async (req, res) => {
  const { type } = req.query; // type can be 'day', 'week', 'month'
  let groupQuery;

  try {
    if (type === "day") {
      groupQuery = `
        SELECT DATE(created_at) as period, COUNT(*) as wins
        FROM sessions
        WHERE winning_number IS NOT NULL
        GROUP BY DATE(created_at)
        ORDER BY period DESC;
      `;
    } else if (type === "week") {
      groupQuery = `
        SELECT YEARWEEK(created_at) as period, COUNT(*) as wins
        FROM sessions
        WHERE winning_number IS NOT NULL
        GROUP BY YEARWEEK(created_at)
        ORDER BY period DESC;
      `;
    } else if (type === "month") {
      groupQuery = `
        SELECT DATE_FORMAT(created_at, '%Y-%m') as period, COUNT(*) as wins
        FROM sessions
        WHERE winning_number IS NOT NULL
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY period DESC;
      `;
    } else {
      return res.status(400).json({ msg: "Invalid type. Use day, week, or month" });
    }

    const [rows] = await req.db.query(groupQuery);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
