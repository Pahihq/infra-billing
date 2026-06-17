import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const meSchema = z.object({
  username: z.string(),
});
export type Me = z.infer<typeof meSchema>;
