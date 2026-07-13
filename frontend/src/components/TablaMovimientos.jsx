import {
  FaEdit,
  FaTrash,
  FaListAlt,
  FaArrowCircleUp,
  FaArrowCircleDown,
} from "react-icons/fa";

function TablaMovimientos({ movimientos, onEliminar, onEditar }) {
  return (
    <div className="card border-0 shadow rounded-4 mb-4">
      <div className="card-header bg-success text-white rounded-top-4 py-2 d-flex justify-content-center align-items-center">
        <h5 className="mb-0 fw-bold text-white">
          <FaListAlt className="me-2 mb-1" />
          Movimientos
        </h5>
      </div>

      <div className="card-body">
        {movimientos.length === 0 ? (
          <div className="text-center text-muted py-4">
            No hay movimientos registrados.
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {movimientos.map((movimiento) => {
              const [anio, mes, dia] = movimiento.fecha.slice(0, 10).split("-");

              const fecha = `${dia}/${mes}/${anio.slice(2)}`;

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

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-success btn-sm rounded-circle"
                        title="Editar"
                        onClick={() => onEditar(movimiento)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-danger btn-sm rounded-circle"
                        title="Eliminar"
                        onClick={() => onEliminar(movimiento._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TablaMovimientos;
