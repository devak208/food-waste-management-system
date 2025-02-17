const pool = require("../db");
const { broadcast } = require("../ws"); // Assuming this is the Ably broadcasting function

// Get order timings
exports.getOrderTimings = async (req, res) => {
  try {
    const serverTime = new Date().toISOString();
    const result = await pool.query(
      "SELECT timestamp FROM order_timings WHERE id IN (1, 2) ORDER BY id ASC"
    );
    const timestamps = result.rows.map((row) => row.timestamp);
    const response = [serverTime, ...timestamps];
    res.json(response);
  } catch (error) {
    console.error("Error fetching order timings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update order timings
exports.updateOrderTimings = async (req, res) => {
  const { open_time, close_time } = req.body;
  try {
    const openTimeResult = await pool.query(
      `UPDATE order_timings SET timestamp = $1 WHERE id = 1 RETURNING *`,
      [open_time]
    );

    const closeTimeResult = await pool.query(
      `UPDATE order_timings SET timestamp = $1 WHERE id = 2 RETURNING *`,
      [close_time]
    );

    if (openTimeResult.rows.length > 0 && closeTimeResult.rows.length > 0) {
      const updatedData = {
        openTime: openTimeResult.rows[0],
        closeTime: closeTimeResult.rows[0],
        serverTime: new Date().toISOString(),
      };

      // Broadcast updated timings to all WebSocket clients
      broadcast("timing-channel", updatedData); // Corrected channel name to 'timing-channel'

      res.json(updatedData);
    } else {
      res
        .status(404)
        .json({ error: "One or both order timing records not found" });
    }
  } catch (error) {
    console.error("Error updating order timings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
