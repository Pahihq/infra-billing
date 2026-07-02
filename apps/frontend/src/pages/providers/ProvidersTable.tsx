import type { Provider } from '@infra/shared';
import {
  IconChartLine,
  IconEdit,
  IconExternalLink,
  IconLoader2,
  IconRefresh,
  IconTrash,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ProviderIcon } from '@/components/ProviderIcon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { providerFavicon } from '@/utils/favicon';
import { formatDate, formatMoney } from '@/utils/format';

interface ProvidersTableProps {
  providers: Provider[] | undefined;
  isLoading: boolean;
  syncingUuid: string | undefined;
  kindLabel: (kind: string) => string;
  onSync: (uuid: string) => void;
  onHistory: (p: Provider) => void;
  onEdit: (p: Provider) => void;
  onDelete: (p: Provider) => void;
}

export function ProvidersTable({
  providers,
  isLoading,
  syncingUuid,
  kindLabel,
  onSync,
  onHistory,
  onEdit,
  onDelete,
}: ProvidersTableProps) {
  const { t } = useTranslation();
  return (
    <Card className="overflow-hidden py-0">
      <div className="overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">{t('providers.th.name')}</TableHead>
              <TableHead className="text-muted-foreground">{t('providers.th.type')}</TableHead>
              <TableHead className="text-muted-foreground">{t('providers.th.balance')}</TableHead>
              <TableHead className="text-muted-foreground">{t('providers.th.services')}</TableHead>
              <TableHead className="text-muted-foreground">{t('providers.th.payments')}</TableHead>
              <TableHead className="text-muted-foreground">{t('providers.th.sync')}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers?.map((p) => (
              <TableRow key={p.uuid}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <ProviderIcon name={p.name} src={providerFavicon(p)} />
                    <span className="font-semibold">{p.name}</span>
                    {p.loginUrl && (
                      <Button
                        asChild
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground"
                      >
                        <a
                          href={p.loginUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={p.loginUrl}
                        >
                          <IconExternalLink className="size-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                    {kindLabel(p.kind)}
                  </Badge>
                </TableCell>
                <TableCell>{formatMoney(p.balance, p.balanceCurrency)}</TableCell>
                <TableCell>{p.servicesCount ?? 0}</TableCell>
                <TableCell>{p.paymentsCount ?? 0}</TableCell>
                <TableCell>
                  {p.lastSyncError ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {/* Soft fill: a solid destructive badge is too harsh here. */}
                        <Badge className="border-transparent bg-destructive/15 text-[10px] text-destructive uppercase tracking-wide">
                          {t('providers.syncError')}
                        </Badge>
                      </TooltipTrigger>
                      {/* text-pretty, not text-balance: balance shortens lines under max-w,
                          leaving an empty "squashed" box. */}
                      <TooltipContent className="max-w-[420px] whitespace-normal text-pretty px-3 py-2">
                        {p.lastSyncError}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {formatDate(p.lastSyncAt)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-nowrap items-center justify-end gap-1">
                    {p.kind !== 'manual' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={t('common.refresh')}
                              disabled={syncingUuid === p.uuid}
                              onClick={() => onSync(p.uuid)}
                            >
                              {syncingUuid === p.uuid ? (
                                <IconLoader2 className="size-4 animate-spin" />
                              ) : (
                                <IconRefresh className="size-4" />
                              )}
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{t('common.refresh')}</TooltipContent>
                      </Tooltip>
                    )}
                    {p.balance != null && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t('providers.balanceHistory.tooltip')}
                            onClick={() => onHistory(p)}
                          >
                            <IconChartLine className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('providers.balanceHistory.tooltip')}</TooltipContent>
                      </Tooltip>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t('common.edit')}
                      onClick={() => onEdit(p)}
                    >
                      <IconEdit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      aria-label={t('common.delete')}
                      onClick={() => onDelete(p)}
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && providers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <p className="py-4 text-center text-muted-foreground">{t('providers.empty')}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
