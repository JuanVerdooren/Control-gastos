function TablaMovimientos({ movimientos, onEliminar, onEditar }) {
  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="table-dark">
        <tr>
          <th>Fecha</th>
          <th>Descripción</th>
          <th className="text-center">Valor</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {movimientos.map((movimiento) => (
          <tr key={movimiento._id}>
            <td>{new Date(movimiento.fecha).toLocaleDateString("es-CO")}</td>

            <td>{movimiento.descripcion}</td>

            <td
              className={`text-center fw-bold ${
                movimiento.tipo === "ingreso" ? "text-success" : "text-danger"
              }`}
            >
              {movimiento.tipo === "egreso" ? "-" : "+"}

              {movimiento.valor.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
              })}
            </td>

            <td className="text-center" >
              <div className="d-flex flex-column flex-md-row gap-1 align-items-center justify-content-center">
                <button
                  className="btn btn-warning btn-sm btn-accion"
                  onClick={() => onEditar(movimiento)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm btn-accion"
                  onClick={() => onEliminar(movimiento._id)}
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TablaMovimientos;
