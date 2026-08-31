"use client";

import { useEffect, useState } from "react";

export default function ListaClientes() {
  const [clientes, setClientes] = useState<any[]>([]);
async function eliminarCliente(id: number) {
  const confirmar = window.confirm("¿Deseas eliminar este cliente?");

  if (!confirmar) return;

  try {
    const respuesta = await fetch(`/api/clientes?id=${id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) {
      const datos = await respuesta.json();

      alert(
        datos.error ||
          "⚠️ No se puede eliminar este cliente porque tiene información asociada."
      );

      return;
    }

    setClientes((clientes: any[]) =>
      clientes.filter((c: any) => c.id !== id)
    );

    alert("✅ Cliente eliminado correctamente.");
  } catch (error) {
    console.error(error);
    alert("❌ No se pudo eliminar el cliente.");
  }
}
  useEffect(() => {
  async function cargarClientes() {
    try {
      const respuesta = await fetch("/api/clientes");
      const datos = await respuesta.json();

      if (Array.isArray(datos)) {
        setClientes(datos);
      }
    } catch (error) {
      console.error("Error al actualizar clientes:", error);
    }
  }

  cargarClientes();

  const intervalo = setInterval(cargarClientes, 3000);

  return () => clearInterval(intervalo);
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