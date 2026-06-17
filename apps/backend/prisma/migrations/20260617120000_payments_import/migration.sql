-- AlterTable: payment type (topup/charge) + provider record id for sync dedup
ALTER TABLE "payments" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'topup',
ADD COLUMN     "external_id" TEXT;

-- CreateIndex: dedup imported payments per (provider, external_id)
CREATE UNIQUE INDEX "payments_provider_external_id_key" ON "payments"("provider_uuid", "external_id");
