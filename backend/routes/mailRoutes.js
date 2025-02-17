const express = require("express");
const { sendWelcomeEmail,sendOrderConfirmationEmail } = require("../controllers/mailTemp");

const router = express.Router();

// Route to send welcome email
router.post("/send-welcome-email", sendWelcomeEmail);
router.post("/send-order-confirmation",sendOrderConfirmationEmail)

module.exports = router;
