const express = require("express");
const { adminAuth } = require("../middleware/middleware"); // Import middleware
const {
  addFoodItem,
  bulkInsertFoodItems,
  getAllFoodItems,
  getAllFoodItemsWithCart,
  addToCart,
  removeFromCart,
  updateFoodItem,
  deleteFoodItem,
  truncateFoodTable,
  getUserLoginDetails,
  getUserById,
} = require("../controllers/adminController");

const router = express.Router();

// Routes that require authentication
router.post("/", adminAuth, addFoodItem);
router.post("/bulk", adminAuth, bulkInsertFoodItems);
router.put("/:id", adminAuth, updateFoodItem);
router.delete("/:id", adminAuth, deleteFoodItem);
router.delete("/truncate", adminAuth, truncateFoodTable);
router.get("/userslogindetails", adminAuth, getUserLoginDetails);
router.get("/userslogindetails/:user_id", adminAuth, getUserById);

// Public route (does not require authentication)
router.get("/", getAllFoodItems);
router.get("/:user_id", getAllFoodItemsWithCart);
router.post("/:user_id", addToCart);
router.put("/item/:user_id", removeFromCart);

module.exports = router;
