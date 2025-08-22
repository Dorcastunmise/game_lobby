const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || "A9F8G7H6J3K2L1M0N9O8P7Q6R5S4T3U2V1W0X9Y8Z7";

// DB Connection
let db;
(async () => {
  db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "game_lobby"
  });
  console.log("✅ MySQL Connected");
})();

// Attach DB to request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Test route
app.get("/", (req, res) => res.send("Game Lobby API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

