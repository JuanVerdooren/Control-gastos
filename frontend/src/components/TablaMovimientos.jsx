function TablaMovimientos({ movimientos, onEliminar, onEditar }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle movimientos-table">
        <thead className="table-dark">
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th className="text-end">Valor</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {movimientos.map((movimiento) => (
            <tr key={movimiento._id}>

              <td>
                {new Date(movimiento.fecha).toLocaleDateString("es-CO")}
              </td>

              <td>
                {movimiento.tipo === "ingreso" ? "Ingreso" : "Egreso"}
              </td>

              <td className="descripcion">
                {movimiento.descripcion}
              </td>

              <td
                className={`text-end fw-bold ${
                  movimiento.tipo === "ingreso"
                    ? "text-success"
                    : "text-danger"
                } valor`}
              >
                {movimiento.tipo === "egreso" ? "-" : "+"}
                {movimiento.valor.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                })}
              </td>

              <td className="text-center acciones">
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => onEditar(movimiento)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onEliminar(movimiento._id)}
                >
                  Eliminar
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaMovimientos;