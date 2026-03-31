const express = require("express");
const router = express.Router();
const {
  getAppointments,
  createAppointmentHandler,
  updateAppointmentStatusHandler,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getAppointments);
router.post("/", createAppointmentHandler);
router.put("/:id/status", authMiddleware, updateAppointmentStatusHandler);

module.exports = router;
