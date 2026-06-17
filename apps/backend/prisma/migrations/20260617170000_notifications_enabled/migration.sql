-- Master on/off switch for notifications (independent of token presence).
ALTER TABLE "settings" ADD COLUMN "notifications_enabled" BOOLEAN NOT NULL DEFAULT true;
