import type { Service } from '@infra/shared';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePayments } from '@/api/payments';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateShort, formatMoney } from '@/utils/format';

// Read-only list of the payments tied to a single service (opened from the table receipt icon).
export function ServicePaymentsModal({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  // Keep the last service: the parent nulls the prop immediately while the exit animation is
  // still running — without this the content visibly collapses to empty (it also keeps the query key stable).
  const lastService = useRef<Service | null>(service);
  if (service) lastService.current = service;
  const shown = service ?? lastService.current;

  const payments = usePayments(
    { serviceUuid: shown?.uuid },
    { enabled: Boolean(service), pageSize: 100 },
  );
  const items = payments.data?.items ?? [];

  return (
    <Dialog open={!!service} onOpenChange={(o) => !o && onClose()}>
      {/* No autofocus — otherwise the focus ring lights up on the close button right away. */}
      <DialogContent className="sm:max-w-3xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('services.paymentsTitle', { name: shown?.name ?? '' })}</DialogTitle>
        </DialogHeader>
        {payments.isLoading ? (
          <p className="py-4 text-center text-muted-foreground">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="py-4 text-center text-muted-foreground">{t('services.paymentsEmpty')}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[620px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">
                    {t('services.paymentsColDate')}
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    {t('services.paymentsColType')}
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    {t('services.paymentsColAmount')}
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    {t('services.paymentsColDescription')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((p) => (
                  <TableRow key={p.uuid}>
                    <TableCell>{formatDateShort(p.paymentDate)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={p.type === 'charge' ? 'secondary' : 'default'}
                        className={
                          p.type === 'charge'
                            ? 'text-[10px] uppercase tracking-wide'
                            : 'border-transparent bg-success/15 text-[10px] text-success uppercase tracking-wide'
                        }
                      >
                        {p.type === 'charge'
                          ? t('services.paymentCharge')
                          : t('services.paymentTopup')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatMoney(p.amount, p.currency)}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <span className="text-sm break-words text-muted-foreground">
                        {p.description ?? t('common.none')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
