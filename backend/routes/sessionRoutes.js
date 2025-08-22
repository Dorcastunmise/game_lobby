const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Join a game session
router.post("/join", authMiddleware, async (req, res) => {
  const { chosenNumber } = req.body;
  if (!chosenNumber) return res.status(400).json({ message: "chosenNumber required" });

  const username = req.user.username;

  try {
    // Get user ID
    const [userRows] = await req.db.query("SELECT id FROM users WHERE username = ?", [username]);
    if (userRows.length === 0) return res.status(400).json({ message: "User not found" });
    const userId = userRows[0].id;

    // Close any previous active session of this user
    await req.db.query(
      "UPDATE sessions SET status='closed' WHERE started_by=? AND status='active'",
      [userId]
    );

    // Create new session
    const winningNumber = Math.floor(Math.random() * 9) + 1;
    const [result] = await req.db.query(
      "INSERT INTO sessions (started_by, status, created_at, winning_number) VALUES (?, 'active', NOW(), ?)",
      [userId, winningNumber]
    );
    const sessionId = result.insertId;

    // Insert player choice
    await req.db.query(
      "INSERT INTO session_players (session_id, user_id, chosen_number) VALUES (?, ?, ?)",
      [sessionId, userId, chosenNumber]
    );

    res.json({
      sessionId,
      winning_number: winningNumber,
      message: `Joined new session ${sessionId}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Leave / logout (close session)
router.post("/leave", authMiddleware, async (req, res) => {
  const username = req.user.username;

  try {
    const [userRows] = await req.db.query("SELECT id FROM users WHERE username = ?", [username]);
    if (userRows.length === 0) return res.status(400).json({ message: "User not found" });
    const userId = userRows[0].id;

    // Close active session
    await req.db.query(
      "UPDATE sessions SET status='closed' WHERE started_by=? AND status='active'",
      [userId]
    );

    res.json({ message: "Session closed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get session result
router.get("/result", async (req, res) => {
  const sessionId = req.query.sessionId;
  if (!sessionId) return res.status(400).json({ msg: "sessionId required" });

  try {
    const [sessions] = await req.db.query("SELECT * FROM sessions WHERE id = ?", [sessionId]);
    if (sessions.length === 0) return res.status(404).json({ msg: "Session not found" });
    const session = sessions[0];

    const [winners] = await req.db.query(
      `SELECT u.username
       FROM session_players sp
       JOIN users u ON sp.user_id = u.id
       WHERE sp.session_id = ? AND sp.chosen_number = ?`,
      [sessionId, session.winning_number]
    );

    res.json({
      winning_number: session.winning_number,
      winners: winners.map(r => r.username),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
