import { FaTrash, FaFilePdf, FaSignOutAlt, FaCheck } from "react-icons/fa";

function ConfirmModal({
  show,
  titulo,
  mensaje,
  icono,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  colorConfirmar = "success",
  onConfirmar,
  onCancelar,
  children,
}) {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{
        background: "rgba(15,23,42,.55)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 rounded-5 shadow-lg"
          style={{
            minHeight: "360px",
            overflow: "hidden",
          }}
        >
          <div className="modal-body d-flex flex-column align-items-center justify-content-center text-center px-5 py-5">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle shadow-sm mb-4"
              style={{
                width: 90,
                height: 90,
                background: "#f8f9fa",
              }}
            >
              {icono}
            </div>

            <h3 className="fw-bold mb-2">{titulo}</h3>

            <p
              className="text-muted mb-3"
              style={{
                maxWidth: "300px",
                lineHeight: 1.6,
              }}
            >
              {mensaje}
            </p>

            {children && <div className="mb-4">{children}</div>}

            <div className="d-flex gap-3 w-100 mt-auto">
              <button
                className="btn btn-light border rounded-pill flex-fill py-2 fw-semibold"
                onClick={onCancelar}
              >
                {textoCancelar}
              </button>

              <button
                className={`btn btn-${colorConfirmar} rounded-pill flex-fill py-2 fw-semibold shadow-sm`}
                onClick={onConfirmar}
              >
                {textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
