import { z } from 'zod';
import { currencySchema, isoDateSchema, moneySchema, uuidSchema } from './common';

/** `topup` = пополнение/платёж провайдеру; `charge` = списание за услугу. */
export const paymentTypeSchema = z.enum(['topup', 'charge']);
export type PaymentType = z.infer<typeof paymentTypeSchema>;

export const paymentSchema = z.object({
  uuid: uuidSchema,
  providerUuid: uuidSchema,
  serviceUuid: uuidSchema.nullable(),
  amount: moneySchema,
  currency: currencySchema,
  description: z.string().nullable(),
  paymentDate: isoDateSchema,
  type: paymentTypeSchema,
  externalId: z.string().nullable(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});
export type Payment = z.infer<typeof paymentSchema>;

/** Paginated payments response (GET /api/payments). */
export const paginatedPaymentsSchema = z.object({
  items: z.array(paymentSchema),
  total: z.number().int().nonnegative(),
});
export type PaginatedPayments = z.infer<typeof paginatedPaymentsSchema>;

export const createPaymentSchema = z.object({
  providerUuid: uuidSchema,
  serviceUuid: uuidSchema.optional(),
  amount: moneySchema,
  currency: currencySchema,
  description: z.string().optional(),
  paymentDate: isoDateSchema,
});
export type CreatePayment = z.infer<typeof createPaymentSchema>;
