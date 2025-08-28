const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const { protect, requireRole } = require("../middleware/authMiddleware");

// Public routes for testing (you can protect these later)
router.get("/", vehicleController.getVehicles);
router.get("/manufacturers", vehicleController.getManufacturers);

// Admin routes
router.post("/", protect, requireRole(["ADMIN"]), vehicleController.createVehicle);
router.put("/:id", protect, requireRole(["ADMIN"]), vehicleController.updateVehicle);
router.delete("/:id", protect, requireRole(["ADMIN"]), vehicleController.deleteVehicle);

// Bulk operations
router.post("/bulk-update-exchange-rate", protect, requireRole(["ADMIN", "AGENT"]), vehicleController.bulkUpdateExchangeRate);

// Specific routes
router.get("/manufacturer/:manufacturer", protect, vehicleController.getVehiclesByManufacturer);
router.get("/:id", protect, vehicleController.getVehicleById);

module.exports = router;