-- Optional SOCKS5 proxy for outgoing Telegram notifications (plain URL, may be empty).
ALTER TABLE "settings" ADD COLUMN "telegram_proxy_url" TEXT;
