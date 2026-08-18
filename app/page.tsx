"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [datos, setDatos] = useState({
    clientes: 0,
    entregas: 0,
    pendientes: 0,
    edicion: 0,
    entregadas: 0,
  });

  useEffect(() => {
    async function cargarDashboard() {
      const respuesta = await fetch("/api/dashboard");
      const info = await respuesta.json();
      setDatos(info);
    }

    cargarDashboard();
  }, []);

const cardStyle = {
  background: "white",
  borderRadius: "15px",
  padding: "25px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.10)",
  textAlign: "center" as const,
  };
  const numberStyle = {
  fontSize: "48px",
  fontWeight: "bold" as const,
  color: "#111827",
  margin: "15px 0",
};

const titleStyle = {
  fontSize: "20px",
  color: "#6b7280",
};
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      <aside
        style={{
          width: "250px",
          background: "#111827",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>📸 Fotografía García</h2>
        <hr />

        <p>🏠 Panel Principal</p>
        <p>👥 Clientes</p>
        <p>🗓️ Agenda</p>
        <p>📷 Sesiones</p>
        <p>💰 Pagos</p>
        <p>🖼️ Entregas</p>
        <p>⚙️ Configuración</p>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "40px",
          background: "#f5f5f5",
        }}
      >
      
         <h1
  style={{
    fontSize: "38px",
    marginBottom: "35px",
    color: "#111827",
  }}
>
  📸 Panel Principal
</h1>

<h2
  style={{
    color: "#111827",
    marginBottom: "25px",
  }}
>
  Resumen General
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  }}
>

 <div style={cardStyle}>
  <div style={titleStyle}>👥 Clientes</div>
  <div style={numberStyle}>{datos.clientes}</div>
</div>

 <div style={cardStyle}>
  <div style={titleStyle}>📦 Entregas</div>
  <div style={numberStyle}>{datos.entregas}</div>
</div> 

  <div style={cardStyle}>
  <div style={titleStyle}>⏳ Pendientes</div>
  <div style={numberStyle}>{datos.pendientes}</div>
</div>

 <div style={cardStyle}>
  <div style={titleStyle}>✏️ En edición</div>
  <div style={numberStyle}>{datos.edicion}</div>
</div>

 <div style={cardStyle}>
  <div style={titleStyle}>✅ Entregadas</div>
  <div style={numberStyle}>{datos.entregadas}</div>
</div> 

</div>
       
      </main>
    </div>
  );
}