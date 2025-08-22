const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1]; // Expecting "Bearer <token>"
  if (!token) return res.status(401).json({ msg: "No token provided" });

  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded payload to request
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Invalid or expired token" });
  }

};


module.exports = authMiddleware;
