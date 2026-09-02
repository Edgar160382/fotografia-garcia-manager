"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Dashboard() {
   const [datos, setDatos] = useState({
  clientes: 0,
  entregas: 0,
  pendientes: 0,
  agendados: 0,
  edicion: 0,
  entregadas: 0,
  eventos: 0,
  anticipos: 0,
  saldos: 0,
totalPagos: 0,
liquidados: 0,
  vencidas: [],
  entregasHoy: [],
  proximos7Dias: [],
  futuras: [],
});


useEffect(() => {
  cargarDashboard();

  const intervalo = setInterval(() => {
    cargarDashboard();
  }, 30000);

  return () => clearInterval(intervalo);
}, []);

async function cargarDashboard() {
  try {
   const res = await fetch(`/api/dashboard?t=${Date.now()}`, {
  cache: "no-store",
});

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const data = await res.json();

    console.log("DASHBOARD:", data);

    setDatos(data);
  } catch (error) {
    console.error("Error cargando dashboard:", error);
  }

}
  return (
   <>
    <main
  style={{
    padding: "40px",
    background: "#f5f5f5",
    minHeight: "100vh",
  }}
>
       <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  }}
>
  <Link
    href="/Clientes"
    style={{
      display: "inline-block",
      background: "#1976d2",
      color: "white",
      padding: "10px 18px",
      borderRadius: "6px",
      textDecoration: "none",
    }}
  >
    👥 Clientes
  </Link>

  <Link
    href="/Agenda"
    style={{
      display: "inline-block",
      background: "#1976d2",
      color: "white",
      padding: "10px 18px",
      borderRadius: "6px",
      textDecoration: "none",
    }}
  >
    📅 Agenda
  </Link>

  <Link
  href="/Pagos"
  style={{
    display: "inline-block",
    background: "#2e7d32",
    color: "white",
    padding: "10px 18px",
    borderRadius: "6px",
    textDecoration: "none",
  }}
>
  💰 Pagos
</Link>

<Link
  href="/Calendario"
  style={{
    display: "inline-block",
    background: "#1976d2",
    color: "white",
    padding: "10px 18px",
    borderRadius: "6px",
    textDecoration: "none",
  }}
>
  📆 Calendario
</Link>

<Link
  href="/Entrega"
  style={{
    display: "inline-block",
    background: "#1976d2",
    color: "white",
    padding: "10px 18px",
    borderRadius: "6px",
    textDecoration: "none",
  }}
>
  📦 Entregas

  </Link>
</div>

      <h1
        style={{
          fontSize: "36px",
          marginBottom: "30px",
        }}
      >
        📸 Fotografía García Manager
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        <div className="form-card">
          <h2>👥 Clientes</h2>
         <h1>{datos.clientes}</h1>
        </div>

        <div className="form-card">
          <h2>📅 Eventos</h2>
          <h1>{datos.eventos}</h1>
        </div>

        <div className="form-card">
          <h2>💰 Anticipos</h2>
          <h1>${datos.anticipos}</h1>
        </div>

        <div className="form-card">
          <h2>💵 Saldo Pendiente</h2>
         <h1>${datos.saldos}</h1>
        </div>
        <div className="form-card">
  <h2>💚 Total Pagado</h2>
  <h1>${datos.totalPagos}</h1>
</div>
<div className="form-card">
  <h2>🟢 Liquidados</h2>
  <h1>{datos.liquidados}</h1>
</div>
      </div>
<div
  className="form-card"
 onClick={() => {
 window.location.href = "/Agenda?estado=Agendado";
}}
  style={{
    cursor: "pointer",
  }}
  >
  <div
  style={{
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "15px",
  }}
>
  <h2>🟣 Agendados</h2>
  <h1>{datos.agendados}</h1>
</div>
</div>

  <div
  className="form-card"
  onClick={() => {
  window.location.href = "/Agenda?estado=Pendiente%20de%20entrega";
  }}
  style={{
    cursor: "pointer",
  }}
>
  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      marginBottom: "15px",
    }}
  >
    <h2>🟡 Pendientes</h2>
    <h1>{datos.pendientes}</h1>
  </div>
</div>

