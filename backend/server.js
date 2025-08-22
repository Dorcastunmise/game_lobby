const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: ["https://dorcastunmise.github.io", "http://localhost:5173"],
  credentials: true
}));

// DB connection
let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "game_lobby"
    });
    console.log("MySQL Connected");
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
})();
app.use((req, res, next) => { req.db = db; next(); });

// Routes
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => res.send("Game Lobby API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
