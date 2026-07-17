import {
  FaEdit,
  FaTrash,
  FaListAlt,
  FaArrowCircleUp,
  FaArrowCircleDown,
  FaSyncAlt,
  FaChevronDown,
  FaCoins,
  FaShoppingCart,
  FaBus,
  FaHome,
  FaMoneyCheckAlt,
  FaExchangeAlt,
  FaEllipsisH,
  FaHandHoldingUsd,
} from "react-icons/fa";
import { useState } from "react";

function TablaMovimientos({
  movimientos,
  todosMovimientos,
  onEliminar,
  onEditar,
  onActualizar,
}) {
  const [actualizando, setActualizando] = useState(false);
  const [cantidadVisible, setCantidadVisible] = useState(5);

  const actualizarMovimientos = async () => {
    setActualizando(true);

    await onActualizar();

    setTimeout(() => {
      setActualizando(false);
    }, 500);
  };

  const movimientosVisibles = movimientos.slice(0, cantidadVisible);

  const hoy = new Date();

  const hoyTexto = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

  const gastosHoy = todosMovimientos.reduce((total, movimiento) => {
    if (movimiento.fecha.substring(0, 10) !== hoyTexto) return total;

    if (movimiento.tipo !== "egreso") return total;

    return total + movimiento.valor;
  }, 0);

  const iconosCategoria = {
    Salario: <FaMoneyCheckAlt />,
    Transferencia: <FaExchangeAlt />,
    Mercado: <FaShoppingCart />,
    Transporte: <FaBus />,
    Arriendo: <FaHome />,
    Prestamo: <FaHandHoldingUsd />,
    Otros: <FaEllipsisH />,
  };

  return (
    <div className="card border-0 shadow rounded-4 mb-4">
      <div className="card-header bg-success text-white rounded-top-4 py-2 d-flex align-items-center">
        <h5 className="mb-0 fw-bold text-white">
          <FaListAlt className="me-2 mb-1" />
          Movimientos
        </h5>

        <div className="mx-auto d-flex align-items-center fw-bold fs-6">
          <FaCoins className="me-2" />-{" "}
          {gastosHoy.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          })}
        </div>
        <button
          className="btn btn-light btn-sm rounded-circle"
          title="Actualizar movimientos"
          onClick={actualizarMovimientos}
          disabled={actualizando}
        >
          {actualizando ? (
            <span
              className="spinner-border spinner-border-sm text-success"
              role="status"
            />
          ) : (
            <FaSyncAlt size={14} />
          )}
        </button>
      </div>

      <div className="card-body">
        {movimientos.length === 0 ? (
          <div className="text-center text-muted py-4">
            No hay movimientos registrados.
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {movimientosVisibles.map((movimiento) => {
              const fechaObj = new Date(
                `${movimiento.fecha.slice(0, 10)}T00:00:00`,
              );

              const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

              const diaSemana = dias[fechaObj.getDay()];

              const fecha = `${diaSemana}, ${String(fechaObj.getDate()).padStart(2, "0")}/${String(fechaObj.getMonth() + 1).padStart(2, "0")}/${String(fechaObj.getFullYear()).slice(2)}`;

              return (
                <div
                  key={movimiento._id}
                  className={`card shadow-sm border-0 rounded-4 ${
                    movimiento.tipo === "ingreso"
                      ? "border-start border-4 border-success"
                      : "border-start border-4 border-danger"
                  }`}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted">{fecha}</small>

                        <h6 className="fw-bold mb-0 mt-1">
                          {movimiento.descripcion}
                        </h6>
                      </div>

                      <h5
                        className={`fw-bold mb-0 d-flex align-items-center ${
                          movimiento.tipo === "ingreso"
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {movimiento.tipo === "ingreso" ? (
                          <FaArrowCircleUp className="me-2" size={13} />
                        ) : (
                          <FaArrowCircleDown className="me-2" size={13} />
                        )}

                        {movimiento.valor.toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        })}
                      </h5>
                    </div>

                    <hr className="my-3" />

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center text-muted fw-semibold">
                        <span className="me-1 mb-1">
                          {iconosCategoria[movimiento.categoria] || (
                            <FaEllipsisH />
                          )}
                        </span>

                        {movimiento.categoria
                          ? movimiento.categoria.charAt(0).toUpperCase() +
                            movimiento.categoria.slice(1)
                          : "Otros"}
                      </div>

                      <div className="ms-auto d-flex gap-2">
                        <button
                          className="btn btn-light btn-sm rounded-circle shadow-sm"
                          title="Editar"
                          onClick={() => onEditar(movimiento)}
                        >
                          <FaEdit className="text-dark" />
                        </button>

                        <button
                          className="btn btn-light btn-sm rounded-circle shadow-sm"
                          title="Eliminar"
                          onClick={() => onEliminar(movimiento._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {cantidadVisible < movimientos.length && (
        <div className="text-center">
          <button
            className="btn btn-light mb-2 border border-success text-success rounded-pill px-4 py-2 shadow-sm fw-semibold d-inline-flex align-items-center gap-2"
            onClick={() => setCantidadVisible((prev) => prev + 5)}
          >
            <FaChevronDown />
            Ver más movimientos
          </button>
        </div>
      )}
    </div>
  );
}

export default TablaMovimientos;
