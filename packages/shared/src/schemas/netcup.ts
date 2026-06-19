import { z } from 'zod';

// netcup SCP OAuth2 device flow, run in-panel so the owner never needs an external script.
// `start` kicks off device authorization; the frontend then polls until the user approves
// in their browser, at which point the refresh token is returned to fill the provider form.

/** Response of POST /providers/netcup/device/start. */
export const netcupDeviceStartSchema = z.object({
  /** Opaque OAuth device code; echoed back to `poll`. */
  deviceCode: z.string(),
  /** Short code the user confirms in the browser. */
  userCode: z.string(),
  verificationUri: z.string(),
  /** Verification URL with the code pre-filled (open this in a browser). */
  verificationUriComplete: z.string(),
  /** Seconds the frontend should wait between polls. */
  interval: z.number().int().positive(),
  /** Seconds until the device code expires. */
  expiresIn: z.number().int().positive(),
});
export type NetcupDeviceStart = z.infer<typeof netcupDeviceStartSchema>;

/** Request body of POST /providers/netcup/device/poll. */
export const netcupDevicePollSchema = z.object({
  deviceCode: z.string().min(1),
});
export type NetcupDevicePoll = z.infer<typeof netcupDevicePollSchema>;

export const netcupDevicePollStatusSchema = z.enum([
  'pending', // user has not approved yet — keep polling
  'authorized', // approved → refreshToken present
  'expired', // device code expired → restart
  'denied', // user declined
  'error', // anything else
]);
export type NetcupDevicePollStatus = z.infer<typeof netcupDevicePollStatusSchema>;

/** Response of POST /providers/netcup/device/poll. */
export const netcupDevicePollResultSchema = z.object({
  status: netcupDevicePollStatusSchema,
  /** Present only when status === 'authorized'. */
  refreshToken: z.string().optional(),
  /** Human-readable detail for error/denied/expired. */
  message: z.string().optional(),
});
export type NetcupDevicePollResult = z.infer<typeof netcupDevicePollResultSchema>;
