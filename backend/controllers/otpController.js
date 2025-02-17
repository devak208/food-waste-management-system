const nodemailer = require("nodemailer");
const crypto = require("crypto");
const pool = require('../db');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const hashOtp = (otp, secret) => crypto.createHmac("sha256", secret).update(otp).digest("hex");

const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = generateOtp();
  const secret = crypto.randomBytes(32).toString("hex");
  const hashedOtp = hashOtp(otp, secret);
  const expiresAt = new Date(Date.now() + 120000); // OTP expires in 2 minutes

  try {
    await pool.query(
      `INSERT INTO otp_codes (email, hashed_otp, secret, expires_at, attempts)
       VALUES ($1, $2, $3, $4, 0)
       ON CONFLICT (email)
       DO UPDATE SET hashed_otp = $2, secret = $3, expires_at = $4, attempts = 0`,
      [email, hashedOtp, secret, expiresAt]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="text-align: center; color: #4CAF50;">Your OTP Code</h2>
          <p>Dear user,</p>
          <p>Thank you for using our service. Please use the One-Time Password (OTP) below to proceed with your login or verification:</p>
          <div style="font-size: 24px; font-weight: bold; color: #333; text-align: center; margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-radius: 8px;">
            <strong>${otp}</strong>
          </div>
          <p style="color: #555;">This OTP is valid for <b>2 minutes</b> only. Please do not share this code with anyone to ensure your account's security.</p>
          <p>If you didn’t request this OTP, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 14px; color: #888;">Best Regards,<br>Your Company Name Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM otp_codes WHERE email = $1", [email]);
    const record = result.rows[0];

    if (!record || record.expires_at < new Date()) {
      await pool.query("DELETE FROM otp_codes WHERE email = $1", [email]); // Clear expired OTP
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    if (record.attempts >= 3) {
      return res.status(429).json({ error: "Too many incorrect attempts. Please request a new OTP." });
    }

    const providedOtpHash = hashOtp(otp, record.secret);

    if (providedOtpHash !== record.hashed_otp) {
      await pool.query("UPDATE otp_codes SET attempts = attempts + 1 WHERE email = $1", [email]);
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await pool.query("DELETE FROM otp_codes WHERE email = $1", [email]); // Clear OTP after successful verification
    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

module.exports = { sendOtp, verifyOtp };