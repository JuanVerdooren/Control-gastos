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
  FaPlusCircle,
  FaEdit,
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
  saldoTotal,
}) {
  const [formulario, setFormulario] = useState({
    tipo: "ingreso",
    categoria: "Salario",
    descripcion: "",
    valor: "",
    fecha: obtenerFechaActual(),
  });

  useEffect(() => {
    if (movimientoEditar) {
      setFormulario({
        tipo: movimientoEditar.tipo,
        categoria: movimientoEditar.categoria,
        descripcion: movimientoEditar.descripcion,
        valor: movimientoEditar.valor,
        fecha: movimientoEditar.fecha.substring(0, 10),
      });
    }
  }, [movimientoEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tipo") {
      setFormulario({
        ...formulario,
        tipo: value,
        categoria: categorias[value][0],
      });

      return;
    }

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      tipo: "ingreso",
      categoria: "Salario",
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
        console.log(formulario);
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

  const confirmarReporte = () => {
    Swal.fire({
      title: "Generar Extracto",
      html: `
      <p>Se generará el extracto financiero del mes:</p>
      <h4 style="color:#198754; margin-top:10px;">
        ${mesSeleccionado}
      </h4>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#198754",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Generar PDF",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        generarExtracto(movimientos, mesSeleccionado, saldoTotal);
      }
    });
  };

  const categorias = {
    ingreso: [
      "Salario",
      "Transferencia",
      "Otros",
    ],
    egreso: [
      "Mercado",
      "Transporte",
      "Arriendo",
      "Prestamo",
      "Otros",
    ],
  };

  return (
    <div className="card border-0 shadow rounded-3 mb-4">
      <div className="card-header bg-success text-white rounded-top-4 py-3 px-3 d-flex justify-content-between align-items-center">
        <strong className="d-flex align-items-center">
          {movimientoEditar ? (
            <FaEdit className="me-1" />
          ) : (
            <FaPlusCircle className="me-1" />
          )}
          {movimientoEditar ? "Editar Movimiento" : "Nuevo Movimiento"}
        </strong>

        <button
          className="btn btn-light btn-sm rounded-pill px-3 shadow-sm"
          onClick={confirmarReporte}
        >
          <FaFilePdf className="text-black me-2" />
          PDF
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

            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold">Categoría</label>

              <select
                className="form-select rounded-3 shadow-sm"
                name="categoria"
                value={formulario.categoria}
                onChange={handleChange}
              >
                {categorias[formulario.tipo].map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
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
