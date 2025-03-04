const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon cloud database
});

pool
  .connect()
  .then(() => console.log("✅ Connected to Neon PostgreSQL successfully."))
  .catch((err) => console.error("❌ Database connection error:", err));

const query = async (text, params) => {
  console.log(`📡 Executing query: ${text}`);
  if (params) console.log(`📌 With parameters: ${JSON.stringify(params)}`);

  try {
    const result = await pool.query(text, params);
    
    console.log(`✅ Query executed successfully.`);
    console.log(`📋 Database Response:`, JSON.stringify(result.rows, null, 2)); // Logs response in a readable format
    
    return result;
  } catch (err) {
    console.error(`❌ Query execution error:`, err);
    throw err;
  }
};

module.exports = { query };
