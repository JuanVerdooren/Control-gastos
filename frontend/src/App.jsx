import { useEffect, useState } from "react";
import api from "./services/api";
import Resumen from "./components/Resumen";
import FormularioMovimiento from "./components/FormularioMovimiento";
import TablaMovimientos from "./components/TablaMovimientos";

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

  const eliminarMovimiento = async (id) => {
    const confirmar = window.confirm("¿Desea eliminar este movimiento?");

    if (!confirmar) return;

    try {
      await api.delete(`/movimientos/${id}`);

      cargarMovimientos();
    } catch (error) {
      console.error(error);
    }
  };

  const editarMovimiento = (movimiento) => {
    setMovimientoEditar(movimiento);
  };

  return (
    <div className="container mt-4">
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
      <Resumen movimientos={movimientosFiltrados} />
      <FormularioMovimiento
        onGuardar={cargarMovimientos}
        movimientoEditar={movimientoEditar}
        setMovimientoEditar={setMovimientoEditar}
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
