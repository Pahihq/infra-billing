import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { envSchema, type Env } from './env.schema';

/** Typed, validated access to environment configuration. */
@Injectable()
export class AppConfigService {
  readonly env: Env;

  constructor() {
    this.env = envSchema.parse(process.env);
  }

  get isProd(): boolean {
    return this.env.NODE_ENV === 'production';
  }

  get port(): number {
    return this.env.PORT;
  }

  get adminUsername(): string {
    return this.env.ADMIN_USERNAME;
  }

  get adminPassword(): string {
    return this.env.ADMIN_PASSWORD;
  }

  /**
   * Secret for signing the session cookie. If SESSION_SECRET is empty, a stable
   * secret is derived from the admin credentials so sessions survive restarts.
   */
  get sessionSecret(): string {
    if (this.env.SESSION_SECRET) return this.env.SESSION_SECRET;
    return createHash('sha256')
      .update(`${this.env.ADMIN_USERNAME}:${this.env.ADMIN_PASSWORD}`)
      .digest('hex');
  }

  get encryptionKey(): string {
    return this.env.ENCRYPTION_KEY;
  }

  get buildInfo(): { version: string; buildTime: string; gitCommit: string; nodeVersion: string } {
    return {
      version: this.env.APP_VERSION,
      buildTime: this.env.BUILD_TIME,
      gitCommit: this.env.GIT_COMMIT,
      nodeVersion: process.version,
    };
  }
}
