import {
  FaArrowUp,
  FaArrowDown,
  FaBalanceScale,
  FaWallet,
} from "react-icons/fa";

function Resumen({ movimientos, saldoTotal }) {
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
    <div className="row g-3 mb-4">

      {/* Ingresos */}
      <div className="col-6 col-md-6">
        <div className="card shadow border-0 rounded-4 h-100">
          <div className="card-body text-center py-4">
            <FaArrowUp size={35} className="text-success mb-3" />
            <h6 className="text-muted">Ingresos</h6>
            <h3 className="fw-bold text-success">
              {formato(ingresos)}
            </h3>
          </div>
        </div>
      </div>

      {/* Egresos */}
      <div className="col-6 col-md-6">
        <div className="card shadow border-0 rounded-4 h-100">
          <div className="card-body text-center py-4">
            <FaArrowDown size={35} className="text-danger mb-3" />
            <h6 className="text-muted">Egresos</h6>
            <h3 className="fw-bold text-danger">
              {formato(egresos)}
            </h3>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="col-6 col-md-6">
        <div className="card shadow border-0 rounded-4 h-100">
          <div className="card-body text-center py-4">
            <FaBalanceScale size={35} className="text-primary mb-3" />
            <h6 className="text-muted">Balance del Mes</h6>
            <h3 className="fw-bold text-primary">
              {formato(balance)}
            </h3>
          </div>
        </div>
      </div>

      {/* Saldo Total */}
      <div className="col-6 col-md-6">
        <div className="card shadow border-0 rounded-4 h-100">
          <div className="card-body text-center py-4">
            <FaWallet size={35} className="text-warning mb-3" />
            <h6 className="text-muted">Saldo Total</h6>
            <h3 className="fw-bold text-warning">
              {formato(saldoTotal)}
            </h3>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Resumen;