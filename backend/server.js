const express = require("express");
const cors = require("cors");
const http = require("http");
const { initializeAbly, broadcast } = require("./ws"); // Import Ably-related functions

// Importing routes (adjust these paths according to your project structure)
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const userRoutes = require("./routes/userRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const otpRoutes = require("./routes/otpRoutes");
const timeRoutes = require("./routes/timeRoutes");
const emailRoutes = require("./routes/mailRoutes");

const app = express();
const PORT = process.env.PORT || 9000;

// Create an HTTP server for the Express app
const server = http.createServer(app);

// Initialize Ably connection
const ably = initializeAbly();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:3000"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked Origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);


app.use(express.json());

// Define routes
app.use("/admin/food", adminRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/users", userRoutes);
app.use("/orders", ordersRoutes);
app.use("/otp", otpRoutes);
app.use("/timing", timeRoutes);
app.use("/email", emailRoutes);

// Example of using Ably to broadcast a message (for testing)
app.post("/broadcast", (req, res) => {
  const { channel, data } = req.body;
  broadcast(channel, data); // Send broadcast message via Ably
  res.status(200).json({ message: "Message broadcasted successfully" });
});

app.get("/", (req, res) => {
  res.json("Connected to server");
});

// Start the server (shared between HTTP and WebSocket)
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
