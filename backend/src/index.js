require("dotenv").config();
const express = require("express");
const path = require("path");
const pool = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. RUTAS DE LA API
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/api", (req, res) => {
  res.json({ mensaje: "API de Zitame funcionando" });
});

const frontendPath = path.join(__dirname, "../../frontend/build");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// 4. CONEXIÓN Y ARRANQUE
pool
  .connect()
  .then(() => {
    console.log("Conexión a la base de datos establecida correctamente.");
    app.listen(PORT, () => {
      console.log(`Servidor único corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar con la base de datos:", error);
  });
