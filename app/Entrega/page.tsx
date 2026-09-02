"use client";

import { useState } from "react";
import NuevaEntrega from "./NuevaEntrega";
import ListaEntrega from "./ListaEntrega";
import Link from "next/link";
export default function EntregasPage() {
  const [entregaEditar, setEntregaEditar] = useState<any>(null);
const [recargarLista, setRecargarLista] = useState(0);
 return (
  <>
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

    <div
      style={{
        display: "flex",
        gap: "30px",
        alignItems: "flex-start",
      }}
    >
      <NuevaEntrega
        entregaEditar={entregaEditar}
        setEntregaEditar={setEntregaEditar}
        recargar={() => setRecargarLista((v) => v + 1)}
      />

      <ListaEntrega
        setEntregaEditar={setEntregaEditar}
        recargarLista={recargarLista}
      />
    </div>
  </>
);
}