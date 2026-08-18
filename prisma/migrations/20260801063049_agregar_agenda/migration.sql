-- CreateTable
CREATE TABLE "Agenda" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipoTrabajo" TEXT NOT NULL,
    "fechaEvento" TIMESTAMP(3) NOT NULL,
    "horaEvento" TEXT NOT NULL,
    "lugar" TEXT NOT NULL,
    "anticipo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'Agendado',
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
