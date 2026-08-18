-- AlterTable
ALTER TABLE "Agenda" ADD COLUMN     "fechaEntrega" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "agendaId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "metodo" TEXT NOT NULL,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
