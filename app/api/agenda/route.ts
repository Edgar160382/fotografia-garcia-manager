import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ======================
// LISTAR EVENTOS
// ======================
export async function GET() {
  try {
    const agenda = await prisma.agenda.findMany({
      include: {
        cliente: true,
      },
      orderBy: {
  fechaEntrega: "asc",
      },
    });

    return NextResponse.json(agenda);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener la agenda" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
console.log("BODY:", body);
    const agenda = await prisma.agenda.create({
      data: {
        tipoTrabajo: body.tipoTrabajo,
        titulo: body.titulo,
        fechaEvento: new Date(body.fechaEvento),

        fechaEntrega: body.fechaEntrega
          ? new Date(body.fechaEntrega)
          : null,

        horaEvento: body.horaEvento,
        lugar: body.lugar,
        total: Number(body.total),
        anticipo: Number(body.anticipo),
        saldo: Number(body.saldo),
        estado: body.estado,
        observaciones: body.observaciones,

        cliente: {
          connect: {
            id: Number(body.clienteId),
          },
        },
      },
      include: {
        cliente: true,
      },
    });

    return NextResponse.json(agenda);

 
  } catch (error: any) {
  console.error("ERROR POST COMPLETO:");
  console.error(error);
  console.error(error.message);

  return NextResponse.json(
    {
      error: error.message,
    },
    { status: 500 }
  );
}
}
// ======================
// CREAR EVENTO
// ======================
export async function PUT(req: Request) {
  try {
    const body = await req.json();
console.log("BODY:", body);
console.log("CLIENTE:", body.clienteId);
    const agenda = await prisma.agenda.update({
      where: {
        id: Number(body.id),
      },
      data: {
  tipoTrabajo: body.tipoTrabajo,
  fechaEvento: new Date(body.fechaEvento),
  fechaEntrega: body.fechaEntrega
  ? new Date(body.fechaEntrega)
  : null,
  horaEvento: body.horaEvento,
  lugar: body.lugar,
  total: Number(body.total),
  anticipo: Number(body.anticipo),
  saldo: Number(body.saldo),
  estado: body.estado,
  observaciones: body.observaciones,

  cliente: {
    connect: {
      id: Number(body.clienteId),
    },
  },
},
});

    return NextResponse.json(agenda);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al actualizar fecha" },
      { status: 500 }
    );
  }
}
// ======================
// ELIMINAR EVENTO
// ======================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = Number(searchParams.get("id"));

    await prisma.agenda.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      mensaje: "Evento eliminado",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al eliminar evento" },
      { status: 500 }
    );
  }
}

