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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Control de Ingresos y Egresos</h2>

        <div style={{ width: "180px" }}>
          <input
            type="month"
            className="form-control"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
          />
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
      />
    </div>
  );
}

export default App;
