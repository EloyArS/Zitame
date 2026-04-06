const {
  logicServiceHandler,
  updatelogicServiceHandler,
  deleteLogicServiceHandler,
} = require("../services/servicesService");
const { getServicesByUserId } = require("../models/serviceQueries");

//Controlador y lógica

const getServices = async (req, res) => {
  try {
    const services = await getServicesByUserId(req.userId);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

//controlador y lógica

const getServicesByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const services = await getServicesByUserId(userId);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

// Solo controlador

const createServiceHandler = async (req, res) => {
  const { name, duration, price, description } = req.body;
  try {
    const service = await logicServiceHandler(
      name,
      duration,
      price,
      description,
      req.userId,
    );
    res.status(201).json({ mensaje: "Servicio creado correctamente", service });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el servicio" });
  }
};

//Solo controlador.

const updateServiceHandler = async (req, res) => {
  const { id } = req.params;
  const { name, duration, price, description } = req.body;
  try {
    const service = await updatelogicServiceHandler(
      id,
      name,
      duration,
      price,
      description,
    );
    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }
    res.json({ mensaje: "Servicio actualizado correctamente", service });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el servicio" });
  }
};

//Solo controlador.

const deleteServiceHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteLogicServiceHandler(id);
    res.json({ mensaje: "Servicio eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el servicio" });
  }
};

module.exports = {
  getServices,
  getServicesByUser,
  createServiceHandler,
  updateServiceHandler,
  deleteServiceHandler,
};
