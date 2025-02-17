const nodemailer = require("nodemailer");

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const websiteUrl = process.env.CLIENT_URL;
const gmail = "mailto:sfl.wur@gmail.com";
const paymentUrl = "https://your-payment-url.com";
const uploadUrl = "https://your-upload-url.com";

// Welcome Email Controller
exports.sendWelcomeEmail = async (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ message: "Email and Username are required" });
  }

  const mailOptions = {
    from: `"Students Lunch Corner" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Students Lunch Corner!",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f4f4f4; padding: 30px; max-width: 600px; margin: 0 auto; border-radius: 8px; border: 1px solid #ddd;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h1 style="color: #2c3e50; font-size: 28px; margin-bottom: 10px;">Welcome to SLC, ${username}!</h1>
          <p style="font-size: 18px; color: #7f8c8d;">We’re excited to have you join us!</p>
        </div>
        <div style="font-size: 16px; line-height: 1.6; color: #555;">
          <p>At Students Lunch Corner, we believe in providing you with the finest meals made with love and care. Explore our menu and enjoy a variety of dishes tailored to your taste!</p>
        </div>
        <div style="padding: 20px 0; background-color: #ecf0f1; border-radius: 8px; margin-top: 30px;">
          <h3 style="text-align: center; color: #34495e;">What’s Next?</h3>
          <ul style="font-size: 16px; color: #7f8c8d; padding-left: 20px;">
            <li>Explore our delicious menu</li>
            <li>Place your first order</li>
            <li>Enjoy fresh, flavorful meals</li>
          </ul>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href=${websiteUrl} style="background-color: #2c3e50; color: white; padding: 12px 25px; font-size: 18px; text-decoration: none; border-radius: 25px; font-weight: bold; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            Start Ordering Now
          </a>
        </div>
        <div style="text-align: center; font-size: 14px; color: #7f8c8d; margin-top: 40px;">
          <p>Need help? Contact us at <a href=${gmail} style="color: #2ecc71;">sfl.wur@gmail.com</a></p>
          <p>&copy; 2024 Students Lunch Corner. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Welcome email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send welcome email" });
  }
};

// Order Confirmation Email Controller
exports.sendOrderConfirmationEmail = async (req, res) => {
  const { orderId, customerName, customerEmail, totalPrice, orders } = req.body; // Get data from the request body

  // Validate input
  if (
    !orderId ||
    !customerName ||
    !customerEmail ||
    !orders ||
    !Array.isArray(orders) ||
    orders.length === 0
  ) {
    return res.status(400).json({ message: "Missing required order details" });
  }

  // Prepare the order details table
  const orderDetails = orders
    .map(
      (item, index) => `
    <tr>
      <td style="padding: 8px; text-align: center;">${index + 1}</td>
      <td style="padding: 8px;">${item.name || "N/A"}</td>
      <td style="padding: 8px; text-align: center;">${item.quantity || 1}</td>
      <td style="padding: 8px; text-align: center;">€${(
        item.quantity * item.price || 0
      ).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  // Updated email content with order ID and customer name
  // Updated email content with improved responsiveness and proper alignment
  const emailContent = `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f8f8f8; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px; border: 1px solid #ddd; box-sizing: border-box;">
    <div style="background-color: #333; color: #fff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
      <h2 style="margin: 0; font-size: 24px; word-wrap: break-word;">Order Confirmation</h2>
    </div>

    <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-top: none; box-sizing: border-box;">
      <p>Hello <strong>${customerName}</strong>,</p>
      <p>Thank you for placing an order with us! Here is your order summary:</p>
      <p><strong>Order ID:</strong> ${orderId}</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 16px;">
        <thead>
          <tr style="background-color: #333; color: #fff;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">S.No</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Name</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Quantity</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderDetails}
        </tbody>
      </table>

      <div style="margin-top: 20px; border-top: 2px dashed #333; padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 18px; text-align: left;">Total Price:</h3>
        <h3 style="margin: 0; font-size: 18px; text-align: right;">€${totalPrice.toFixed(
          2
        )}</h3>
      </div>

      <div style="margin-top: 20px; text-align: center;">
        <a href="${uploadUrl}" 
           style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Pay Now
        </a>
      </div>

      <p style="text-align: center; margin-top: 20px;">After payment, please upload your payment screenshot here:</p>
      <div style="text-align: center;">
        <a href="${paymentUrl}"
           style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #6c757d; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Upload Screenshot
        </a>
      </div>
    </div>

    <div style="background-color: #333; color: #fff; padding: 10px; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="margin: 0;">&copy; 2024 Students Lunch Corner. All rights reserved.</p>
      <p style="margin: 5px 0;">Need help? <a href="${gmail}" style="color: #fff; text-decoration: underline;">Contact Support</a></p>
    </div>
  </div>
`;

  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: customerEmail, // recipient email
    subject: `Order Confirmation - ${orderId}`, // Subject line including Order ID
    html: emailContent, // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully!");
    res
      .status(200)
      .json({ message: "Order confirmation email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send confirmation email" });
  }
};
