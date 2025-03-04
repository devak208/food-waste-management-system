const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }, // Required for Vercel Postgres
});

pool
  .connect()
  .then(() => console.log("✅ Connected to Vercel PostgreSQL successfully."))
  .catch((err) => console.error("❌ Database connection error:", err));

const query = async (text, params) => {
  console.log(`📡 Executing query: ${text}`);
  if (params) console.log(`📌 With parameters: ${JSON.stringify(params)}`);

  try {
    const result = await pool.query(text, params);
    
    console.log(`✅ Query executed successfully.`);
    return result.rows;
  } catch (err) {
    console.error(`❌ Query execution error:`, err);
    throw err;
  }
};

module.exports = { query };
