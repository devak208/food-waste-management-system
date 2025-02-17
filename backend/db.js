const { Pool } = require("pg");
require("dotenv").config();

const pool = process.env.POSTGRES_URL
  ? new Pool({
      connectionString: process.env.POSTGRES_URL,
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

pool
  .connect()
  .then(() => console.log("Connected to the PostgreSQL database successfully."))
  .catch((err) => console.error("Database connection error:", err));

module.exports = pool;
