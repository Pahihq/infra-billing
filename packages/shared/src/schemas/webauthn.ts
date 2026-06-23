import { z } from 'zod';

// Ceremony payloads are pass-through: @simplewebauthn/* owns the PublicKeyCredential*JSON shapes
// (browser types the frontend, server validates the backend), so re-declaring them in zod would
// only drift. Validate just the fields we read (e.g. the optional passkey name).

export const passkeyRegisterVerifySchema = z.object({
  response: z.unknown().describe('Registration ceremony response'),
  name: z.string().max(64).describe('Passkey display name').optional(),
});
export type PasskeyRegisterVerify = z.infer<typeof passkeyRegisterVerifySchema>;

export const passkeyLoginVerifySchema = z.object({
  response: z.unknown().describe('Authentication ceremony response'),
});
export type PasskeyLoginVerify = z.infer<typeof passkeyLoginVerifySchema>;
