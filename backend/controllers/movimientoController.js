import Movimiento from "../models/Movimiento.js";

// Obtener todos
export const obtenerMovimientos = async (req, res) => {
  try {
    const movimientos = await Movimiento.find().sort({ fecha: -1 });

    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener uno
export const obtenerMovimiento = async (req, res) => {
  try {
    const movimiento = await Movimiento.findById(req.params.id);

    if (!movimiento) {
      return res.status(404).json({
        mensaje: "Movimiento no encontrado",
      });
    }

    res.json(movimiento);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Crear
export const crearMovimiento = async (req, res) => {
  try {
    const movimiento = new Movimiento(req.body);

    await movimiento.save();

    res.status(201).json(movimiento);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar
export const actualizarMovimiento = async (req, res) => {
  try {
    const movimiento = await Movimiento.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(movimiento);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar
export const eliminarMovimiento = async (req, res) => {
  try {
    await Movimiento.findByIdAndDelete(req.params.id);

    res.json({
      mensaje: "Movimiento eliminado",
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};