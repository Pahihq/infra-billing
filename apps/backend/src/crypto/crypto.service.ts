import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { AppConfigService } from '@config/app-config.service';

const IV_LENGTH = 12; // GCM standard nonce length
const AUTH_TAG_LENGTH = 16;

/** AES-256-GCM encryption of provider API tokens at rest (stored as bytea). */
@Injectable()
export class CryptoService {
  private readonly key: Buffer;

  constructor(config: AppConfigService) {
    const key = Buffer.from(config.encryptionKey, 'base64');
    if (key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must decode to 32 bytes (base64 of a 256-bit key)');
    }
    this.key = key;
  }

  /** Encrypt plaintext → iv || ciphertext || authTag (Uint8Array for Prisma Bytes). */
  encrypt(plaintext: string): Uint8Array<ArrayBuffer> {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    const combined = Buffer.concat([iv, ciphertext, authTag]);
    // `new Uint8Array(length)` yields Uint8Array<ArrayBuffer> (what Prisma Bytes expects).
    const out = new Uint8Array(combined.length);
    out.set(combined);
    return out;
  }

  /** Decrypt iv || ciphertext || authTag → plaintext. */
  decrypt(payload: Uint8Array): string {
    if (payload.length < IV_LENGTH + AUTH_TAG_LENGTH) {
      throw new Error('encrypted payload too short');
    }
    const iv = payload.subarray(0, IV_LENGTH);
    const authTag = payload.subarray(payload.length - AUTH_TAG_LENGTH);
    const ciphertext = payload.subarray(IV_LENGTH, payload.length - AUTH_TAG_LENGTH);
    const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  }

  /** Mask a secret for display: ••••last4 (never expose the raw token in the API). */
  mask(secret: string): string {
    return `••••${secret.slice(-4)}`;
  }
}
