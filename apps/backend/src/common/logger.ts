import { utilities as nestWinstonUtilities } from 'nest-winston';
import * as winston from 'winston';

// NestLike colorized console, same style in dev and prod (not JSON).
// Level: `debug` only when NODE_ENV=development, else `http` (prod is the default).
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
