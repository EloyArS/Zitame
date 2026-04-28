const {
  logicUserCreateHandler,
  logicUserLoginHandler,
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
    console.log("Token generado:", token);
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

const verifyCookie = (req, res) => {
  res.json({ mensaje: "Token válido", userId: req.userId });
};

const killcookie = (req, res) => {
  res.clearCookie("cookietoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: "strict",
  });
  res.json({ mensaje: "Logout exitoso" });
};

module.exports = { register, login, verifyCookie, killcookie };
