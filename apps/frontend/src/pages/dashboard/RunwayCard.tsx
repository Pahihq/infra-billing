import type { AnalyticsSummary } from '@infra/shared';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/utils/format';
import { dayLabel, severityBadgeClass, severityTextClass } from './dashboardUtils';

interface RunwayCardProps {
  runway: AnalyticsSummary['balanceRunway'];
}

export function RunwayCard({ runway }: RunwayCardProps) {
  const { t } = useTranslation();
  if (runway.length === 0) return null;
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle>{t('dashboard.runway.title')}</CardTitle>
        <CardDescription className="text-xs">{t('dashboard.runway.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {runway.map((r) => (
            <div
              key={r.providerUuid}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
            >
              <p className={cn('min-w-0 text-sm', severityTextClass(r.severity))}>
                <b>{r.providerName}</b>
              </p>
              <div className="flex flex-nowrap items-center gap-3">
                {/* capitalize only inside the badge: in sentences ({{when}}) the label stays lowercase. */}
                <Badge className={cn('capitalize', severityBadgeClass(r.severity))}>
                  {dayLabel(t, r.daysLeft)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {t('dashboard.runway.perDay', { amount: formatMoney(r.burnPerDay, r.currency) })}
                </span>
                <span className="text-sm font-semibold">{formatMoney(r.balance, r.currency)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
