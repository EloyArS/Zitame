const pool = require("../config/database");

const createAppointment = async (date_time, userId, customerId, serviceId) => {
  const result = await pool.query(
    "INSERT INTO appointments (date_time, user_id, customer_id, service_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [date_time, userId, customerId, serviceId],
  );
  return result.rows[0];
};

const getAppointmentsByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT appointments.*, customers.name AS customer_name, customers.phone, services.name AS service_name 
         FROM appointments 
         JOIN customers ON appointments.customer_id = customers.id 
         JOIN services ON appointments.service_id = services.id 
         WHERE appointments.user_id = $1 
         ORDER BY appointments.date_time ASC`,
    [userId],
  );
  return result.rows;
};

const updateAppointmentStatus = async (id, status) => {
  const result = await pool.query(
    "UPDATE appointments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
    [status, id],
  );
  return result.rows[0];
};

const getAppointmentById = async (id) => {
  const result = await pool.query("SELECT * FROM appointments WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

const deleteAppointment = async (id) => {
  try {
    await pool.query("DELETE FROM appointments WHERE id = $1", [id]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAppointment,
  getAppointmentsByUserId,
  updateAppointmentStatus,
  getAppointmentById,
  deleteAppointment,
};
