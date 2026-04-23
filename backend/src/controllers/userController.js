const {
  logicUserCreateHandler,
  logicUserLoginHandler,
} = require("../services/servicesUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Solo controlador

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await logicUserCreateHandler(name, email, password);
    res.status(201).json({ mensaje: "Usuario registrado correctamente", user });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

//Solo controlador

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await logicUserLoginHandler(email, password);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.json({ mensaje: "Login correcto", token });
  } catch (error) {
    console.error("Error en login:", error.message);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = { register, login };
