import { useState } from "react";
import api from "./services/api";
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const ingresar = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/usuarios/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      onLogin();
    } catch (error) {
      setError(error.response?.data?.mensaje || "Error al iniciar sesión");
    }
  };
  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{ background: "#f5f7fa" }}
    >
      <div className="col-11 col-sm-8 col-md-7 col-lg-5 col-xl-4">
        {" "}
        <div className="card border-0 shadow-lg rounded-4">
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <img
                src="/cb36ee16-a4e4-4336-b898-8e387c57db25.png"
                alt="FinControl"
                width="80"
                className="mb-3"
              />

              <h2 className="fw-bold text-success mb-1">FinControl</h2>

              <p className="text-muted mb-0">Inicia sesión para continuar</p>
            </div>

            {error && (
              <div className="alert alert-danger rounded-3">{error}</div>
            )}

            <form onSubmit={ingresar}>
              <div className="input-group mb-3">
                <span className="input-group-text bg-success text-white">
                  <FaEnvelope />
                </span>

                <input
                  className="form-control"
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Contraseña</label>

                <div className="position-relative">
                  <FaLock
                    className="position-absolute text-success"
                    style={{
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />

                  <input
                    className="form-control ps-5 pe-5"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn border-0 position-absolute"
                    style={{
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      boxShadow: "none",
                    }}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-secondary" />
                    ) : (
                      <FaEye className="text-secondary" />
                    )}
                  </button>
                </div>
              </div>

              <button className="btn btn-success w-100 rounded-3 py-2 fw-semibold">
                <FaSignInAlt className="me-2" />
                Ingresar
              </button>
            </form>

            <hr />

            <div className="text-center">
              <small className="text-muted">
                © {new Date().getFullYear()} FinControl
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
