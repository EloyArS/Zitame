const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyCookie,
  killcookie,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/verify", authMiddleware, verifyCookie);
router.post("/logout", authMiddleware, killcookie);

module.exports = router;
