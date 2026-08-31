import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

export async function GET() {
  try {
    const clientes = await prisma.cliente.count();

   const entregas = await prisma.agenda.count();

const pendientes = await prisma.agenda.count({
  where: {
    estado: "Pendiente de entrega",
  },
});

const agendados = await prisma.agenda.count({
  where: {
    estado: "Agendado",
  },
});

const edicion = await prisma.agenda.count({
  where: {
    estado: "En edición",
  },
});

const entregadas = await prisma.agenda.count({
  where: {
    estado: "Entregado",
  },
});
const eventos = await prisma.agenda.count();

const agenda = await prisma.agenda.findMany({
  include: {
    cliente: true,
  },
  orderBy: {
    fechaEntrega: "asc",
  },
});

const anticipos = agenda.reduce(
  (total, evento) => total + Number(evento.anticipo),
  0
);

const saldos = agenda.reduce(
  (total, evento) => total + Number(evento.saldo),
  0
);
const liquidados = await prisma.agenda.count({
  where: {
    saldo: 0,
  },
});
const pagos = await prisma.pago.findMany();

const totalPagosPosteriores = pagos.reduce(
  (total, pago) => total + Number(pago.cantidad || 0),
  0
);

const totalPagos = anticipos + totalPagosPosteriores;
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

const vencidas = agenda.filter((evento) => {
  if (!evento.fechaEntrega) return false;

  const entrega = new Date(evento.fechaEntrega);
  entrega.setHours(0, 0, 0, 0);

  return entrega < hoy;
});

const entregasHoy = agenda.filter((evento) => {
  if (!evento.fechaEntrega) return false;

  const entrega = new Date(evento.fechaEntrega);
  entrega.setHours(0, 0, 0, 0);

  return entrega.getTime() === hoy.getTime();
});

const proximos7Dias = agenda.filter((evento) => {
  if (!evento.fechaEntrega) return false;

  const entrega = new Date(evento.fechaEntrega);
  entrega.setHours(0, 0, 0, 0);

  const diferencia =
    (entrega.getTime() - hoy.getTime()) /
    (1000 * 60 * 60 * 24);

  return diferencia > 0 && diferencia <= 7;
});

const futuras = agenda.filter((evento) => {
  if (!evento.fechaEntrega) return false;

  const entrega = new Date(evento.fechaEntrega);
  entrega.setHours(0, 0, 0, 0);

  const diferencia =
    (entrega.getTime() - hoy.getTime()) /
    (1000 * 60 * 60 * 24);

  return diferencia > 7;
});
  return NextResponse.json({
  clientes,
  entregas,
  pendientes,
  agendados,
  edicion,
  entregadas,
  eventos,
  anticipos,
  saldos,
totalPagos,
liquidados,
  vencidas,
  entregasHoy,
  proximos7Dias,
  futuras,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al cargar dashboard" },
      { status: 500 }
    );
  }
}