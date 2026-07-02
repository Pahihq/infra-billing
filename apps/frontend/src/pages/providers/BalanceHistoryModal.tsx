import type { Provider } from '@infra/shared';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { useBalanceHistory } from '@/api/analytics';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate, formatDateShort, formatMoney } from '@/utils/format';

// The default recharts Y-axis starts at 0, so a near-flat balance line (e.g. a steady 36)
// gets glued to the top of the chart with everything below it empty. Pad the axis around the actual
// values (snapped to a "nice" 1/2/5 step) so the line sits mid-chart with clean tick labels.
function niceBalanceDomain(values: number[]): { domain: [number, number]; ticks: number[] } {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || Math.abs(max) || 1;
  const rawStep = spread / 4;
  const mag = 10 ** Math.floor(Math.log10(rawStep));
  const norm = rawStep / mag;
  const step = (norm >= 5 ? 5 : norm >= 2 ? 2 : 1) * mag;
  const lo = Math.floor((min - spread * 0.2) / step) * step;
  const hi = Math.ceil((max + spread * 0.2) / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Number(v.toFixed(6)));
  return { domain: [lo, hi], ticks };
}

export function BalanceHistoryModal({
  provider,
  onClose,
}: {
  provider: Provider | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  // Keep the last provider: the parent nulls the prop immediately while the exit animation is
  // still running — without this the chart collapses to empty mid-close.
  const lastProvider = useRef<Provider | null>(provider);
  if (provider) lastProvider.current = provider;
  const shown = provider ?? lastProvider.current;

  const history = useBalanceHistory(shown?.uuid);
  // Snapshots are taken on every sync (~6h), so collapse to one point per day (the day's last
  // snapshot) to match the "balance by day" chart and avoid repeated same-date axis labels.
  const dailyBalance = new Map<string, number>();
  for (const pt of history.data ?? [])
    dailyBalance.set(formatDateShort(pt.capturedAt), Number(pt.balance));
  const historyData = [...dailyBalance].map(([date, balance]) => ({ date, balance }));
  const balanceAxis = historyData.length
    ? niceBalanceDomain(historyData.map((d) => d.balance))
    : null;
  const latest = history.data?.[history.data.length - 1];
  const historyCurrency = latest?.currency ?? shown?.balanceCurrency ?? '';

  const chartConfig = {
    balance: { label: t('providers.balanceHistory.series'), color: 'var(--chart-1)' },
  } satisfies ChartConfig;

  return (
    <Dialog open={!!provider} onOpenChange={(o) => !o && onClose()}>
      {/* No autofocus — otherwise the focus ring lights up on the close button right away. */}
      <DialogContent className="sm:max-w-2xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {t('providers.balanceHistory.title', { name: shown?.name ?? '' })}
          </DialogTitle>
        </DialogHeader>
        {history.isLoading ? (
          <p className="py-4 text-center text-muted-foreground">{t('common.loading')}</p>
        ) : historyData.length >= 2 ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
            <LineChart data={historyData} margin={{ top: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                domain={balanceAxis?.domain}
                ticks={balanceAxis?.ticks}
                tickFormatter={(v: number) => formatMoney(String(v))}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <div className="flex w-full items-center justify-between gap-4 leading-none">
                        <span className="text-muted-foreground">
                          {t('providers.balanceHistory.series')}
                        </span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {formatMoney(String(value), historyCurrency)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Line
                type="linear"
                dataKey="balance"
                stroke="var(--color-balance)"
                strokeWidth={2}
                dot={historyData.length <= 60}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        ) : latest ? (
          <div className="flex flex-col items-center gap-0.5 py-6">
            <p className="text-xl font-bold">{formatMoney(latest.balance, historyCurrency)}</p>
            <p className="text-sm text-muted-foreground">{formatDate(latest.capturedAt)}</p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {t('providers.balanceHistory.notEnough')}
            </p>
          </div>
        ) : (
          <p className="py-4 text-center text-muted-foreground">
            {t('providers.balanceHistory.empty')}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
