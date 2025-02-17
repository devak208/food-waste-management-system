// orderController.js
const pool = require("../db");
const { broadcast } = require("../ws");
const {
  getDeliveryStatus,
  getPaymentStatus,
} = require("../helpers/statusHelpers");
const crypto = require("crypto"); // This can be removed if not used anywhere else
const generateOrderId = () => {
  return crypto.randomBytes(2).toString("hex").toUpperCase(); // Generates a 4-character alphanumeric string
};

const createOrder = async (req, res) => {
  const { user_id, orders, totalPrice } = req.body;

  if (!user_id || !orders?.length || !totalPrice) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    await pool.query("BEGIN");

    const orderId = generateOrderId();
    const orderResult = await pool.query(
      "INSERT INTO orders (order_id, user_id, amount, payment_status, delivery_status) VALUES ($1, $2, $3, $4, $5) RETURNING order_id",
      [orderId, user_id, totalPrice, "Pending", "Pending"]
    );

    if (orderResult.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(400).json({ error: "Failed to create order with unique ID" });
    }

    const order_id = orderResult.rows[0].order_id;

    for (const item of orders) {
      const foodUpdateResult = await pool.query(
        "UPDATE food SET quantity = quantity - $1 WHERE id = $2 AND quantity >= $1 RETURNING quantity",
        [item.quantity, item.id]
      );

      if (foodUpdateResult.rows.length === 0) {
        await pool.query("ROLLBACK");
        return res.status(400).json({ error: `Not enough quantity for item ${item.name}` });
      }

      await pool.query(
        "INSERT INTO order_items (order_id, item_name, quantity, price, veg_non_veg, category) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          order_id,
          item.name,
          item.quantity,
          item.price,
          item.veg_non_veg,
          item.category,
        ]
      );
    }

    await pool.query("COMMIT");

    const updatedFoodItems = await pool.query("SELECT * FROM food");
    broadcast("menu-channel", { type: "UPDATE_FOOD", foodItems: updatedFoodItems.rows });

    const currentPhaseOrders = await fetchPhaseOrders(); // Fetch phase orders here
    const allOrders = await pool.query("SELECT * FROM orders");
    broadcast("orders-channel", {
      type: "UPDATE_ORDERS",
      currentPhaseOrders: currentPhaseOrders, // Pass the fetched data
      allOrders: allOrders.rows,
    });
    

    res.status(201).json({ message: "Order created successfully", order_id });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error creating order:", err.message);
    res.status(500).json({ error: "Failed to add order" });
  }
};


const fetchPhaseOrders = async () => {
  try {
    const rangeQuery = await pool.query(`
      SELECT
        (SELECT timestamp::timestamp AT TIME ZONE 'UTC' FROM order_timings WHERE id = 1) AS start_time,
        (SELECT timestamp::timestamp AT TIME ZONE 'UTC' FROM order_timings WHERE id = 2) AS end_time
    `);

    const { start_time, end_time } = rangeQuery.rows[0] || {};

    if (!start_time || !end_time) {
      return []; // Return an empty array if no phase is defined
    }

    const ordersQuery = await pool.query(
      `
        SELECT o.order_id, u.user_id, u.name AS username, u.email, o.timestamp AS timing, o.amount AS totalPrice,
               o.delivery_status, o.payment_status,
               array_agg(json_build_object(
                 'id', oi.id,
                 'name', oi.item_name,
                 'price', oi.price,
                 'quantity', oi.quantity,
                 'veg_non_veg', oi.veg_non_veg,
                 'category', oi.category
               )) AS orders
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.timestamp BETWEEN $1 AND $2
        GROUP BY o.order_id, u.user_id, u.name, u.email
        ORDER BY o.timestamp DESC; -- Sort by timestamp in descending order
      `,
      [start_time, end_time]
    );

    return ordersQuery.rows.map((order) => ({
      orderid: order.order_id,
      user_id: order.user_id,
      username: order.username,
      email: order.email,
      timing: order.timing,
      orders: order.orders,
      totalPrice: order.totalprice,
      paymentStatus: getPaymentStatus(order.payment_status),
      deliveryStatus: getDeliveryStatus(order.delivery_status),
    }));
  } catch (error) {
    console.error("Error fetching phase orders:", error.message);
    console.error("Stack Trace:", error.stack);
    throw new Error("Failed to retrieve phase orders");
  }
};



