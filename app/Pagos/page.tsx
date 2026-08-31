"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RegistrarPago from "./RegistrarPago";
import ReciboPago from "./ReciboPago";

export default function Pagos() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [buscar, setBuscar] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<any>(null);

const [reciboAbierto, setReciboAbierto] = useState(false);
const [clienteRecibo, setClienteRecibo] = useState<any>(null);
const [pagoRecibo, setPagoRecibo] = useState<any>(null);

 useEffect(() => {
  cargarClientes();

  const intervalo = setInterval(() => {
    cargarClientes();
  }, 5000);

  return () => clearInterval(intervalo);
}, []);

  async function cargarClientes() {
    try {
     const res = await fetch(`/api/agenda?t=${Date.now()}`, {
  cache: "no-store",
});

      const data = await res.json();

      setClientes(data);
    } catch (error) {
      console.error("Error al cargar agenda:", error);
    }
  }

  const clientesFiltrados = clientes.filter((cliente: any) =>
    cliente.cliente?.nombre
      ?.toLowerCase()
      .includes(buscar.toLowerCase())
  );

  function abrirPago(cliente: any) {
    setClienteSeleccionado(cliente);
    setModalAbierto(true);
  }
async function abrirRecibo(cliente: any) {
  try {
    const res = await fetch(`/api/pagos?agendaId=${cliente.id}`);

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      alert("⚠️ Este trabajo todavía no tiene pagos registrados.");
      return;
    }

   const ultimoPago = data[0];

    setClienteRecibo(cliente);
    setPagoRecibo(ultimoPago);
    setReciboAbierto(true);
  } catch (error) {
    console.error("Error al cargar el recibo:", error);
    alert("Error al cargar el recibo.");
  }
}

  function cerrarPago() {
    setModalAbierto(false);
    setClienteSeleccionado(null);
  }

  function dinero(valor: number) {
    return Number(valor || 0).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    });
  }

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
        margin: "20px 0 0 40px",
      }}
    >
      ⬅️ Regresar al Dashboard
    </Link>
      <main
        style={{
          padding: "40px",
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <h1>💰 Control de Pagos</h1>

        <div
          style={{
            marginTop: "30px",
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2>
            Clientes con pagos ({clientesFiltrados.length})
          </h2>

          <input
            type="text"
            placeholder="🔍 Buscar cliente..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />

          {clientesFiltrados.length === 0 ? (
            <p>No se encontraron clientes.</p>
          ) : (
            clientesFiltrados.map((cliente: any) => (
              <div
                key={cliente.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "20px",
                  background: "#fafafa",
                }}
              >
                <strong
                  style={{
                    fontSize: "22px",
                  }}
                >
                  {cliente.cliente?.nombre}
                </strong>

                <hr
                  style={{
                    margin: "15px 0",
                    border: "none",
                    borderTop: "1px solid #ddd",
                  }}
                />

                <p>
                  📸 <strong>Trabajo:</strong>{" "}
                  {cliente.tipoTrabajo}
                </p>

                <p>
  📅 <strong>Evento:</strong>{" "}
  {new Date(
    cliente.fechaEvento
  ).toLocaleDateString("es-MX")}
</p>

<p>
  📦 <strong>Entrega:</strong>{" "}
  {cliente.fechaEntrega
    ? new Date(cliente.fechaEntrega).toLocaleDateString("es-MX")
    : "Sin fecha de entrega"}
</p>

<p>
  📍 <strong>Lugar:</strong>{" "}
  {cliente.lugar}
</p>

                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "white",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  <p>
                    💰 <strong>Total del trabajo:</strong>{" "}
                    {dinero(cliente.total)}
                  </p>

                  <p>
                    🟡 <strong>Anticipo:</strong>{" "}
                    {dinero(cliente.anticipo)}
                  </p>


                  <p>
                    💵 <strong>Saldo pendiente:</strong>{" "}
                    <span
                      style={{
                        color:
                          Number(cliente.saldo) > 0
                            ? "#d32f2f"
                            : "#2e7d32",
                        fontWeight: "bold",
                      }}
                    >
                      {dinero(cliente.saldo)}
                    </span>
                  </p>
                </div>
<div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  }}
>
  <button
    onClick={() => abrirPago(cliente)}
    style={{
      background: "#2e7d32",
      color: "white",
      border: "none",
      padding: "12px 22px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
    }}
  >
    💵 Registrar pago
  </button>

  <button
    onClick={() => abrirRecibo(cliente)}
    style={{
      background: "#1976d2",
      color: "white",
      border: "none",
      padding: "12px 22px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
    }}
  >
    🧾 Ver recibo
  </button>
</div>
               
              </div>
            ))
          )}
        </div>
      </main>

      <RegistrarPago
        abierto={modalAbierto}
        cerrar={cerrarPago}
        cliente={clienteSeleccionado}
      />
      <ReciboPago
  abierto={reciboAbierto}
  cerrar={() => {
    setReciboAbierto(false);
    setClienteRecibo(null);
    setPagoRecibo(null);
  }}
  cliente={clienteRecibo}
  pago={pagoRecibo}
/>
    </>
  );
}