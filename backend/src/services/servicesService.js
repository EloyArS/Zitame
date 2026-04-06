const {
  createService,
  updateService,
  deleteService,
} = require("../models/serviceQueries");

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

const deleteLogicServiceHandler = async (id) => {
  try {
    await deleteService(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  logicServiceHandler,
  updatelogicServiceHandler,
  deleteLogicServiceHandler,
};
