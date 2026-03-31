const express = require("express");
const router = express.Router();
const {
  getServices,
  getServicesByUser,
  createServiceHandler,
  updateServiceHandler,
  deleteServiceHandler,
} = require("../controllers/serviceController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getServices);
router.get("/public/:userId", getServicesByUser);
router.post("/", authMiddleware, createServiceHandler);
router.put("/:id", authMiddleware, updateServiceHandler);
router.delete("/:id", authMiddleware, deleteServiceHandler);

module.exports = router;
