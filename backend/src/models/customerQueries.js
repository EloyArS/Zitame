const pool = require("../config/database");

const createCustomer = async (name, phone, email) => {
  const result = await pool.query(
    "INSERT INTO customers (name, phone, email) VALUES ($1, $2, $3) RETURNING *",
    [name, phone, email],
  );
  return result.rows[0];
};

const getCustomerByPhone = async (phone) => {
  const result = await pool.query("SELECT * FROM customers WHERE phone = $1", [
    phone,
  ]);
  return result.rows[0];
};

const getCustomerById = async (id) => {
  const result = await pool.query("SELECT * FROM customers WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

module.exports = { createCustomer, getCustomerByPhone, getCustomerById };
