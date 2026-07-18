import { useEffect, useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Swal from "sweetalert2";
import ConfirmModal from "./components/ConfirmModal";
import { FaSignOutAlt } from "react-icons/fa";

function App() {
  const [logueado, setLogueado] = useState(!!localStorage.getItem("token"));
  const [mostrarCerrarSesion, setMostrarCerrarSesion] = useState(false);

  useEffect(() => {
    if (!logueado) return;

    let timeout;

    const cerrarPorInactividad = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Sesión cerrada por inactividad",
        text: "Han pasado 15 minutos sin actividad.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      setLogueado(false);
    };

    const reiniciarTemporizador = () => {
      clearTimeout(timeout);

      timeout = setTimeout(
        cerrarPorInactividad,
        15 * 60 * 10000, // Cambia a 10000 para probar (10 segundos)
      );
    };

    const eventos = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    eventos.forEach((evento) =>
      window.addEventListener(evento, reiniciarTemporizador),
    );

    reiniciarTemporizador();

    return () => {
      clearTimeout(timeout);

      eventos.forEach((evento) =>
        window.removeEventListener(evento, reiniciarTemporizador),
      );
    };
  }, [logueado]);

  const cerrarSesion = () => {
    setMostrarCerrarSesion(true);
  };

  const confirmarCerrarSesion = () => {
    setMostrarCerrarSesion(false);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Sesión cerrada correctamente",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      setLogueado(false);
    }, 1500);
  };

  if (!logueado) {
    return <Login onLogin={() => setLogueado(true)} />;
  }

  return (
    <>
      <Dashboard cerrarSesion={cerrarSesion} />

      <ConfirmModal
        show={mostrarCerrarSesion}
        titulo="Cerrar sesión"
        mensaje="Tu sesión actual se cerrará."
        icono={<FaSignOutAlt size={55} className="text-black" />}
        textoConfirmar="Cerrar sesión"
        textoCancelar="Cancelar"
        colorConfirmar="danger"
        onCancelar={() => setMostrarCerrarSesion(false)}
        onConfirmar={confirmarCerrarSesion}
      />
    </>
  );
}

export default App;
