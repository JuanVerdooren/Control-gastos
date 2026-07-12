import { useState, useEffect } from "react";
import api from "../services/api";
import { NumericFormat } from "react-number-format";

function FormularioMovimiento({
  onGuardar,
  movimientoEditar,
  setMovimientoEditar,
}) {
  const [formulario, setFormulario] = useState({
    tipo: "ingreso",
    descripcion: "",
    valor: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (movimientoEditar) {
      setFormulario({
        tipo: movimientoEditar.tipo,
        descripcion: movimientoEditar.descripcion,
        valor: movimientoEditar.valor,
        fecha: movimientoEditar.fecha.split("T")[0],
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
      fecha: new Date().toISOString().split("T")[0],
    });

    setMovimientoEditar(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formulario.descripcion.trim()) {
      alert("Ingrese una descripción");
      return;
    }

    if (Number(formulario.valor) <= 0) {
      alert("Ingrese un valor válido");
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
    } catch (error) {
      console.error(error);
      alert("Error al guardar el movimiento");
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header">
        <strong>
          {movimientoEditar ? "Editar Movimiento" : "Nuevo Movimiento"}
        </strong>
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
