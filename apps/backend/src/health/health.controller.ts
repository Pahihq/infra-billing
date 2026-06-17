import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { API } from '@infra/shared';
import { Health } from '@infra/shared';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/public.decorator';

@Controller(API.HEALTH)
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  async health(): Promise<Health> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      // Surfaced as HTTP 503 → the Docker healthcheck marks the container unhealthy.
      throw new ServiceUnavailableException({ status: 'error', db: 'down' });
    }
    return { status: 'ok', db: 'up' };
  }
}
