import { utilities as nestWinstonUtilities } from 'nest-winston';
import * as winston from 'winston';

/**
 * Winston options for WinstonModule.forRoot — NestJS-like, colorized, human-readable
 * console output (same style in dev and prod; not JSON). Level is `debug` only when
 * NODE_ENV=development, `http` otherwise (production is the default).
 */
export function appLoggerOptions(): winston.LoggerOptions {
  const isProd = process.env.NODE_ENV !== 'development';
  return {
    level: isProd ? 'http' : 'debug',
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.align(),
      nestWinstonUtilities.format.nestLike('infra-billing', {
        colors: true,
        prettyPrint: true,
        processId: false,
        appName: true,
      }),
    ),
  };
}
