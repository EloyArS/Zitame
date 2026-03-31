const {
  createAppointment,
  getAppointmentsByUserId,
  updateAppointmentStatus,
  getAppointmentById,
} = require("../models/appointmentQueries");
const {
  createCustomer,
  getCustomerByPhone,
} = require("../models/customerQueries");

const getAppointments = async (req, res) => {
  try {
    const appointments = await getAppointmentsByUserId(req.userId);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las citas" });
  }
};

const createAppointmentHandler = async (req, res) => {
  const { name, phone, email, date_time, serviceId, userId } = req.body;
  try {
    let customer = await getCustomerByPhone(phone);
    if (!customer) {
      customer = await createCustomer(name, phone, email);
    }
    const appointment = await createAppointment(
      date_time,
      userId,
      customer.id,
      serviceId,
    );
    res.status(201).json({ mensaje: "Cita creada correctamente", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la cita" });
  }
};

const updateAppointmentStatusHandler = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Estado no válido" });
    }
    const appointment = await updateAppointmentStatus(id, status);
    if (!appointment) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }
    res.json({
      mensaje: "Estado de la cita actualizado correctamente",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el estado de la cita" });
  }
};

module.exports = {
  getAppointments,
  createAppointmentHandler,
  updateAppointmentStatusHandler,
};
