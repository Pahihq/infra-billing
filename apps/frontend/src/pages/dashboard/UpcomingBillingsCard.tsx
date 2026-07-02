import type { AnalyticsSummary } from '@infra/shared';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDateShort, formatMoney } from '@/utils/format';
import { dayLabel, severityBadgeClass, severityTextClass } from './dashboardUtils';

interface UpcomingBillingsCardProps {
  upcoming: AnalyticsSummary['upcomingBillings'];
}

export function UpcomingBillingsCard({ upcoming }: UpcomingBillingsCardProps) {
  const { t } = useTranslation();
  // Empty list — skip the card (same as RunwayCard).
  if (upcoming.length === 0) return null;
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle>{t('dashboard.upcoming.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {upcoming.length > 0 ? (
          // flex-wrap: on narrow screens the meta block (badge/date/amount) wraps onto its own line.
          <div className="space-y-2">
            {upcoming.map((ub) => (
              <div
                key={ub.serviceUuid}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
              >
                <p className={cn('min-w-0 text-sm', severityTextClass(ub.severity))}>
                  {ub.providerName} — <b>{ub.name}</b>
                  {ub.covered === false && (
                    <span className="text-xs text-destructive">
                      {t('dashboard.upcoming.insufficientBalance')}
                    </span>
                  )}
                </p>
                <div className="flex flex-nowrap items-center gap-3">
                  <Badge className={cn('capitalize', severityBadgeClass(ub.severity))}>
                    {dayLabel(t, ub.daysUntil)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDateShort(ub.nextBillingAt)}
                  </span>
                  <span className="text-sm font-semibold">{formatMoney(ub.cost, ub.currency)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('dashboard.empty.noUpcoming')}</p>
        )}
      </CardContent>
    </Card>
  );
}
