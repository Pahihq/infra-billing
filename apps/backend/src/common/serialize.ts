import { Prisma } from '@generated/prisma/client';

/** NUMERIC(14,2) Decimal → fixed 2-decimal string (matches the shared money schema). */
export function decimalToString(d: Prisma.Decimal | null | undefined): string | null {
  return d == null ? null : d.toFixed(2);
}

/** Date → ISO 8601 (UTC). The frontend renders it in local time. */
export function dateToIso(d: Date | null | undefined): string | null {
  return d == null ? null : d.toISOString();
}