const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT o.order_id, u.user_id, u.name AS username, u.email, o.timestamp AS timing, o.amount AS totalPrice,
                   o.delivery_status, o.payment_status,
                   array_agg(json_build_object(
                     'id', oi.id,
                     'name', oi.item_name,
                     'price', oi.price,
                     'quantity', oi.quantity,
                     'veg_non_veg', oi.veg_non_veg,
                     'category', oi.category
                   )) AS orders
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            JOIN order_items oi ON o.order_id = oi.order_id
            GROUP BY o.order_id, u.user_id, u.name, u.email
            ORDER BY o.timestamp DESC; -- Sort by timestamp in descending order
        `);

    const orders = result.rows.map((order) => ({
      orderid: order.order_id,
      user_id: order.user_id,
      username: order.username,
      email: order.email,
      timing: order.timing,
      orders: order.orders,
      totalPrice: order.totalprice,
      paymentStatus: getPaymentStatus(order.payment_status),
      deliveryStatus: getDeliveryStatus(order.delivery_status),
    }));

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
};

const getPhaseOrders = async (req, res) => {
  try {
    const rangeQuery = await pool.query(`
      SELECT
        (SELECT timestamp::timestamp AT TIME ZONE 'UTC' FROM order_timings WHERE id = 1) AS start_time,
        (SELECT timestamp::timestamp AT TIME ZONE 'UTC' FROM order_timings WHERE id = 2) AS end_time
    `);

    const { start_time, end_time } = rangeQuery.rows[0] || {};

    if (!start_time || !end_time) {
      return res.json([]);
    }

    const ordersQuery = await pool.query(
      `
        SELECT o.order_id, u.user_id, u.name AS username, u.email, o.timestamp AS timing, o.amount AS totalPrice,
               o.delivery_status, o.payment_status,
               array_agg(json_build_object(
                 'id', oi.id,
                 'name', oi.item_name,
                 'price', oi.price,
                 'quantity', oi.quantity,
                 'veg_non_veg', oi.veg_non_veg,
                 'category', oi.category
               )) AS orders
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.timestamp BETWEEN $1 AND $2
        GROUP BY o.order_id, u.user_id, u.name, u.email
        ORDER BY o.timestamp DESC
      `,
      [start_time, end_time]
    );

    const orders = ordersQuery.rows.map((order) => ({
      orderid: order.order_id,
      user_id: order.user_id,
      username: order.username,
      email: order.email,
      timing: order.timing,
      orders: order.orders,
      totalPrice: order.totalprice,
      paymentStatus: getPaymentStatus(order.payment_status),
      deliveryStatus: getDeliveryStatus(order.delivery_status),
    }));

    res.json(orders);
  } catch (error) {
    console.error("Error fetching phase orders:", error.message);
    console.error("Stack Trace:", error.stack);
    res.status(500).json({ error: "Failed to retrieve phase orders" });
  }
};

const getUserById = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `
            SELECT 
                o.order_id,
                u.name AS username,
                u.email AS email,
                u.phone_number AS phone_number,
                o.timestamp AS timing,
                o.amount AS totalPrice,
                o.delivery_status,
                o.payment_status,
                array_agg(json_build_object(
                    'id', oi.id,
                    'name', oi.item_name,
                    'price', oi.price,
                    'quantity', oi.quantity,
                    'veg_non_veg', oi.veg_non_veg,
                    'category', oi.category
                )) AS orders
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            JOIN order_items oi ON o.order_id = oi.order_id
            WHERE u.user_id = $1
            GROUP BY o.order_id, u.name, u.email, u.phone_number;
        `,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.json([]); //Empty List
    }

    const orders = result.rows.map((order) => ({
      orderid: order.order_id,
      username: order.username,
      email: order.email,
      phone_number: order.phone_number,
      timing: order.timing,
      orders: order.orders,
      totalPrice: order.totalprice,
      paymentStatus: getPaymentStatus(order.payment_status),
      deliveryStatus: getDeliveryStatus(order.delivery_status),
    }));

    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ error: "Failed to retrieve user orders" });
  }
};

const updateDeliveryStatus = async (req, res) => {
  const { order_id } = req.params;
  const { deliveryStatus } = req.body;

  try {
    const result = await pool.query(
      "UPDATE orders SET delivery_status = $1 WHERE order_id = $2 RETURNING order_id",
      [deliveryStatus ? "Delivered" : "Pending", order_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Delivery status updated successfully" });
  } catch (err) {
    console.error("Error updating delivery status:", err);
    res.status(500).json({ error: "Failed to update delivery status" });
  }
};

const updatePaymentStatus = async (req, res) => {
  const { order_id } = req.params;
  const { paymentStatus } = req.body;

  try {
    const result = await pool.query(
      "UPDATE orders SET payment_status = $1 WHERE order_id = $2 RETURNING order_id",
      [paymentStatus === "Paid" ? "Completed" : "Pending", order_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({ error: "Failed to update payment status" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getPhaseOrders,
  getUserById,
  updateDeliveryStatus,
  updatePaymentStatus,
};
