const {
  createUser,
  getUserByEmail,
  getUserById,
} = require("../models/userQueries");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashedPassword);
    res.status(201).json({ mensaje: "Usuario registrado correctamente", user });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.json({ mensaje: "Login correcto", token });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = { register, login };
