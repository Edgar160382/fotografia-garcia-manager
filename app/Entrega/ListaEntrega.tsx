"use client";

import { useEffect, useState } from "react";

type Props = {
  setEntregaEditar: any;
  recargarLista: number;
};

export default function ListaEntrega({
  setEntregaEditar,
  recargarLista,
}: Props) {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [buscar, setBuscar] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  useEffect(() => {
    async function cargarEntregas() {
      try {
        const respuesta = await fetch("/api/entregas");
        const datos = await respuesta.json();

        setEntregas(datos);
      } catch (error) {
        console.error("Error al cargar entregas:", error);
      }
    }

    cargarEntregas();
  }, [recargarLista]);

  async function eliminarEntrega(id: number) {
    if (!confirm("¿Eliminar esta entrega?")) return;

    const respuesta = await fetch(`/api/entregas?id=${id}`, {
      method: "DELETE",
    });

    if (respuesta.ok) {
      setEntregas((actuales) =>
        actuales.filter((e) => e.id !== id)
      );
    } else {
      alert("Error al eliminar la entrega");
    }
  }

  const entregasFiltradas = entregas.filter((entrega: any) => {
    const nombreCliente =
      entrega.cliente?.nombre?.toLowerCase() || "";

    const coincideNombre = nombreCliente.includes(
      buscar.toLowerCase()
    );

    const coincideEstado =
      estadoFiltro === "Todos" ||
      entrega.estado === estadoFiltro;

    return coincideNombre && coincideEstado;
  });

  function formatoFecha(fecha: string | null) {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-MX");
  }

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "10px",
        padding: "20px",
        width: "500px",
      }}
    >
      <h2>
        Lista de Entregas ({entregasFiltradas.length})
      </h2>

      <input
        type="text"
        placeholder="🔍 Buscar cliente..."
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "15px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <select
        value={estadoFiltro}
        onChange={(e) => setEstadoFiltro(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <option>Todos</option>
<option>Agendado</option>
<option>En edición</option>
<option>Pendiente de entrega</option>
<option>Entregado</option>
      </select>

      {entregasFiltradas.length === 0 ? (
        <p>No hay entregas que coincidan con la búsqueda.</p>
      ) : (
        entregasFiltradas.map((entrega: any) => (
          <div
            key={entrega.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              marginBottom: "15px",
              padding: "15px",
              background: "#fafafa",
            }}
          >
            <strong
              style={{
                fontSize: "20px",
              }}
            >
              👤 {entrega.cliente?.nombre}
            </strong>

            <hr
              style={{
                margin: "12px 0",
                border: "none",
                borderTop: "1px solid #ddd",
              }}
            />

            <p>
              📸 <strong>Trabajo:</strong>{" "}
              {entrega.tipoTrabajo}
            </p>

            <p>
              📅 <strong>Evento:</strong>{" "}
              {formatoFecha(entrega.fechaEvento)}
            </p>

            <p>
              📦 <strong>Entrega:</strong>{" "}
              {formatoFecha(entrega.fechaEntrega)}
            </p>

            <p>
              📌 <strong>Estado:</strong>{" "}
              <span
                style={{
                  color:
                    entrega.estado === "Pendiente"
                      ? "#f59e0b"
                      : entrega.estado === "En edición"
                      ? "#2563eb"
                      : "#16a34a",
                  fontWeight: "bold",
                }}
              >
                {entrega.estado === "Agendado" && "🟡 "}
              {entrega.estado === "En edición" && "🔵 "}
              {entrega.estado === "Pendiente de entrega" && "🟠 "}
              {entrega.estado === "Entregado" && "🟢 "}
              </span>
            </p>

            {entrega.observaciones && (
              <p>
                📝 <strong>Observaciones:</strong>{" "}
                {entrega.observaciones}
              </p>
            )}

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setEntregaEditar(entrega)}
                style={{
                  background: "#1976d2",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ✏️ Editar
              </button>

              <button
                onClick={() => eliminarEntrega(entrega.id)}
                style={{
                  background: "#d32f2f",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}