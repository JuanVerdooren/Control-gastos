import Movimiento from "../models/Movimiento.js";

// Obtener todos los movimientos del usuario autenticado
export const obtenerMovimientos = async (req, res) => {
  try {
    const movimientos = await Movimiento.find({
      usuario: req.usuario.id,
    }).sort({
      fecha: -1,
      createdAt: -1,
    });

    res.json(movimientos);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Obtener uno
export const obtenerMovimiento = async (req, res) => {
  try {
    const movimiento = await Movimiento.findOne({
      _id: req.params.id,
      usuario: req.usuario.id,
    });

    if (!movimiento) {
      return res.status(404).json({
        mensaje: "Movimiento no encontrado",
      });
    }

    res.json(movimiento);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Crear
export const crearMovimiento = async (req, res) => {
  try {
    const movimiento = new Movimiento({
      ...req.body,
      usuario: req.usuario.id,
    });

    await movimiento.save();

    res.status(201).json(movimiento);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Actualizar
export const actualizarMovimiento = async (req, res) => {
  try {
    const movimiento = await Movimiento.findOneAndUpdate(
      {
        _id: req.params.id,
        usuario: req.usuario.id,
      },
      req.body,
      {
        new: true,
      },
    );

    if (!movimiento) {
      return res.status(404).json({
        mensaje: "Movimiento no encontrado",
      });
    }

    res.json(movimiento);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Eliminar
export const eliminarMovimiento = async (req, res) => {
  try {
    const movimiento = await Movimiento.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario.id,
    });

    if (!movimiento) {
      return res.status(404).json({
        mensaje: "Movimiento no encontrado",
      });
    }

    res.json({
      mensaje: "Movimiento eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};
