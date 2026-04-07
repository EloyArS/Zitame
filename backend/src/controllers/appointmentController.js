const {
  createAppointmentService,
  updateAppointmentStatusHandlerService,
  getAppointmentsService,
} = require("../services/appointmentService.js");

//Es solo cntrolador, la lógica se realiza en Services

const getAppointments = async (req, res) => {
  try {
    const appointments = await getAppointmentsService(req.userId);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las citas" });
  }
};

//Es solo cntrolador, la lógica se realiza en Services

const createAppointmentHandler = async (req, res) => {
  const { name, phone, email, date_time, serviceId, userId } = req.body;
  try {
    const appointment = await createAppointmentService({
      name,
      phone,
      email,
      date_time,
      serviceId,
      userId,
    });
    res.status(201).json({ mensaje: "Cita creada correctamente", appointment });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la cita" });
  }
};

//Es solo controlador, la lógica se realiza en Services.

const updateAppointmentStatusHandler = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedAppointment = await updateAppointmentStatusHandlerService({
      id,
      status,
    });
    res.status(200).json({
      mensaje: "Estado de la cita actualizado correctamente",
      updatedAppointment,
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
