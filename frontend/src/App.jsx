import { useEffect, useState } from "react";
import api from "./services/api";
import Resumen from "./components/Resumen";
import FormularioMovimiento from "./components/FormularioMovimiento";
import TablaMovimientos from "./components/TablaMovimientos";
import Swal from "sweetalert2";

function App() {
  const [movimientos, setMovimientos] = useState([]);
  const [movimientoEditar, setMovimientoEditar] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(
    new Date().toISOString().slice(0, 7),
  );

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = async () => {
    try {
      const { data } = await api.get("/movimientos");
      setMovimientos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const movimientosFiltrados = movimientos.filter((movimiento) => {
    const fecha = new Date(movimiento.fecha);

    const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
      2,
      "0",
    )}`;

    return mes === mesSeleccionado;
  });

  const saldoTotal = movimientos.reduce((saldo, movimiento) => {
    return movimiento.tipo === "ingreso"
      ? saldo + movimiento.valor
      : saldo - movimiento.valor;
  }, 0);

  const eliminarMovimiento = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar movimiento?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
    });

    if (!confirmar.isConfirmed) return;

    try {
      await api.delete(`/movimientos/${id}`);

      cargarMovimientos();

      Swal.fire({
        icon: "success",
        title: "Movimiento eliminado",
        text: "El movimiento fue eliminado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el movimiento",
      });
    }
  };

  const editarMovimiento = (movimiento) => {
    setMovimientoEditar(movimiento);
  };

  return (
    <div className="container-fluid container-lg mt-3 px-3">
      {" "}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
          <div className="d-flex flex-column flex-sm-row align-items-center text-center text-md-start">
            <img
              src="/cb36ee16-a4e4-4336-b898-8e387c57db25.png"
              alt="FinControl"
              width="100"
              height="100"
              className="me-md-3 mb-2 mb-sm-0"
            />

            <div>
              <h2 className="fw-bold text-success mb-1">FinControl</h2>

              <small className="text-muted">
                Control de ingresos y egresos
              </small>
            </div>
          </div>

          <div className="w-100 w-md-auto" style={{ maxWidth: "220px" }}>
            <input
              type="month"
              className="form-control border-success fw-semibold text-center"
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Tarjetas con ingresos, egresos y balance */}
      <Resumen movimientos={movimientosFiltrados} saldoTotal={saldoTotal} />
      <FormularioMovimiento
        onGuardar={cargarMovimientos}
        movimientoEditar={movimientoEditar}
        setMovimientoEditar={setMovimientoEditar}
        movimientos={movimientosFiltrados}
        mesSeleccionado={mesSeleccionado}
      />
      <TablaMovimientos
        movimientos={movimientosFiltrados}
        onEliminar={eliminarMovimiento}
        onEditar={editarMovimiento}
        onActualizar={cargarMovimientos}
      />
    </div>
  );
}

export default App;
