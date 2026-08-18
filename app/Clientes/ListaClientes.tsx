"use client";

import { useEffect, useState } from "react";

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
async function eliminarCliente(id: number) {
  const confirmar = window.confirm("¿Deseas eliminar este cliente?");

  if (!confirmar) return;

  await fetch(`/api/clientes?id=${id}`, {
    method: "DELETE",
  });

  setClientes(clientes.filter((c: any) => c.id !== id));
}
  useEffect(() => {
    async function cargarClientes() {
      const respuesta = await fetch("/api/clientes");
      const datos = await respuesta.json();
      console.log(datos)
      setClientes(datos);
    }

    cargarClientes();
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Lista de Clientes</h2>

      {clientes.map((cliente: any) => (
        <div
          key={cliente.id}
          style={{
            border: "1px solid #555",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <strong>{cliente.nombre}</strong>
          <br />
          📞 {cliente.telefono}
          <br />
          👍 {cliente.facebook}
          <button
           onClick={() => eliminarCliente(cliente.id)}
  style={{
    marginTop: "10px",
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Eliminar
</button>

</div>
      ))}
    </div>
  );
}