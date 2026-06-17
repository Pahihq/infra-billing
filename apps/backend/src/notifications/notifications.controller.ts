import { Controller, HttpCode, Post } from '@nestjs/common';
import { API, API_SUB } from '@infra/shared';
import { NotificationsService } from './notifications.service';
import { TelegramService } from './telegram.service';

@Controller(API.NOTIFICATIONS)
export class NotificationsController {
  constructor(
    private readonly notifications: NotificationsService,
    private readonly telegram: TelegramService,
  ) {}

  /** Run the alert checks now (and report how many messages were sent). */
  @Post(API_SUB.NOTIFICATIONS_CHECK)
  @HttpCode(200)
  async check() {
    const sent = await this.notifications.checkAndNotify();
    return { enabled: await this.telegram.isEnabled(), sent };
  }

  /** Send a sample of every notification type (preview formats + verify Telegram config). */
  @Post(API_SUB.NOTIFICATIONS_TEST)
  @HttpCode(200)
  async test() {
    const sent = await this.notifications.sendSamples();
    return { enabled: await this.telegram.isEnabled(), sent };
  }
}
