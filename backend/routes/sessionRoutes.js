const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Join a game session with full debug logging
router.post("/join", authMiddleware, async (req, res) => {
  const { chosenNumber } = req.body;

  console.log("Request body:", req.body);
  console.log("Decoded user from token:", req.user);
  console.log("DB instance:", req.db);

  if (!req.db) return res.status(500).json({ message: "Database connection not initialized" });
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  if (!chosenNumber) return res.status(400).json({ message: "chosenNumber is required" });

  try {
    const username = req.user.username;

    // Get user ID
    let userId;
    try {
      const [userRows] = await req.db.query("SELECT id FROM users WHERE username = ?", [username]);
      if (userRows.length === 0) return res.status(400).json({ message: "User not found in DB" });
      userId = userRows[0].id;
      console.log("User ID:", userId);
    } catch (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Failed fetching user" });
    }

    // Get latest session
    let sessionId;
    try {
      let [sessions] = await req.db.query("SELECT * FROM sessions ORDER BY id DESC LIMIT 1");
      if (sessions.length === 0) {
        const [result] = await req.db.query("INSERT INTO sessions (created_at) VALUES (NOW())");
        sessionId = result.insertId;
        console.log("Created new session with ID:", sessionId);
      } else {
        sessionId = sessions[0].id;
        console.log("Using existing session ID:", sessionId);
      }
    } catch (err) {
      console.error("Error fetching/creating session:", err);
      return res.status(500).json({ message: "Failed fetching/creating session" });
    }

    // Check if user already joined
    try {
      const [existing] = await req.db.query(
        "SELECT * FROM session_players WHERE session_id = ? AND user_id = ?",
        [sessionId, userId]
      );
      if (existing.length > 0) return res.status(400).json({ message: "User already joined this session" });
    } catch (err) {
      console.error("Error checking existing player:", err);
      return res.status(500).json({ message: "Failed checking existing player" });
    }

    // Insert player choice
    try {
      await req.db.query(
        "INSERT INTO session_players (session_id, user_id, chosen_number) VALUES (?, ?, ?)",
        [sessionId, userId, chosenNumber]
      );
      console.log(`Inserted chosen number ${chosenNumber} for user ${username} in session ${sessionId}`);
    } catch (err) {
      console.error("Error inserting player choice:", err);
      return res.status(500).json({ message: "Failed inserting player choice" });
    }

    res.json({ sessionId, message: `Joined session ${sessionId}` });
  } catch (err) {
    console.error("Unexpected error in /join:", err);
    res.status(500).json({ message: "Unexpected server error" });
  }
});




// Get game result
router.get("/result", async (req, res) => {
  const sessionId = req.query.sessionId;
  if (!sessionId) return res.status(400).json({ msg: "sessionId is required" });

  try {
    // Fetch session
    const [sessions] = await req.db.query("SELECT * FROM sessions WHERE id = ?", [sessionId]);
    if (sessions.length === 0) return res.status(404).json({ msg: "Session not found" });

    let session = sessions[0];

    // If winning number not yet set, generate one
    if (!session.winning_number) {
      const winning_number = Math.floor(Math.random() * 9) + 1;
      await req.db.query("UPDATE sessions SET winning_number = ? WHERE id = ?", [winning_number, sessionId]);
      session.winning_number = winning_number;
    }

    // Fetch winners
    const [winnerRows] = await req.db.query(
      `SELECT u.username 
       FROM session_players sp
       JOIN users u ON u.id = sp.user_id
       WHERE sp.session_id = ? AND sp.chosen_number = ?`,
      [sessionId, session.winning_number]
    );

    const winners = winnerRows.map(r => r.username);

    res.json({
      winning_number: session.winning_number,
      winners,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to get session result" });
  }
});


module.exports = router;
