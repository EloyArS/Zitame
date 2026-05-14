const {
  logicUserCreateHandler,
  logicUserLoginHandler,
  logicGetUsernameHandler,
} = require("../services/servicesUser");

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
    const { user, token } = await logicUserLoginHandler(email, password);
    res.cookie("cookietoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: "strict",
    });
    res.json({ mensaje: "Login correcto", user });
  } catch (error) {
    if (
      error.message === "Usuario no encontrado" ||
      error.message === "Contraseña incorrecta"
    ) {
      return res.status(401).json({ error: error.message });
    } else {
      console.error("Error en login:", error.message);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  }
};

//Solo controlador
const verifyCookie = (req, res) => {
  res.json({ mensaje: "Token válido", userId: req.userId });
};

//Solo controlador

const killcookie = (req, res) => {
  res.clearCookie("cookietoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: "strict",
  });
  res.json({ mensaje: "Logout exitoso" });
};

//Solo es controlador.
const getUsername = async (req, res) => {
  try {
    const userId = req.userId;
    const username = await logicGetUsernameHandler(userId);
    if (!userId) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(username);
  } catch (error) {
    console.error("Error al obtener el nombre de usuario:", error);
    res.status(500).json({ error: "Error al obtener el nombre de usuario" });
  }
};

module.exports = { register, login, verifyCookie, killcookie, getUsername };
