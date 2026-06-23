import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class NotificationResultDto extends createZodDto(
  z.object({ enabled: z.boolean(), sent: z.number().int() }),
) {}
