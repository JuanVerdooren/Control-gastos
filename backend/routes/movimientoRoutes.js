import express from "express";

import {
  obtenerMovimientos,
  obtenerMovimiento,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento,
} from "../controllers/movimientoController.js";

const router = express.Router();

router.get("/", obtenerMovimientos);

router.get("/:id", obtenerMovimiento);

router.post("/", crearMovimiento);

router.put("/:id", actualizarMovimiento);

router.delete("/:id", eliminarMovimiento);

export default router;