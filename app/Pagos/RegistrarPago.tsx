"use client";

import { useEffect, useState } from "react";

type Props = {
  abierto: boolean;
  cerrar: () => void;
  cliente: any;
};

export default function RegistrarPago({
  abierto,
  cerrar,
  cliente,
}: Props) {
  const [cantidad, setCantidad] = useState("");
  const [metodo, setMetodo] = useState("Efectivo");
  const [observaciones, setObservaciones] = useState("");
  const [pagos, setPagos] = useState<any[]>([]);

  useEffect(() => {
    if (abierto && cliente) {
      cargarPagos();
    }
  }, [abierto, cliente]);

  async function cargarPagos() {
    try {
      const res = await fetch(
        `/api/pagos?agendaId=${cliente.id}`
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setPagos(data);
      } else {
        setPagos([]);
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
      setPagos([]);
    }
  }

  if (!abierto || !cliente) return null;

 async function guardarPago() {
  const cantidadPago = Number(cantidad);

  if (!cantidad || cantidadPago <= 0) {
    alert("⚠️ Escribe una cantidad válida para el pago.");
    return;
  }

  if (Number(cliente.saldo || 0) <= 0) {
    alert("🟢 Este trabajo ya está liquidado.");
    return;
  }

  if (cantidadPago > Number(cliente.saldo || 0)) {
    alert(
      `⚠️ El pago no puede ser mayor al saldo pendiente de $${Number(
        cliente.saldo || 0
      ).toLocaleString("es-MX")}.`
    );
    return;
  }

  try {
      const res = await fetch("/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agendaId: cliente.id,
          cantidad,
          metodo,
          observaciones,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error);
        return;
      }

      const data = await res.json();

alert(
  `💰 Pago registrado correctamente\n\n` +
  `Pago: $${Number(cantidad).toLocaleString("es-MX")}\n` +
  `Saldo nuevo: $${Number(data.agenda.saldo).toLocaleString("es-MX")}`
);

setCantidad("");
setObservaciones("");

await cargarPagos();

cerrar();

location.reload();
    } catch (error) {
      console.error(error);
      alert("Error al registrar el pago");
    }
  }

  const totalPagos = pagos.reduce(
    (total, pago) => total + Number(pago.cantidad || 0),
    0
  );
const totalPagado =
  Number(cliente.anticipo || 0) + totalPagos;
async function eliminarPago(id: number) {
  const confirmar = confirm(
    "¿Seguro que quieres eliminar este pago?"
  );

  if (!confirmar) return;

  try {
    const res = await fetch(`/api/pagos?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al eliminar el pago");
      return;
    }

    alert(
      `🗑️ Pago eliminado correctamente\n\n` +
      `Saldo nuevo: $${Number(
        data.agenda.saldo
      ).toLocaleString("es-MX")}`
    );

    await cargarPagos();

    location.reload();
  } catch (error) {
    console.error(error);
    alert("Error al eliminar el pago");
  }
}
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          width: "450px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2>💰 Registrar pago</h2>

        <hr />

        <p>
          <strong>Cliente:</strong>
          <br />
          {cliente.cliente?.nombre}
        </p>

        <p>
          <strong>Trabajo:</strong>
          <br />
          {cliente.tipoTrabajo}
        </p>
<p>
  <strong>Saldo actual:</strong>
  <br />

  {Number(cliente.saldo || 0) <= 0 ? (
    <span
      style={{
        color: "#15803d",
        fontWeight: "bold",
        fontSize: "18px",
      }}
    >
      🟢 LIQUIDADO
    </span>
  ) : (
    <span
      style={{
        color: "#dc2626",
        fontWeight: "bold",
        fontSize: "18px",
      }}
    >
      ${Number(cliente.saldo || 0).toLocaleString("es-MX")}
    </span>
  )}
</p>
        
        <p>
  <strong>💵 Pagos posteriores:</strong>
  <br />
  ${totalPagos.toLocaleString("es-MX")}
</p>

<p>
  <strong>🟢 Total pagado:</strong>
  <br />
  ${totalPagado.toLocaleString("es-MX")}
</p>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          placeholder="Cantidad"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
          }}
        />

        <select
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
          }}
        >
          <option>Efectivo</option>
          <option>Transferencia</option>
          <option>Tarjeta</option>
        </select>

        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Observaciones"
          rows={4}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "10px",
          }}
        />

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={cerrar}
            style={{
              background: "#999",
              color: "white",
              border: "none",
              padding: "10px 25px",
              borderRadius: "8px",
            }}
          >
            Cancelar
          </button>

          <button
            onClick={guardarPago}
            style={{
              background: "#2e7d32",
              color: "white",
              border: "none",
              padding: "10px 25px",
              borderRadius: "8px",
            }}
          >
            Guardar pago
          </button>
        </div>

        <hr
          style={{
            marginTop: "30px",
            marginBottom: "20px",
          }}
        />

        <h3>📋 Historial de pagos</h3>

        {pagos.length === 0 ? (
          <p style={{ color: "#666" }}>
            No hay pagos registrados todavía.
          </p>
        ) : (
          <>
            {pagos.map((pago: any) => (
              <div
                key={pago.id}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "12px 0",
                }}
              >
                <strong>
                  $
                  {Number(pago.cantidad || 0).toLocaleString(
                    "es-MX"
                  )}
                </strong>

                <br />

                📅{" "}
                {new Date(pago.fecha).toLocaleDateString(
                  "es-MX"
                )}

                <br />

                💳 {pago.metodo}

                {pago.observaciones && (
                  <>
                    <br />
                    📝 {pago.observaciones}
                  </>
                )}
                <button
  onClick={() => eliminarPago(pago.id)}
  style={{
    marginTop: "8px",
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  🗑️ Eliminar
</button>
              </div>
            ))}

            <div
              style={{
                marginTop: "15px",
                padding: "15px",
                background: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <strong>
                Total de pagos registrados: $
                {totalPagos.toLocaleString("es-MX")}
              </strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}