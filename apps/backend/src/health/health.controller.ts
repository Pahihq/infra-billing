import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { API, CONTROLLERS_INFO } from '@infra/shared';
import { Health } from '@infra/shared';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/public.decorator';
import { HealthDto } from './dto/health.dto';

@ApiTags(CONTROLLERS_INFO.HEALTH.TAG)
@Controller(API.HEALTH)
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ type: HealthDto })
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
