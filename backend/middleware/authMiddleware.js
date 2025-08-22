const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "A9F8G7H6J3K2L1M0N9O8P7Q6R5S4T3U2V1W0X9Y8Z7";

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
