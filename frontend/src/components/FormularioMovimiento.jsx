import { useState, useEffect } from "react";
import api from "../services/api";
import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";
import {
  FaFilePdf,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTag,
  FaSave,
  FaAlignLeft,
} from "react-icons/fa";
import generarExtracto from "../reportes/generarExtracto";

const obtenerFechaActual = () => {
  const fecha = new Date();

  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
};

function FormularioMovimiento({
  onGuardar,
  movimientoEditar,
  setMovimientoEditar,
  movimientos,
  mesSeleccionado,
}) {
  const [formulario, setFormulario] = useState({
    tipo: "ingreso",
    descripcion: "",
    valor: "",
    fecha: obtenerFechaActual(),
  });

  useEffect(() => {
    if (movimientoEditar) {
      setFormulario({
        tipo: movimientoEditar.tipo,
        descripcion: movimientoEditar.descripcion,
        valor: movimientoEditar.valor,
        fecha: movimientoEditar.fecha.substring(0, 10),
      });
    }
  }, [movimientoEditar]);

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      tipo: "ingreso",
      descripcion: "",
      valor: "",
      fecha: obtenerFechaActual(),
    });

    setMovimientoEditar(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formulario.descripcion.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Descripción requerida",
        text: "Ingrese una descripción",
      });

      return;
    }

    if (Number(formulario.valor) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Valor inválido",
        text: "Ingrese un valor mayor a cero",
      });

      return;
    }

    try {
      if (movimientoEditar) {
        await api.put(`/movimientos/${movimientoEditar._id}`, {
          ...formulario,
          valor: Number(formulario.valor),
        });
      } else {
        await api.post("/movimientos", {
          ...formulario,
          valor: Number(formulario.valor),
        });
      }

      limpiarFormulario();

      onGuardar();

      Swal.fire({
        icon: "success",

        title: movimientoEditar
          ? "Movimiento actualizado"
          : "Movimiento creado",

        text: movimientoEditar
          ? "El movimiento fue actualizado correctamente"
          : "El movimiento fue guardado correctamente",

        timer: 2000,

        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el movimiento",
      });
    }
  };

  return (
    <div className="card border-0 shadow rounded-3 mb-4">
      <div className="card-header bg-success text-white rounded-top-4 py-3 px-3 d-flex justify-content-between align-items-center">
        <strong>
          {movimientoEditar ? "Editar Movimiento" : "Nuevo Movimiento"}
        </strong>

        <button
          className="btn btn-light btn-sm d-flex align-items-center gap-1"
          onClick={() => generarExtracto(movimientos, mesSeleccionado)}
        >
          <FaFilePdf className="me-1" />
          Generar PDF
        </button>
      </div>

      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-2">
              <label className="form-label fw-semibold">
                <FaTag className="me-2 text-success" />
                Tipo
              </label>

              <select
                className="form-select rounded-3 shadow-sm"
                name="tipo"
                value={formulario.tipo}
                onChange={handleChange}
              >
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">
                <FaAlignLeft className="me-2 text-success" />
                Descripción
              </label>

              <input
                className="form-control rounded-3 shadow-sm"
                name="descripcion"
                placeholder="Ej. Pago de nómina, Mercado..."
                value={formulario.descripcion}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-2">
              <label className="form-label fw-semibold">
                <FaMoneyBillWave className="me-2 text-success" />
                Valor
              </label>

              <NumericFormat
                className="form-control rounded-3 shadow-sm"
                thousandSeparator="."
                decimalSeparator=","
                prefix="$ "
                decimalScale={0}
                allowNegative={false}
                placeholder="$ 0"
                value={formulario.valor}
                onValueChange={(values) =>
                  setFormulario({
                    ...formulario,
                    valor: values.floatValue || "",
                  })
                }
              />
            </div>

            <div className="col-12 col-md-2">
              <label className="form-label fw-semibold">
                <FaCalendarAlt className="me-2 text-success" />
                Fecha
              </label>

              <input
                type="date"
                className="form-control rounded-3 shadow-sm"
                name="fecha"
                value={formulario.fecha}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-2 d-flex align-items-end">
              <button
                type="submit"
                className="btn btn-success w-100 rounded-3 shadow py-2"
              >
                <FaSave className="me-2" />
                {movimientoEditar ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioMovimiento;
