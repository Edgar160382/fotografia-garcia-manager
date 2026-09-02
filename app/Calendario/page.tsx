"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Calendario() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<any>(null);
const [modoEdicion, setModoEdicion] = useState(false);
  useEffect(() => {
    cargarEventos();
  }, []);

  async function cargarEventos() {
    const res = await fetch("/api/agenda");
    const data = await res.json();

    const eventosCalendario = data.map((evento: any) => ({
      id: evento.id.toString(),
      title: evento.tipoTrabajo,
      date: evento.fechaEvento.split("T")[0],

      extendedProps: {
        clienteId: evento.clienteId,
titulo: evento.titulo,
        cliente: evento.cliente?.nombre,
        lugar: evento.lugar,
        hora: evento.horaEvento,
        anticipo: evento.anticipo,
        saldo: evento.saldo,
        observaciones: evento.observaciones,
        estado: evento.estado,
      },
    }));

    setEventos(eventosCalendario);
  }
async function moverEvento(info: any) {
  const id = Number(info.event.id);
  const fecha = info.event.startStr;

  const res = await fetch("/api/agenda", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      fechaEvento: fecha,
    }),
  });

  if (res.ok) {
  cargarEventos();
} else {
  alert("❌ Error al actualizar");
  info.revert();
}
}
async function guardarCambios() {
  console.log(eventoSeleccionado);
  const res = await fetch("/api/agenda", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: eventoSeleccionado.id,
      titulo: eventoSeleccionado.title,
      tipoTrabajo: eventoSeleccionado.title,
      clienteId: eventoSeleccionado.clienteId,
      fechaEvento: eventoSeleccionado.start,
      horaEvento: eventoSeleccionado.hora,
      lugar: eventoSeleccionado.lugar,
      anticipo: eventoSeleccionado.anticipo,
      saldo: eventoSeleccionado.saldo,
      estado: eventoSeleccionado.estado,
      observaciones: eventoSeleccionado.observaciones,
    }),
  });

  if (res.ok) {
    alert("✅ Evento actualizado");

    setModoEdicion(false);
    setEventoSeleccionado(null);

    cargarEventos();
  } else {
    alert("❌ Error al actualizar");
  }
}
  return (
        <main
      style={{
        padding: "40px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Link
  href="/Dashboard"
  style={{
    display: "inline-block",
    background: "#1976d2",
    color: "white",
    padding: "10px 18px",
    borderRadius: "6px",
    textDecoration: "none",
    marginBottom: "25px",
  }}
>
  ⬅️ Dashboard
</Link>
      <h1 style={{ marginBottom: "30px" }}>
        📅 Calendario de Eventos
      </h1>

      <div className="form-card">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="es"
          height="auto"
          events={eventos}
          editable={true}
eventDrop={moverEvento}
          eventClick={(info) => {
            setEventoSeleccionado({
              title: info.event.title,
              id: info.event.id,
              start: info.event.start,
              ...info.event.extendedProps,
            });
          }}
        />
      </div>

      {eventoSeleccionado && (
        <div
          onClick={() => setEventoSeleccionado(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "520px",
              background: "#fff",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 10px 30px rgba(0,0,0,.25)",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>
  {modoEdicion ? "✏️ Editar Evento" : "📋 Información del Evento"}
</h2>

     {modoEdicion ? (
  <div style={{ marginBottom: "15px" }}>
    <strong>Trabajo:</strong>
    <input
      type="text"
      value={eventoSeleccionado.title}
      onChange={(e) =>
        setEventoSeleccionado({
          ...eventoSeleccionado,
          title: e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "8px",
        marginTop: "5px",
      }}
    />
  </div>
) : (
  <p><strong>Trabajo:</strong> {eventoSeleccionado.title}</p>
)}       

    {modoEdicion ? (
  <div style={{ marginBottom: "15px" }}>
    <strong>Cliente:</strong>
    <input
      type="text"
      value={eventoSeleccionado.cliente}
      onChange={(e) =>
        setEventoSeleccionado({
          ...eventoSeleccionado,
          cliente: e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "8px",
        marginTop: "5px",
      }}
    />
  </div>
) : (
  <p><strong>Cliente:</strong> {eventoSeleccionado.cliente}</p>
)}        

            <p>
              <strong>Fecha:</strong>{" "}
              {eventoSeleccionado.start?.toLocaleDateString()}
            </p>

           {modoEdicion ? (
  <div style={{ marginBottom: "15px" }}>
    <strong>Hora:</strong>
    <input
      type="time"
      value={eventoSeleccionado.hora || ""}
      onChange={(e) =>
        setEventoSeleccionado({
          ...eventoSeleccionado,
          hora: e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "8px",
        marginTop: "5px",
      }}
    />
  </div>
) : (
  <p><strong>Hora:</strong> {eventoSeleccionado.hora}</p>
)}

       {modoEdicion ? (
  <div style={{ marginBottom: "15px" }}>
    <strong>Lugar:</strong>
    <input
      type="text"
      value={eventoSeleccionado.lugar || ""}
      onChange={(e) =>
        setEventoSeleccionado({
          ...eventoSeleccionado,
          lugar: e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "8px",
        marginTop: "5px",
      }}
    />
  </div>
) : (
  <p><strong>Lugar:</strong> {eventoSeleccionado.lugar}</p>
)}     

      {modoEdicion ? (
  <div style={{ position: "relative" }}>
  <span
    style={{
      position: "absolute",
      left: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      fontWeight: "bold",
      color: "#555",
    }}
  >
    $
  </span>

  <input
    type="text"
    value={eventoSeleccionado.anticipo}
    onChange={(e) =>
      setEventoSeleccionado({
        ...eventoSeleccionado,
        anticipo: Number(e.target.value.replace(/\D/g, "")),
      })
    }
    style={{
      width: "100%",
      padding: "8px 8px 8px 28px",
      marginTop: "5px",
    }}
  />
</div>
) : (
  <p><strong>Anticipo:</strong> ${eventoSeleccionado.anticipo}</p>
)}     

          {modoEdicion ? (
  <div style={{ position: "relative" }}>
  <span
    style={{
      position: "absolute",
      left: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      fontWeight: "bold",
      color: "#555",
    }}
  >
    $
  </span>

  <input
    type="text"
    value={eventoSeleccionado.saldo}
    onChange={(e) =>
      setEventoSeleccionado({
        ...eventoSeleccionado,
        saldo: Number(e.target.value.replace(/\D/g, "")),
      })
    }
    style={{
      width: "100%",
      padding: "8px 8px 8px 28px",
      marginTop: "5px",
    }}
  />
</div>
) : (
  <p><strong>Saldo:</strong> ${eventoSeleccionado.saldo}</p>
)}  
            <p><strong>Estado:</strong> {eventoSeleccionado.estado}</p>

           {modoEdicion ? (
  <div style={{ marginBottom: "15px" }}>
    <strong>Observaciones:</strong>
    <textarea
      value={eventoSeleccionado.observaciones || ""}
      onChange={(e) =>
        setEventoSeleccionado({
          ...eventoSeleccionado,
          observaciones: e.target.value,
        })
      }
      rows={4}
      style={{
        width: "100%",
        padding: "8px",
        marginTop: "5px",
      }}
    />
  </div>
) : (
  <p>
    <strong>Observaciones:</strong>
    <br />
    {eventoSeleccionado.observaciones || "Sin observaciones"}
  </p>
)}

            <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  }}
>
  {!modoEdicion ? (
  <button
    onClick={() => {
      setModoEdicion(true);
    }}
    style={{
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    ✏️ Editar
  </button>
) : (
  <button
    onClick={guardarCambios}
    style={{
      background: "#16a34a",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    💾 Guardar
  </button>
)}

  <button
    onClick={() => setEventoSeleccionado(null)}
    style={{
      background: "#dc2626",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    Cerrar
  </button>
</div>
          </div>
        </div>
      )}
    </main>
  );
}