"use client";

import { useState } from "react";

export default function NuevoCliente() {

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [facebook, setFacebook] = useState("");
async function guardarCliente() {
  const respuesta = await fetch("/api/clientes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      telefono,
      facebook,
    }),
  });

  if (respuesta.ok) {
    alert("Cliente guardado correctamente");
    setNombre("");
    setTelefono("");
    setFacebook("");
    window.location.reload();
  } else {
    alert("Error al guardar el cliente");
  }
}   // ← esta llave cierra guardarCliente

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "20px",
        border: "1px solid #444",
        borderRadius: "10px",
        width: "400px",
      }}
    >
      <h2>Nuevo Cliente</h2>

     <input
  type="text"
  placeholder="Nombre completo"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
/>

     <input
  type="text"
  placeholder="Teléfono"
  value={telefono}
  onChange={(e) => setTelefono(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
/>

   <input
  type="text"
  placeholder="Facebook"
  value={facebook}
  onChange={(e) => setFacebook(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
/>

    <button
  onClick={guardarCliente}
  style={{
    background: "#22c55e",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Guardar Cliente
</button>
    </div>
  );
}