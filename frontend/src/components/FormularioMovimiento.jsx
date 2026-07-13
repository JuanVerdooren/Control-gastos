import { useState, useEffect } from "react";
import api from "../services/api";
import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";
import { FaFilePdf } from "react-icons/fa";
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
    <div className="card mb-4 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <strong>
          {movimientoEditar ? "Editar Movimiento" : "Nuevo Movimiento"}
        </strong>

        <button
          className="btn btn-sm"
          onClick={() => generarExtracto(movimientos, mesSeleccionado)}
        >
          <FaFilePdf className="me-1" />
          Generar PDF
        </button>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-2 mb-2">
              <label className="form-label">Tipo</label>

              <select
                className="form-select"
                name="tipo"
                value={formulario.tipo}
                onChange={handleChange}
              >
                <option value="ingreso">Ingreso</option>

                <option value="egreso">Egreso</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Descripción</label>

              <input
                className="form-control"
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2 mb-3">
              <label className="form-label">Valor</label>

              <NumericFormat
                className="form-control"
                thousandSeparator="."
                decimalSeparator=","
                prefix="$ "
                decimalScale={0}
                allowNegative={false}
                value={formulario.valor}
                onValueChange={(values) =>
                  setFormulario({
                    ...formulario,

                    valor: values.floatValue || "",
                  })
                }
              />
            </div>

            <div className="col-md-2 mb-3">
              <label className="form-label">Fecha</label>

              <input
                type="date"
                className="form-control"
                name="fecha"
                value={formulario.fecha}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2 mb-3 d-flex align-items-end">
              <button className="btn btn-primary w-100">
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
