import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { nombre, telefono, facebook } = await req.json();

    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        telefono,
        facebook,
      },
    });

    return NextResponse.json(cliente);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al guardar cliente" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(clientes);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { error: "ID de cliente inválido" },
        { status: 400 }
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        agendas: true,
        entregas: true,
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    if (cliente.agendas.length > 0 || cliente.entregas.length > 0) {
      return NextResponse.json(
        {
          error:
            "⚠️ No se puede eliminar este cliente porque tiene trabajos o información asociada.",
        },
        { status: 400 }
      );
    }

    await prisma.cliente.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ERROR COMPLETO AL ELIMINAR:", error);

    return NextResponse.json(
      { error: "Error al eliminar cliente" },
      { status: 500 }
    );
  }
}