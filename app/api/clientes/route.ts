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

    await prisma.cliente.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al eliminar cliente" },
      { status: 500 }
    );
  }
}