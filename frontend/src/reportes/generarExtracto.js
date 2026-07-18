import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

// ===========================
// CARGAR LOGO
// ===========================

const cargarLogo = () => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src =
      window.location.origin + "/cb36ee16-a4e4-4336-b898-8e387c57db25.png";

    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

const generarExtracto = async (
  movimientos,
  mes,
  saldoTotal,
  todosMovimientos,
  usuario,
) => {
  const doc = new jsPDF();

  const logo = await cargarLogo();

  // ===========================
  // CÁLCULOS
  // ===========================

  const ingresos = movimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((total, m) => total + m.valor, 0);

  const egresos = movimientos
    .filter((m) => m.tipo === "egreso")
    .reduce((total, m) => total + m.valor, 0);

  const balance = ingresos - egresos;

  // ===========================
  // ENCABEZADO
  // ===========================

  // Logo
  doc.addImage(logo, "PNG", 15, 10, 22, 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  // Usuario
  doc.text(`USERNAME: ${usuario}`, 195, 18, {
    align: "right",
  });

  // Título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("FINCONTROL", 105, 20, {
    align: "center",
  });

  // Subtítulo
  doc.setFontSize(14);
  doc.text("EXTRACTO MENSUAL", 105, 30, {
    align: "center",
  });

  doc.setDrawColor(180);
  doc.line(15, 38, 195, 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(`Mes del reporte: ${mes}`, 15, 48);

  doc.text(
    `Fecha de generación: ${new Date().toLocaleString("es-CO")}`,
    15,
    56,
  );

  // ===========================
  // RESUMEN
  // ===========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Resumen", 20, 70);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(
    `Ingresos: ${ingresos.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    })}`,
    20,
    80,
  );

  doc.text(
    `Egresos: ${egresos.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    })}`,
    20,
    88,
  );

  doc.text(
    `Balance mes: ${balance.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    })}`,
    20,
    96,
  );

  doc.text(`Movimientos registrados: ${movimientos.length}`, 20, 104);

  doc.setFont("helvetica", "bold");

  doc.text(
    `Saldo total: ${saldoTotal.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    })}`,
    20,
    112,
  );

  doc.setFont("helvetica", "normal");

  const gastosPorCategoria = movimientos
    .filter((m) => m.tipo === "egreso")
    .reduce((acc, movimiento) => {
      const categoria = movimiento.categoria || "Otros";

      acc[categoria] = (acc[categoria] || 0) + movimiento.valor;

      return acc;
    }, {});

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Gastos", 120, 70);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  let yCategoria = 80;

  const categorias = Object.entries(gastosPorCategoria);

  if (categorias.length === 0) {
    doc.setTextColor(120);

    doc.text("No se registraron gastos en este mes.", 120, yCategoria);

    doc.setTextColor(0);
  } else {
    categorias.forEach(([categoria, valor]) => {
      doc.text(
        `${categoria}: ${valor.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
        })}`,
        120,
        yCategoria,
      );

      yCategoria += 8;
    });
  }

  // ===========================
  // TABLA
  // ===========================

  // Ordenar por fecha de creación (más antiguo -> más reciente)
  const movimientosOrdenados = [...movimientos].sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);

    if (fechaA.getTime() !== fechaB.getTime()) {
      return fechaA - fechaB;
    }

    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const primerDiaMes = `${mes}-01`;

  let saldo = todosMovimientos
    .filter((m) => m.fecha.substring(0, 10) < primerDiaMes)
    .reduce((total, movimiento) => {
      return movimiento.tipo === "ingreso"
        ? total + movimiento.valor
        : total - movimiento.valor;
    }, 0);

  const filas = [];

  for (const m of movimientosOrdenados) {
    saldo += m.tipo === "ingreso" ? m.valor : -m.valor;

    filas.push([
      m.fecha.substring(0, 10).split("-").reverse().join("/"),
      m.descripcion,
      m.tipo === "ingreso" ? "Ingreso" : "Egreso",
      (m.tipo === "ingreso" ? "+" : "-") +
        m.valor.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
        }),
      saldo.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }),
    ]);
  }

  filas.reverse();

  autoTable(doc, {
    startY: 123,

    head: [["Fecha", "Descripción", "Tipo", "Valor", "Saldo"]],

    body: filas,

    theme: "striped",

    headStyles: {
      fillColor: [33, 37, 41],
      halign: "center",
    },

    styles: {
      fontSize: 10,
      cellPadding: 3,
    },

    columnStyles: {
      0: { halign: "center", cellWidth: 28 },
      1: { cellWidth: 68 },
      2: { halign: "center", cellWidth: 25 },
      3: { halign: "right", cellWidth: 32 },
      4: { halign: "right", cellWidth: 37 },
    },
  });

  // ===========================
  // PIE
  // ===========================

  const ultimaY = doc.lastAutoTable.finalY + 15;

  doc.setDrawColor(180);
  doc.line(15, ultimaY, 195, ultimaY);

  doc.setFontSize(10);

  // ===========================
  // CÓDIGO QR
  // ===========================

  const qr = await QRCode.toDataURL(
    "https://control-gastos-git-master-juan-verdoorens-projects.vercel.app/",
  );

  // Texto
  doc.setFontSize(10);

  doc.text(
    "Documento generado automáticamente por FinControl",
    70,
    ultimaY + 10,
  );

  doc.text(
    "Escanee el código QR para acceder a la aplicación",
    70,
    ultimaY + 18,
  );

  // QR
  doc.addImage(qr, "PNG", 160, ultimaY + 2, 30, 30);

  // Guardar PDF
  doc.save(`Extracto_${mes}.pdf`);
};

export default generarExtracto;
