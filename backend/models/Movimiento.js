import mongoose from "mongoose";

const movimientoSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ["ingreso", "egreso"],
      required: true,
    },

    descripcion: {
      type: String,
      required: true,
      trim: true,
    },

    valor: {
      type: Number,
      required: true,
      min: 1,
    },

    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Movimiento", movimientoSchema);