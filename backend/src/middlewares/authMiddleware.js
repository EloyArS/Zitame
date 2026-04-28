const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token =
    req.cookies.cookietoken || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No se proporcionó token" });
    console.log("No se proporcionó token"); // debug
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
    console.log("Token inválido o expirado:", error); // debug
  }
};

module.exports = authMiddleware;
