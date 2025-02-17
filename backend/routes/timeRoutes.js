const express = require("express");
const router = express.Router();
const {
  getOrderTimings,
  updateOrderTimings,
} = require("../controllers/timeController");

router.get("/", getOrderTimings);  // Fetch order timings

router.put("/", updateOrderTimings);  // Update order timings

module.exports = router;
