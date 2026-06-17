-- CreateTable
CREATE TABLE "notification_log" (
    "id" BIGSERIAL NOT NULL,
    "dedup_key" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notification_log_key_sent_idx" ON "notification_log"("dedup_key", "sent_at");
