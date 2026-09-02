"use client";
import { useEffect, useState } from "react";
export default function Agenda() {
   const [clientes, setClientes] = useState<any[]>([]);
const [agenda, setAgenda] = useState<any[]>([]);

const [clienteId, setClienteId] = useState("");
const [tipoTrabajo, setTipoTrabajo] = useState("");
const [fechaEvento, setFechaEvento] = useState("");
const [fechaEntrega, setFechaEntrega] = useState("");
const [horaEvento, setHoraEvento] = useState("");
const [lugar, setLugar] = useState("");
const [total, setTotal] = useState("");
const [anticipo, setAnticipo] = useState("");
const [saldo, setSaldo] = useState("");
const [observaciones, setObservaciones] = useState("");

const [estado, setEstado] = useState("Agendado");

const [eventoEditando, setEventoEditando] = useState<number | null>(null);


useEffect(() => {
  fetch("/api/clientes")
    .then((res) => res.json())
    .then((data) => {
      console.log("CLIENTES:", data);
      setClientes(data);
    });
}, []);

useEffect(() => {
  cargarAgenda();
}, []);

async function cargarAgenda() {
  const res = await fetch("/api/agenda");

  const data = await res.json();

  console.log("AGENDA:", data);

  if (Array.isArray(data)) {
    const params = new URLSearchParams(window.location.search);
    const estado = params.get("estado");

    if (estado) {
      const filtrada = data.filter(
        (evento: any) => evento.estado === estado
      );

      setAgenda(filtrada);
    } else {
      setAgenda(data);
    }
  } else {
    console.error("La API no devolvió un arreglo:", data);
    setAgenda([]);
  }
}
async function guardarEvento() {
    const url = eventoEditando
    ? `/api/agenda?id=${eventoEditando}`
    : "/api/agenda";

  const metodo = eventoEditando
    ? "PUT"
    : "POST";

console.log("eventoEditando:", eventoEditando);
console.log("url:", url);
console.log("metodo:", metodo);

  const respuesta = await fetch(url, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
    },
   body: JSON.stringify({
  id: eventoEditando,
  clienteId,
  titulo: tipoTrabajo,
  tipoTrabajo,
  fechaEvento,
  fechaEntrega,
  horaEvento,
  lugar,
  total,
  anticipo,
  saldo,
  estado,
  observaciones,
}),
  });

  const data = await respuesta.json();

  console.log(data);

  cargarAgenda();

  setClienteId("");
  setTipoTrabajo("");
  setFechaEvento("");
  setFechaEntrega("");
  setHoraEvento("");
  setLugar("");
  setTotal("");
  setAnticipo("");
  setSaldo("");
  setObservaciones("");
  setEventoEditando(null);
}
async function eliminarEvento(id: number) {
  const confirmar = confirm("¿Deseas eliminar este evento?");

  if (!confirmar) return;

  await fetch(`/api/agenda?id=${id}`, {
    method: "DELETE",
  });

  cargarAgenda();
  }
 function editarEvento(evento: any) {
  console.log("EDITAR", evento);

  setEventoEditando(evento.id);

  setEstado(evento.estado ?? "Agendado");

  setClienteId(evento.clienteId.toString());

  setTipoTrabajo(evento.tipoTrabajo ?? "");

  setFechaEvento(
    evento.fechaEvento
      ? evento.fechaEvento.split("T")[0]
      : ""
  );

  setFechaEntrega(
    evento.fechaEntrega
      ? evento.fechaEntrega.split("T")[0]
      : ""
  );

  setHoraEvento(evento.horaEvento ?? "");

  setLugar(evento.lugar ?? "");

  setTotal(
    evento.total !== null && evento.total !== undefined
      ? evento.total.toString()
      : ""
  );

  setAnticipo(
    evento.anticipo !== null && evento.anticipo !== undefined
      ? evento.anticipo.toString()
      : ""
  );

  setSaldo(
    evento.saldo !== null && evento.saldo !== undefined
      ? evento.saldo.toString()
      : ""
  );

   setObservaciones(evento.observaciones ?? "");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

}
 return (
  <main
    style={{
      padding: "40px",
      background: "#f5f5f5",
      minHeight: "100vh",
    }}
  >
 <button
  onClick={() => {
    window.location.href = "/Dashboard";
  }}
  style={{
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    marginBottom: "20px",
  }}
>
  ⬅️ Dashboard
</button>
  
      <h1
        style={{
          fontSize: "38px",
          color: "#111827",
          marginBottom: "30px",
        }}
      >
        📅 Agenda
      </h1>

     <div className="form-card">
    
        <h2 style={{ marginBottom: "20px" }}>
          Nuevo Evento
        </h2>

    <div className="form-grid">

  <select
    className="form-select"
    value={clienteId}
    onChange={(e) => setClienteId(e.target.value)}
  >
    <option value="">Selecciona un cliente</option>

    {clientes.map((cliente) => (
      <option
        key={cliente.id}
        value={cliente.id}
      >
        {cliente.nombre}
      </option>
    ))}
  </select>

  <input
  className="form-input"
  placeholder="Tipo de trabajo"
  value={tipoTrabajo}
  onChange={(e) => setTipoTrabajo(e.target.value)}
  />

  <input
  className="form-input"
  type="date"
  value={fechaEvento}
  onChange={(e) => setFechaEvento(e.target.value)}
/>
<input
  className="form-input"
  type="date"
  value={fechaEntrega}
  onChange={(e) => setFechaEntrega(e.target.value)}
/>
 <input
  className="form-input"
  type="time"
  value={horaEvento}
  onChange={(e) => setHoraEvento(e.target.value)}
/>

 <input
  className="form-input"
  placeholder="Lugar"
  value={lugar}
  onChange={(e) => setLugar(e.target.value)}
/>
<div style={{ position: "relative" }}>
  <span
    style={{
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#666",
      fontWeight: "bold",
    }}
  >
    $
  </span>

  <input
    className="form-input"
    type="number"
    placeholder="Total del trabajo"
    value={total}
    onChange={(e) => {
      const valor = e.target.value;
      setTotal(valor);

      const nuevoSaldo =
        Number(valor || 0) - Number(anticipo || 0);

      setSaldo(String(Math.max(0, nuevoSaldo)));
    }}
    style={{ paddingLeft: "28px" }}
  />
</div>
<div style={{ position: "relative" }}>
  <span
    style={{
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#666",
      fontWeight: "bold",
    }}
  >
    $
  </span>

  <input
    className="form-input"
    placeholder="Anticipo"
    value={anticipo}
    onChange={(e) => {
    const valor = e.target.value;
    setAnticipo(valor);

    const nuevoSaldo =
      Number(total || 0) - Number(valor || 0);

    setSaldo(String(Math.max(0, nuevoSaldo)));
  }}
    style={{ paddingLeft: "28px" }}
  />
</div>

 <div style={{ position: "relative" }}>
  <span
    style={{
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#666",
      fontWeight: "bold",
    }}
  >
    $
  </span>

  <input
    className="form-input"
    placeholder="Saldo"
    value={saldo}
    onChange={(e) => setSaldo(e.target.value)}
    style={{ paddingLeft: "28px" }}
  />
</div>

 <input
  className="form-input"
  placeholder="Observaciones"
  value={observaciones}
  onChange={(e) => setObservaciones(e.target.value)}
/>
<select
  className="form-select"
  value={estado}
  onChange={(e) => setEstado(e.target.value)}
>
  <option value="Agendado">🟣 Agendado</option>
  <option value="Pendiente de entrega">🟡 Pendiente de entrega</option>
  <option value="En edición">🔵 En edición</option>
  <option value="Entregado">🟢 Entregado</option>
</select>
</div>

        <button
           onClick={guardarEvento}
          style={{
            marginTop: "25px",
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "14px 30px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {eventoEditando ? "Actualizar Evento" : "Guardar Evento"}
        </button>

 </div>

       <div
  className="form-card"
  style={{ marginTop: "40px" }}
>
  <h2 className="section-title">
    Eventos Agendados
  </h2>
<div style={{ overflowX: "auto", width: "100%" }}>

  <table
   className="agenda-table"
    style={{
      width: "100%",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr
        style={{
          background: "#2563eb",
          color: "white",
        }}
      >
        <th style={{ padding: "12px" }}>Cliente</th>
        <th>Trabajo</th>
        <th>Fecha</th>
        <th>Hora</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>

    <tbody>
      {agenda.map((evento) => (
        <tr
          key={evento.id}
          style={{
            textAlign: "center",
            borderBottom: "1px solid #ddd",
          }}
        >
          <td style={{ padding: "10px" }}>
            {evento.cliente.nombre}
          </td>

          <td>{evento.tipoTrabajo}</td>

          <td>
  {evento.fechaEvento.split("T")[0].split("-").reverse().join("/")}
</td>

          <td>{evento.horaEvento}</td>

          <td>{evento.estado}</td>
          <td>
  <button
    onClick={() => editarEvento(evento)}
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      marginRight: "8px",
    }}
  >
    ✏️ Editar
  </button>

  <button
    onClick={() => eliminarEvento(evento.id)}
    style={{
      background: "#dc2626",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    🗑 Eliminar
  </button>
</td>
        </tr>
      ))}
    </tbody>
</table>

</div>

</div>

</main>
);
}