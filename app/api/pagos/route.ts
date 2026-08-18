import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const agendaId = Number(searchParams.get("agendaId"));

    if (!agendaId) {
      return NextResponse.json(
        { error: "agendaId es obligatorio" },
        { status: 400 }
      );
    }

    const pagos = await prisma.pago.findMany({
      where: {
        agendaId,
      },
      orderBy: {
        fecha: "desc",
      },
    });

    return NextResponse.json(pagos);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al obtener pagos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  console.log("POST /api/pagos ejecutado");

  try {
    const {
      agendaId,
      cantidad,
      metodo,
      observaciones,
    } = await req.json();

    const cantidadPago = Number(cantidad);

    if (!agendaId || !cantidadPago || cantidadPago <= 0) {
      return NextResponse.json(
        { error: "La cantidad del pago no es válida" },
        { status: 400 }
      );
    }

    const agenda = await prisma.agenda.findUnique({
      where: {
        id: agendaId,
      },
    });

    if (!agenda) {
      return NextResponse.json(
        { error: "Agenda no encontrada" },
        { status: 404 }
      );
    }

    if (cantidadPago > agenda.saldo) {
      return NextResponse.json(
        { error: "El pago no puede ser mayor al saldo pendiente" },
        { status: 400 }
      );
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const pago = await tx.pago.create({
        data: {
          agendaId,
          cantidad: cantidadPago,
          metodo,
          observaciones,
        },
      });

      const nuevoSaldo = Math.max(
        0,
        agenda.saldo - cantidadPago
      );

      const agendaActualizada = await tx.agenda.update({
        where: {
          id: agendaId,
        },
        data: {
          saldo: nuevoSaldo,
        },
      });

      return {
        pago,
        agenda: agendaActualizada,
      };
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al registrar el pago" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const pagoId = Number(searchParams.get("id"));

    if (!pagoId) {
      return NextResponse.json(
        { error: "id del pago es obligatorio" },
        { status: 400 }
      );
    }

    const pago = await prisma.pago.findUnique({
      where: {
        id: pagoId,
      },
    });

    if (!pago) {
      return NextResponse.json(
        { error: "Pago no encontrado" },
        { status: 404 }
      );
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const pagoEliminado = await tx.pago.delete({
        where: {
          id: pagoId,
        },
      });

      const agenda = await tx.agenda.findUnique({
        where: {
          id: pago.agendaId,
        },
      });

      if (!agenda) {
        throw new Error("Agenda no encontrada");
      }

      const nuevoSaldo = agenda.saldo + pago.cantidad;

      const agendaActualizada = await tx.agenda.update({
        where: {
          id: pago.agendaId,
        },
        data: {
          saldo: nuevoSaldo,
        },
      });

      return {
        pago: pagoEliminado,
        agenda: agendaActualizada,
      };
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al eliminar el pago" },
      { status: 500 }
    );
  }
}
