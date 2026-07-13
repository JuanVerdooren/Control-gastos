import express from "express";

import verificarToken from "../middleware/authMiddleware.js";

import {
  obtenerMovimientos,
  obtenerMovimiento,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento,
} from "../controllers/movimientoController.js";

const router = express.Router();

router.get("/", verificarToken, obtenerMovimientos);

router.get("/:id", verificarToken, obtenerMovimiento);

router.post("/", verificarToken, crearMovimiento);

router.put("/:id", verificarToken, actualizarMovimiento);

router.delete("/:id", verificarToken, eliminarMovimiento);

export default router;
