const { createUser, getUserByEmail } = require("../models/userQueries");
const bcrypt = require("bcrypt");

const logicUserCreateHandler = async (name, email, password) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashedPassword);
    return user;
  } catch (error) {
    throw error;
  }
};

const logicUserLoginHandler = async (email, password) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Contraseña incorrecta");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  logicUserCreateHandler,
  logicUserLoginHandler,
};