<div
  className="form-card"
  onClick={() => {
   window.location.href = "/Agenda?estado=En%20edición";
  }}
  style={{
    cursor: "pointer",
  }}
>
  <h2>🔵 En edición</h2>
  <h1>{datos.edicion}</h1>
</div>

<div
  className="form-card"
  onClick={() => {
   window.location.href = "/Agenda?estado=Entregado";
  }}
  style={{
    cursor: "pointer",
  }}
>
  <h2>🟢 Entregadas</h2>
  <h1>{datos.entregadas}</h1>
</div>

    <div style={{ marginTop: "40px" }}>

  {/* 🔴 VENCIDAS */}
  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h2>🔴 Entregas Vencidas</h2>

    {datos.vencidas.length === 0 ? (
      <p>No hay entregas vencidas.</p>
    ) : (
      datos.vencidas.map((evento: any) => (
        <div
          key={evento.id}
          style={{
            marginBottom: "15px",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            background: "#fafafa",
          }}
        >
          <strong>{evento.cliente?.nombre}</strong>
          <br />
          📸 {evento.tipoTrabajo}
          <br />
          📅 Entrega:{" "}
          {new Date(evento.fechaEntrega).toLocaleDateString("es-MX")}
          <br />
          💰 {evento.saldo > 0
            ? `Pendiente: $${evento.saldo}`
            : "Liquidado"}
          <br />
          <strong style={{ color: "#dc2626" }}>
            🔴 VENCIDO
          </strong>
        </div>
      ))
    )}
  </div>

  {/* 🟠 HOY */}
  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h2>🟠 Entregas de Hoy</h2>

    {datos.entregasHoy.length === 0 ? (
      <p>No hay entregas para hoy.</p>
    ) : (
      datos.entregasHoy.map((evento: any) => (
        <div
          key={evento.id}
          style={{
            marginBottom: "15px",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            background: "#fafafa",
          }}
        >
          <strong>{evento.cliente?.nombre}</strong>
          <br />
          📸 {evento.tipoTrabajo}
          <br />
          💰 {evento.saldo > 0
            ? `Pendiente: $${evento.saldo}`
            : "Liquidado"}
          <br />
          <strong style={{ color: "#ea580c" }}>
            🟠 ENTREGA HOY
          </strong>
        </div>
      ))
    )}
  </div>

  {/* 🟡 PRÓXIMOS 7 DÍAS */}
  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h2>🟡 Próximos 7 Días</h2>

    {datos.proximos7Dias.length === 0 ? (
      <p>No hay entregas en los próximos 7 días.</p>
    ) : (
      datos.proximos7Dias.map((evento: any) => (
        <div
          key={evento.id}
          style={{
            marginBottom: "15px",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            background: "#fafafa",
          }}
        >
          <strong>{evento.cliente?.nombre}</strong>
          <br />
          📸 {evento.tipoTrabajo}
          <br />
          📅 Entrega:{" "}
          {new Date(evento.fechaEntrega).toLocaleDateString("es-MX")}
          <br />
          💰 {evento.saldo > 0
            ? `Pendiente: $${evento.saldo}`
            : "Liquidado"}
          <br />
          <strong style={{ color: "#ca8a04" }}>
            🟡 PRÓXIMA ENTREGA
          </strong>
        </div>
      ))
    )}
  </div>

  {/* 🟢 FUTURAS */}
  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h2>🟢 Entregas Futuras</h2>

    {datos.futuras.length === 0 ? (
      <p>No hay entregas futuras.</p>
    ) : (
      datos.futuras.map((evento: any) => (
        <div
          key={evento.id}
          style={{
            marginBottom: "15px",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            background: "#fafafa",
          }}
        >
          <strong>{evento.cliente?.nombre}</strong>
          <br />
          📸 {evento.tipoTrabajo}
          <br />
          📅 Entrega:{" "}
          {new Date(evento.fechaEntrega).toLocaleDateString("es-MX")}
          <br />
          💰 {evento.saldo > 0
            ? `Pendiente: $${evento.saldo}`
            : "Liquidado"}
          <br />
          <strong style={{ color: "#15803d" }}>
            🟢 ENTREGA FUTURA
          </strong>
        </div>
      ))
    )}
  </div>

</div>  
        </main>
      </>
    );
}