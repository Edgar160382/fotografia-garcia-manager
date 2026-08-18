"use client";

import { useState } from "react";
import NuevaEntrega from "./NuevaEntrega";
import ListaEntrega from "./ListaEntrega";

export default function EntregasPage() {
  const [entregaEditar, setEntregaEditar] = useState<any>(null);
const [recargarLista, setRecargarLista] = useState(0);
  return (
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
  );
}