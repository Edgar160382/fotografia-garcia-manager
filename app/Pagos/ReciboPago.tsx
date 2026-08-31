"use client";

type Props = {
  abierto: boolean;
  cerrar: () => void;
  cliente: any;
  pago: any;
  anticipo?: boolean;
};

export default function ReciboPago({
  abierto,
  cerrar,
  cliente,
  pago,
 anticipo,
}: Props) {
if (!abierto || !cliente || (!pago && !anticipo)) return null;

  const dinero = (valor: number) =>
    Number(valor || 0).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    });

  const totalPagado =
    Number(cliente.anticipo || 0) + Number(pago.cantidad || 0);

  return (
    <div
    className="recibo-overlay"
      style={{
       position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        padding: "20px",
      }}
    >
     <div
  id="recibo-pago"
  className="recibo-impresion"
        style={{
          background: "white",
          width: "100%",
          maxWidth: "500px",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,.25)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ marginBottom: "5px" }}>
            📸 FOTOGRAFÍA GARCÍA
          </h1>

          <h2 style={{ marginTop: "0" }}>
            RECIBO DE PAGO
          </h2>

          <hr />
        </div>

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
          <strong>Fecha:</strong>
          <br />
          {new Date(pago.fecha).toLocaleDateString("es-MX")}
        </p>

        <hr />

        <p>
          <strong>Total del trabajo:</strong>{" "}
          {dinero(cliente.total)}
        </p>

        <p>
          <strong>Anticipo:</strong>{" "}
          {dinero(cliente.anticipo)}
        </p>

        <p>
          <strong>Pago realizado:</strong>{" "}
         {dinero(pago?.cantidad ?? cliente.anticipo)}
        </p>

        <p>
          <strong>Total pagado:</strong>{" "}
          {dinero(totalPagado)}
        </p>

        <p>
          <strong>Saldo pendiente:</strong>{" "}
          <span
            style={{
              fontWeight: "bold",
              color:
                Number(pago.agenda?.saldo ?? cliente.saldo) > 0
                  ? "#dc2626"
                  : "#15803d",
            }}
          >
            {dinero(pago.agenda?.saldo ?? cliente.saldo)}
          </span>
        </p>

        <p>
          <strong>Método de pago:</strong>
          <br />
         {pago?.metodo ?? "Anticipo"}
        </p>

        {pago.observaciones && (
          <p>
            <strong>Observaciones:</strong>
            <br />
            {pago.observaciones}
          </p>
        )}

        <hr />

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          Gracias por su preferencia ❤️
        </p>

        <div
          className="no-print"
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            marginTop: "25px",
          }}
        >
         <button
  className="no-imprimir"
  onClick={cerrar}
            style={{
              background: "#777",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>

         <button
  className="no-imprimir"
  onClick={() => window.print()}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            🖨️ Imprimir recibo
          </button>
        </div>
      </div>
    </div>
  );
}