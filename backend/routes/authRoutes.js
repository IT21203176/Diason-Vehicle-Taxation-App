const express = require("express");
const router = express.Router();
const {
  registerUser,
  registerAgent,
  loginUser,
  getProfile
} = require("../controllers/authController");
const { protect, requireRole } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getProfile);

// Admin only
router.post("/register-agent", protect, requireRole(["ADMIN"]), registerAgent);

module.exports = router;