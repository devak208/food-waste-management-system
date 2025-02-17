const express = require('express');
const { UserAuth, adminAuth } = require('../middleware/middleware'); // Import middleware
const {
  createOrder,
  getAllOrders,
  getPhaseOrders,
  getUserById,
  updateDeliveryStatus,
  updatePaymentStatus,
} = require("../controllers/orderController");

const router = express.Router();


// Routes
router.post("/all", UserAuth, createOrder);
router.get("/all",adminAuth, getAllOrders);
router.get("/currentPhase",adminAuth, getPhaseOrders);
router.get("/user/:user_id", getUserById);
router.put("/update-delivery-status/:order_id", updateDeliveryStatus);
router.put("/update-payment-status/:order_id", updatePaymentStatus);
module.exports = router;

