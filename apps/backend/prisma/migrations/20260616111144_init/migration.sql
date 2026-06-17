-- CreateTable
CREATE TABLE "providers" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "favicon_link" TEXT,
    "login_url" TEXT,
    "credentials_enc" BYTEA,
    "balance" DECIMAL(14,2),
    "balance_currency" TEXT,
    "balance_synced_at" TIMESTAMP(3),
    "last_sync_at" TIMESTAMP(3),
    "last_sync_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "services" (
    "uuid" TEXT NOT NULL,
    "provider_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "external_id" TEXT,
    "country_code" TEXT DEFAULT 'XX',
    "cost" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "next_billing_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_managed" BOOLEAN NOT NULL DEFAULT false,
    "cost_overridden" BOOLEAN NOT NULL DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "payments" (
    "uuid" TEXT NOT NULL,
    "provider_uuid" TEXT NOT NULL,
    "service_uuid" TEXT,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "balance_snapshots" (
    "id" BIGSERIAL NOT NULL,
    "provider_uuid" TEXT NOT NULL,
    "balance" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "balance_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_runs" (
    "id" BIGSERIAL NOT NULL,
    "provider_uuid" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "services_found" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "sync_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "base" TEXT NOT NULL,
    "rate" DECIMAL(18,8) NOT NULL,
    "source" TEXT NOT NULL,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "base_currency" TEXT NOT NULL DEFAULT 'RUB',
    "sync_interval_hours" INTEGER NOT NULL DEFAULT 6,
    "rate_source" TEXT NOT NULL DEFAULT 'cbr',

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "services_provider_uuid_idx" ON "services"("provider_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "services_provider_external_id_key" ON "services"("provider_uuid", "external_id");

-- CreateIndex
CREATE INDEX "payments_provider_uuid_idx" ON "payments"("provider_uuid");

-- CreateIndex
CREATE INDEX "payments_service_uuid_idx" ON "payments"("service_uuid");

-- CreateIndex
CREATE INDEX "balance_snapshots_provider_captured_idx" ON "balance_snapshots"("provider_uuid", "captured_at");

-- CreateIndex
CREATE INDEX "sync_runs_provider_started_idx" ON "sync_runs"("provider_uuid", "started_at");

-- CreateIndex
CREATE INDEX "exchange_rates_code_base_captured_idx" ON "exchange_rates"("code", "base", "captured_at");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_provider_uuid_fkey" FOREIGN KEY ("provider_uuid") REFERENCES "providers"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_provider_uuid_fkey" FOREIGN KEY ("provider_uuid") REFERENCES "providers"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_service_uuid_fkey" FOREIGN KEY ("service_uuid") REFERENCES "services"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balance_snapshots" ADD CONSTRAINT "balance_snapshots_provider_uuid_fkey" FOREIGN KEY ("provider_uuid") REFERENCES "providers"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_runs" ADD CONSTRAINT "sync_runs_provider_uuid_fkey" FOREIGN KEY ("provider_uuid") REFERENCES "providers"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
