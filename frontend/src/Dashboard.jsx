import { useEffect, useRef, useState } from "react";
import api from "./services/api";
import Resumen from "./components/Resumen";
import FormularioMovimiento from "./components/FormularioMovimiento";
import TablaMovimientos from "./components/TablaMovimientos";
import Swal from "sweetalert2";
import Login from "./Login";
import {
  FiLogOut,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
function Dashboard({ cerrarSesion }) {
  const [movimientos, setMovimientos] = useState([]);
  const [movimientoEditar, setMovimientoEditar] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const monthPickerRef = useRef(null);

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

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

  const cambiarMes = (direccion) => {
    const [anio, mes] = mesSeleccionado.split("-").map(Number);

    const fecha = new Date(anio, mes - 1);

    fecha.setMonth(fecha.getMonth() + direccion);

    const nuevoMes = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1,
    ).padStart(2, "0")}`;

    setMesSeleccionado(nuevoMes);
  };

  const [anio, mes] = mesSeleccionado.split("-").map(Number);

  const fechaActual = new Date(anio, mes - 1, 1);

  const mesMostrar = fechaActual.toLocaleDateString("es-CO", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="container-fluid container-lg mt-3 px-3">
      {" "}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body position-relative pt-5 pt-md-5 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          {" "}
          <div className="position-absolute top-0 start-0 end-0 m-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2 text-black fw-semibold">
              <FiUser size={20} />
              Hola, {usuario?.nombre}
            </div>

            <button
              className="btn d-flex align-items-center gap-2 text-danger"
              onClick={cerrarSesion}
              title="Cerrar sesión"
            >
              <FiLogOut size={20} />
              Sign Out
            </button>
          </div>
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
          <div className="d-flex align-items-center justify-content-center">
            <button
              type="button"
              className="btn border-0 bg-transparent p-0"
              onClick={() => cambiarMes(-1)}
              title="Mes anterior"
            >
              <FiChevronLeft size={28} className="fw-bold text-dark" />
            </button>
            <div
              className="fw-bold text-dark text-center"
              style={{
                width: "110px",
                cursor: "pointer",
                fontSize: "1rem",
                userSelect: "none",
              }}
              onClick={() => monthPickerRef.current?.showPicker()}
            >
              {mesMostrar}
            </div>
            <input
              ref={monthPickerRef}
              type="month"
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(e.target.value)}
              style={{
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            <button
              type="button"
              className="btn border-0 bg-transparent p-0"
              onClick={() => cambiarMes(1)}
              title="Mes siguiente"
            >
              <FiChevronRight size={28} className="fw-bold text-dark" />
            </button>
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
        saldoTotal={saldoTotal}
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

export default Dashboard;
