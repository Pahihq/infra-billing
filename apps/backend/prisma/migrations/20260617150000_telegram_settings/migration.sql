-- Telegram notification settings on the singleton settings row (token AES-GCM encrypted).
ALTER TABLE "settings" ADD COLUMN     "upcoming_billing_days" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "telegram_bot_token_enc" BYTEA,
ADD COLUMN     "telegram_chat_id" TEXT,
ADD COLUMN     "telegram_topic_id" TEXT;
