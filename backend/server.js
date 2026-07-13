import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";

import movimientoRoutes from "./routes/movimientoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

dotenv.config();

const app = express();

conectarDB();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Control de Gastos funcionando 🚀");
});

app.use("/api/movimientos", movimientoRoutes);
app.use("/api/usuarios", usuarioRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});