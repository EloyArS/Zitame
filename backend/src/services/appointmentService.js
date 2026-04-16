const {
  createAppointment,
  updateAppointmentStatus,
  getAppointmentsByUserId,
  deleteAppointment,
} = require("../models/appointmentQueries");
const {
  createCustomer,
  getCustomerByPhone,
} = require("../models/customerQueries");

//Listar cita con lógica

async function getAppointmentsService(userId) {
  try {
    const appointments = await getAppointmentsByUserId(userId);
    return appointments;
  } catch (error) {
    throw error;
  }
}

//Creación de cita con lógica

const createAppointmentService = async ({
  name,
  phone,
  email,
  date_time,
  serviceId,
  userId,
}) => {
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
    return appointment;
  } catch (error) {
    throw error;
  }
};

//Actualizar la cita con lógica.

const updateAppointmentStatusHandlerService = async ({ id, status }) => {
  try {
    if (!["pending", "approved", "rejected"].includes(status)) {
      throw new Error("Estado no válido");
    }
    return await updateAppointmentStatus(id, status);
  } catch (error) {
    throw error;
  }
};

//Elimincar la cita con lógica.

const deleteAppointmentService = async (id) => {
  try {
    await deleteAppointment(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAppointmentService,
  updateAppointmentStatusHandlerService,
  getAppointmentsService,
  deleteAppointmentService,
};
