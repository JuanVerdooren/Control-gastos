import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Swal from "sweetalert2";

function App() {
  const [logueado, setLogueado] = useState(!!localStorage.getItem("token"));

  const cerrarSesion = async () => {
    const resultado = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
    });

    if (!resultado.isConfirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setLogueado(false);

    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  if (!logueado) {
    return <Login onLogin={() => setLogueado(true)} />;
  }

  return <Dashboard cerrarSesion={cerrarSesion} />;
}

export default App;
