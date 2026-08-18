"use client";

import { useEffect, useState } from "react";

type Props = {
  entregaEditar: any;
  setEntregaEditar: any;
   recargar: () => void;
};

export default function NuevaEntrega({
  entregaEditar,
  setEntregaEditar,
   recargar,
}: Props) {
  const [clientes, setClientes] = useState<any[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [tipoTrabajo, setTipoTrabajo] = useState("");
  const [fechaEvento, setFechaEvento] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [observaciones, setObservaciones] = useState("");
const [editandoId, setEditandoId] = useState<number | null>(null);
  useEffect(() => {
  async function cargarClientes() {
     const respuesta = await fetch("/api/clientes");
    const datos = await respuesta.json();
    console.log(datos);
   setClientes(datos);
  }

  cargarClientes();
}, []);
useEffect(() => {
  if (!entregaEditar) return;

  setClienteId(String(entregaEditar.clienteId));
  setTipoTrabajo(entregaEditar.tipoTrabajo);
  setFechaEvento(entregaEditar.fechaEvento.slice(0, 10));
  setFechaEntrega(entregaEditar.fechaEntrega.slice(0, 10));
  setEstado(entregaEditar.estado);
  setObservaciones(entregaEditar.observaciones || "");
  setEditandoId(entregaEditar.id);
}, [entregaEditar]);

  async function guardarEntrega() {
    const respuesta = await fetch("/api/entregas", {
  method: editandoId ? "PUT" : "POST",
      
      headers: {
        "Content-Type": "application/json",
      },
     body: JSON.stringify({
  id: editandoId,
  clienteId: Number(clienteId),
  tipoTrabajo,
  fechaEvento,
  fechaEntrega,
  estado,
  observaciones,
}),
});
    if (respuesta.ok) {
     alert(
  editandoId
    ? "Entrega actualizada correctamente"
    : "Entrega guardada correctamente"
);

      setClienteId("");
      setTipoTrabajo("");
      setFechaEvento("");
      setFechaEntrega("");
      setEstado("Pendiente");
      setObservaciones("");
      setEditandoId(null);
      setEntregaEditar(null);
      recargar();
    } else {
      alert("Error al guardar la entrega");
    }
  }
console.log(clientes);
  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "10px",
        padding: "20px",
        width: "500px",
      }}
    >
      <h2>Nueva Entrega</h2>

      <select
        value={clienteId}
        onChange={(e) => setClienteId(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      >
       <option value="">▼ Selecciona un cliente ▼</option> 
{clientes.map((cliente: any) => {
  console.log(cliente);

  return (
    <option key={cliente.id} value={cliente.id}>
      {cliente.nombre}
    </option>
  );
})}
      </select>

      <input
        type="text"
        placeholder="Tipo de trabajo"
        value={tipoTrabajo}
        onChange={(e) => setTipoTrabajo(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <label>Fecha del evento</label>

      <input
        type="date"
        value={fechaEvento}
        onChange={(e) => setFechaEvento(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <label>Fecha de entrega</label>

      <input
        type="date"
        value={fechaEntrega}
        onChange={(e) => setFechaEntrega(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

     <select
  value={estado}
  onChange={(e) => setEstado(e.target.value)}
  style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
>
  <option>Agendado</option>
  <option>En edición</option>
  <option>Pendiente de entrega</option>
  <option>Entregado</option>
</select>

      <textarea
        placeholder="Observaciones"
        value={observaciones}
        onChange={(e) => setObservaciones(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={guardarEntrega}
        style={{
          background: "#22c55e",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Guardar Entrega
      </button>
    </div>
  );
}