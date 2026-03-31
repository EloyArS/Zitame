const pool = require("../config/database");

const createService = async (name, duration, price, description, userId) => {
  const result = await pool.query(
    "INSERT INTO services (name, duration, price, description, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, duration, price, description, userId],
  );
  return result.rows[0];
};

const getServicesByUserId = async (userId) => {
  const result = await pool.query("SELECT * FROM services WHERE user_id = $1", [
    userId,
  ]);
  return result.rows;
};

const getServiceById = async (id) => {
  const result = await pool.query("SELECT * FROM services WHERE id = $1", [id]);
  return result.rows[0];
};

const updateService = async (id, name, duration, price, description) => {
  const result = await pool.query(
    "UPDATE services SET name = $1, duration = $2, price = $3, description = $4, updated_at = NOW() WHERE id = $5 RETURNING *",
    [name, duration, price, description, id],
  );
  return result.rows[0];
};

const deleteService = async (id) => {
  await pool.query("DELETE FROM services WHERE id = $1", [id]);
};

module.exports = {
  createService,
  getServicesByUserId,
  getServiceById,
  updateService,
  deleteService,
};
