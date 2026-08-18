"use client";
import NuevoCliente from "./NuevoCliente";
import ListaClientes from "./ListaClientes";
export default function Clientes() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>👥 Clientes</h1>

      <p>Bienvenido al módulo de clientes.</p>

      <NuevoCliente />
       <ListaClientes />
    </div>
  );
}