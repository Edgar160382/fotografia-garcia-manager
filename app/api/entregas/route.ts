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

// ===============================
// OBTENER ENTREGAS
// ===============================
export async function GET() {
  try {
    const entregas = await prisma.agenda.findMany({
      include: {
        cliente: true,
      },
      orderBy: {
        fechaEntrega: "asc",
      },
    });

    return NextResponse.json(entregas);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al obtener entregas" },
      { status: 500 }
    );
  }
}

// ===============================
// CREAR ENTREGA
// ===============================
export async function POST(req: Request) {
  try {
    const {
      clienteId,
      tipoTrabajo,
      fechaEvento,
      fechaEntrega,
      estado,
      observaciones,
    } = await req.json();

    if (!clienteId || !tipoTrabajo || !fechaEvento || !fechaEntrega) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const entrega = await prisma.agenda.create({
      data: {
        clienteId: Number(clienteId),
        titulo: tipoTrabajo,
        tipoTrabajo,
        fechaEvento: new Date(fechaEvento),
        fechaEntrega: new Date(fechaEntrega),
        horaEvento: "",
        lugar: "",
        estado: estado || "Agendado",
        observaciones: observaciones || null,

      },
      include: {
        cliente: true,
      },
    });

    return NextResponse.json(entrega);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al guardar entrega" },
      { status: 500 }
    );
  }
}

// ===============================
// ACTUALIZAR ENTREGA
// ===============================
export async function PUT(req: Request) {
  try {
    const {
      id,
      clienteId,
      tipoTrabajo,
      fechaEvento,
      fechaEntrega,
      estado,
      observaciones,
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "El ID de la agenda es obligatorio" },
        { status: 400 }
      );
    }

    const entrega = await prisma.agenda.update({
      where: {
        id: Number(id),
      },
      data: {
        clienteId: Number(clienteId),
        tipoTrabajo,
        fechaEvento: new Date(fechaEvento),
        fechaEntrega: new Date(fechaEntrega),
        estado,
        observaciones: observaciones || null,
      },
      include: {
        cliente: true,
      },
    });

    return NextResponse.json(entrega);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al actualizar la entrega" },
      { status: 500 }
    );
  }
}

// ===============================
// ELIMINAR ENTREGA
// ===============================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { error: "ID obligatorio" },
        { status: 400 }
      );
    }

    await prisma.agenda.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      mensaje: "Entrega eliminada correctamente",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al eliminar la entrega" },
      { status: 500 }
    );
  }
}