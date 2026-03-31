const {
  createService,
  getServicesByUserId,
  getServiceById,
  updateService,
  deleteService,
} = require("../models/serviceQueries");

const getServices = async (req, res) => {
  try {
    const services = await getServicesByUserId(req.userId);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

const getServicesByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const services = await getServicesByUserId(userId);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

const createServiceHandler = async (req, res) => {
  const { name, duration, price, description } = req.body;
  try {
    const service = await createService(
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

const updateServiceHandler = async (req, res) => {
  const { id } = req.params;
  const { name, duration, price, description } = req.body;
  try {
    const service = await updateService(id, name, duration, price, description);
    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }
    res.json({ mensaje: "Servicio actualizado correctamente", service });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el servicio" });
  }
};

const deleteServiceHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteService(id);
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
