import { useState } from "react";
import api from "./services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow rounded-4">
            <div className="card-body">
              <h2 className="text-center mb-4">FinControl</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={ingresar}>
                <input
                  className="form-control mb-3"
                  type="email"
                  placeholder="Correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  className="form-control mb-3"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn btn-success w-100">Ingresar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
