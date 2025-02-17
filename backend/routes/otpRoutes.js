const express = require('express');
require('dotenv').config();

const { sendOtp, verifyOtp } = require('../controllers/otpController');

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
