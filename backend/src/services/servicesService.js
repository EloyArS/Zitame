const {
  getServiceById,
  getServicesByUserId,
  createService,
  updateService,
  deleteService,
} = require("../models/serviceQueries");

//lógica

const logicgetServiceHandler = async (id) => {
  try {
    const service = await getServiceById(id);
    return service;
  } catch (error) {
    throw error;
  }
};

//lógica

const logicServiceByUserHandler = async (userId) => {
  try {
    const services = await getServicesByUserId(userId);
    return services;
  } catch (error) {
    throw error;
  }
};

//Logica

const logicServiceHandler = async (
  name,
  duration,
  price,
  description,
  userId,
) => {
  try {
    const service = await createService(
      name,
      duration,
      price,
      description,
      userId,
    );
    return service;
  } catch (error) {
    throw error;
  }
};

//Logica

const updatelogicServiceHandler = async (
  id,
  name,
  duration,
  price,
  description,
) => {
  try {
    const service = await updateService(id, name, duration, price, description);
    return service;
  } catch (error) {
    throw error;
  }
};

//Logica

const deleteLogicServiceHandler = async (id) => {
  try {
    await deleteService(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  logicgetServiceHandler,
  logicServiceByUserHandler,
  logicServiceHandler,
  updatelogicServiceHandler,
  deleteLogicServiceHandler,
};
