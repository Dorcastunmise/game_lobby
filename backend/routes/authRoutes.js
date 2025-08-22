const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "A9F8G7H6J3K2L1M0N9O8P7Q6R5S4T3U2V1W0X9Y8Z7";

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username & password required" });
  const db = req.db;

  try {
    const [existing] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existing.length > 0) return res.status(400).json({ message: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashed]);
    const token = jwt.sign({ id: result.insertId, username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username & password required" });
  const db = req.db;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (users.length === 0) return res.status(400).json({ message: "User not found" });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
