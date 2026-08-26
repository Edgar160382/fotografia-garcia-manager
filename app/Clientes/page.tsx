"use client";

import Link from "next/link";
import NuevoCliente from "./NuevoCliente";
import ListaClientes from "./ListaClientes";

export default function Clientes() {
  return (
    <div style={{ padding: "40px" }}>
      <Link
        href="/Dashboard"
        style={{
          display: "inline-block",
          background: "#1976d2",
          color: "white",
          padding: "10px 18px",
          borderRadius: "6px",
          textDecoration: "none",
          marginBottom: "20px",
        }}
      >
        ⬅️ Dashboard
      </Link>

      <h1>👥 Clientes</h1>

      <p>Bienvenido al módulo de clientes.</p>

      <NuevoCliente />
      <ListaClientes />
    </div>
  );
}