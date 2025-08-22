const express = require("express");
const router = express.Router();

// Top 10 players by total wins
router.get("/", async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT u.username, 
             COALESCE(SUM(CASE WHEN sp.chosen_number = s.winning_number THEN 1 ELSE 0 END), 0) AS wins
      FROM users u
      LEFT JOIN session_players sp ON u.id = sp.user_id
      LEFT JOIN sessions s ON sp.session_id = s.id
      GROUP BY u.id
      ORDER BY wins DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
