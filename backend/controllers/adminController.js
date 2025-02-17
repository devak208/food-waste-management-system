const pool = require('../db'); // Make sure to set up your PostgreSQL connection
const { broadcast } = require("../ws");


// Function to add a food item
exports.addFoodItem = async (req, res) => {
  const {
    name,
    category,
    price,
    ingredients,
    quantity,
    serving,
    allergens,
    veg_non_veg,
    total,
    cartStatus,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO food (name, category, price, ingredients, quantity, serving, allergens, veg_non_veg, total, "cartStatus") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, category, price, ingredients, quantity, serving, allergens, veg_non_veg, total, cartStatus]
    );

    broadcast("menu-channel", { type: "ADD", food: result.rows[0] });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Function to bulk insert food items
exports.bulkInsertFoodItems = async (req, res) => {
  const foodItems = req.body;
  const insertPromises = foodItems.map((item) => {
    const { name, quantity, allergens, category, veg_non_veg, ingredients } =
      item;
    return pool.query(
      `INSERT INTO food 
            (name, quantity, allergens, category, veg_non_veg, ingredients) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, quantity, allergens, category, veg_non_veg, ingredients]
    );
  });

  try {
    const results = await Promise.all(insertPromises);
    res.status(201).json(results.map((result) => result.rows[0]));
  } catch (error) {
    console.error("Error inserting food items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get all food items
exports.getAllFoodItems = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM food");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get all food items with cart
exports.getAllFoodItemsWithCart = async (req, res) => {
  const { user_id } = req.params;

  try {
    // Check if user exists and retrieve their cart_items
    const userResult = await pool.query(
      "SELECT cart_items FROM users WHERE user_id = $1",
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = userResult.rows[0].cart_items || [];

    // Fetch all food items
    const foodResult = await pool.query("SELECT * FROM food");
    const foodItems = foodResult.rows;

    // Track indices to remove invalid cart items
    const invalidCartIndices = [];

    // Map over cart items and process each one
    for (let cartItem of cartItems) {
      const foodItemIndex = foodItems.findIndex(
        (food) => food.id === cartItem.id
      );

      if (foodItemIndex !== -1) {
        const foodItem = foodItems[foodItemIndex];

        if (cartItem.serving <= foodItem.quantity) {
          // Update the food item's serving
          foodItem.serving = cartItem.serving;
          foodItem.cartStatus = true;
        } else {
          // Update the cart item's serving to match the available quantity
          cartItem.serving = foodItem.quantity;

          // Update the cart item in the database
          await pool.query(
            `UPDATE users
             SET cart_items = jsonb_set(cart_items, '{${cartItems.indexOf(
               cartItem
             )}}', $1::jsonb)
             WHERE user_id = $2`,
            [JSON.stringify(cartItem), user_id]
          );
        }
      } else {
        // Mark this cart item as invalid for removal
        invalidCartIndices.push(cartItems.indexOf(cartItem));
      }
    }

    // Remove invalid cart items from the database
    if (invalidCartIndices.length > 0) {
      let updatedCartItems = cartItems.filter(
        (_, index) => !invalidCartIndices.includes(index)
      );

      await pool.query(`UPDATE users SET cart_items = $1 WHERE user_id = $2`, [
        JSON.stringify(updatedCartItems),
        user_id,
      ]);
    }

    // Send the processed food items as the response
    res.status(200).json(foodItems);
  } catch (error) {
    console.error("Error fetching food items with cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to add/update items to cart
exports.addToCart = async (req, res) => {
  const { user_id } = req.params; // User ID from the URL parameter
  const { id, serving } = req.body; // id and serving from the request body

  try {
    // Fetch the current cart items for the user
    const userResult = await pool.query(
      "SELECT cart_items FROM users WHERE user_id = $1",
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let cartItems = userResult.rows[0].cart_items || [];

    // Check if the item already exists in the cart
    const existingItemIndex = cartItems.findIndex((item) => item.id === id);

    if (existingItemIndex !== -1) {
      // Update the serving for the existing item
      cartItems[existingItemIndex].serving = serving;
    } else {
      // Add a new item to the cart
      cartItems.push({ id, serving });
    }

    // Update the database with the modified cart items
    await pool.query("UPDATE users SET cart_items = $1 WHERE user_id = $2", [
      JSON.stringify(cartItems),
      user_id,
    ]);

    res
      .status(200)
      .json({ message: "Cart updated successfully", cart: cartItems });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to remove items from cart
exports.removeFromCart = async (req, res) => {
  const { user_id } = req.params; // User ID from the URL parameter
  const { id } = req.body; // id to be removed from the request body

  try {
    // Fetch the current cart items for the user
    const userResult = await pool.query(
      "SELECT cart_items FROM users WHERE user_id = $1",
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let cartItems = userResult.rows[0].cart_items || [];

    // Check if the item exists in the cart
    const itemExists = cartItems.some((item) => item.id === id);

    if (!itemExists) {
      return res
        .status(200)
        .json({ message: "Item not found in cart. No changes made." });
    }

    // Filter out the item with the matching id
    cartItems = cartItems.filter((item) => item.id !== id);

    // Update the database with the modified cart items
    await pool.query("UPDATE users SET cart_items = $1 WHERE user_id = $2", [
      JSON.stringify(cartItems),
      user_id,
    ]);

    res.status(200).json({
      message: "Item removed from cart successfully",
      cart: cartItems,
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update a food item
exports.updateFoodItem = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    price,
    ingredients,
    quantity,
    serving,
    allergens,
    veg_non_veg,
    total,
    cartStatus,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE food SET name=$1, category=$2, price=$3, ingredients=$4, quantity=$5, serving=$6, allergens=$7, veg_non_veg=$8, total=$9, "cartStatus"=$10 
       WHERE id=$11 RETURNING *`,
      [name, category, price, ingredients, quantity, serving, allergens, veg_non_veg, total, cartStatus, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    broadcast("menu-channel", { type: "UPDATE", food: result.rows[0] });
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating food item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
  

// Function to delete a food item
exports.deleteFoodItem = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM food WHERE id=$1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }
;
    broadcast("menu-channel", { type: "DELETE", foodId: id });
    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("Error deleting food item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

  
  



// Function to truncate the food table
exports.truncateFoodTable = async (req, res) => {
  try {
    await pool.query("TRUNCATE TABLE food RESTART IDENTITY");
    res.json({ message: "Food table truncated successfully." });
  } catch (error) {
    console.error("Error truncating food table:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get user login details
exports.getUserLoginDetails = async (req, res) => {
  // Implement the logic to retrieve user login details
};

// Function to get user by ID
exports.getUserById = async (req, res) => {
  const { user_id } = req.params;
  // Implement the logic to retrieve user by ID
};
