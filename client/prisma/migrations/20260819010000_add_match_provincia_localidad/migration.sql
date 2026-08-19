-- AlterTable
ALTER TABLE "matches" ADD COLUMN "provincia" TEXT;
ALTER TABLE "matches" ADD COLUMN "localidad" TEXT;

-- CreateIndex
CREATE INDEX "matches_provincia_localidad_idx" ON "matches"("provincia", "localidad");
