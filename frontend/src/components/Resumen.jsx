function Resumen({ movimientos }) {
  const ingresos = movimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((total, m) => total + m.valor, 0);

  const egresos = movimientos
    .filter((m) => m.tipo === "egreso")
    .reduce((total, m) => total + m.valor, 0);

  const balance = ingresos - egresos;

  const formato = (valor) =>
    valor.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });

  return (
    <div className="row mb-4">

      <div className="col-md-4">
        <div className="card border-success">
          <div className="card-body text-center">
            <h5>Ingresos</h5>
            <h3 className="text-success">{formato(ingresos)}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card border-danger">
          <div className="card-body text-center">
            <h5>Egresos</h5>
            <h3 className="text-danger">{formato(egresos)}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card border-primary">
          <div className="card-body text-center">
            <h5>Balance</h5>
            <h3 className="text-primary">{formato(balance)}</h3>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Resumen;