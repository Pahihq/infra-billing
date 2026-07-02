import type { Project, Provider, Service } from '@infra/shared';
import { IconBraces, IconEdit, IconReceipt2, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { EntityLabel } from '@/components/EntityLabel';
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
import { cn } from '@/lib/utils';
import { projectFavicon, providerFavicon } from '@/utils/favicon';
import { countryFlag, formatCost, formatDateShort, truncate } from '@/utils/format';
import { LOCATED_TYPES, ServiceTypeIcon } from './ServiceTypeIcon';

const NAME_MAX_LENGTH = 40;

interface ServicesTableProps {
  services: Service[] | undefined;
  isLoading: boolean;
  providerOf: (uuid: string) => Provider | undefined;
  projectOf: (uuid: string) => Project | undefined;
  serviceTypeLabel: (type: string) => string;
  periodLabel: (period: string) => string;
  onPayments: (s: Service) => void;
  onMeta: (s: Service) => void;
  onEdit: (s: Service) => void;
  onDelete: (s: Service) => void;
}

export function ServicesTable({
  services,
  isLoading,
  providerOf,
  projectOf,
  serviceTypeLabel,
  periodLabel,
  onPayments,
  onMeta,
  onEdit,
  onDelete,
}: ServicesTableProps) {
  const { t } = useTranslation();
  return (
    <Card className="overflow-hidden py-0">
      <div className="overflow-x-auto">
        <Table className="min-w-[820px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">{t('services.colName')}</TableHead>
              <TableHead className="text-muted-foreground">{t('services.colProvider')}</TableHead>
              <TableHead className="text-muted-foreground">{t('services.colProject')}</TableHead>
              <TableHead className="text-muted-foreground">{t('services.colType')}</TableHead>
              <TableHead className="text-muted-foreground">{t('services.colCost')}</TableHead>
              <TableHead className="text-muted-foreground">{t('services.colPeriod')}</TableHead>
              <TableHead className="text-muted-foreground">
                {t('services.colNextBilling')}
              </TableHead>
              <TableHead className="text-muted-foreground">{t('services.colSource')}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {services?.map((s) => {
              const provider = providerOf(s.providerUuid);
              const project = projectOf(s.projectUuid);
              return (
                <TableRow key={s.uuid} className={cn(!s.isActive && 'opacity-50')}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5">
                      {LOCATED_TYPES.has(s.type) ? (
                        <span>{countryFlag(s.countryCode)}</span>
                      ) : (
                        <ServiceTypeIcon type={s.type} />
                      )}
                      {s.name.length > NAME_MAX_LENGTH ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-semibold">
                              {truncate(s.name, NAME_MAX_LENGTH)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{s.name}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="font-semibold">{s.name}</span>
                      )}
                      {!s.isActive && (
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                          {t('services.badgeInactive')}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <EntityLabel
                      name={provider?.name ?? ''}
                      src={providerFavicon(provider ?? { faviconLink: null, loginUrl: null })}
                    />
                  </TableCell>
                  <TableCell>
                    <EntityLabel
                      name={project?.name ?? ''}
                      src={projectFavicon(project?.faviconLink ?? null)}
                    />
                  </TableCell>
                  <TableCell>{serviceTypeLabel(s.type)}</TableCell>
                  <TableCell>{formatCost(s.cost, s.currency)}</TableCell>
                  <TableCell>{periodLabel(s.period)}</TableCell>
                  <TableCell>{formatDateShort(s.nextBillingAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={s.isManaged ? 'default' : 'secondary'}
                      className={cn(
                        'text-[10px] uppercase tracking-wide',
                        s.isManaged && 'border-transparent bg-brand/15 text-brand',
                      )}
                    >
                      {s.isManaged ? t('services.sourceManaged') : t('services.sourceManual')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-nowrap items-center justify-end gap-1">
                      {(s.paymentsCount ?? 0) > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={t('services.paymentsTooltip', {
                                count: s.paymentsCount ?? 0,
                              })}
                              onClick={() => onPayments(s)}
                            >
                              <IconReceipt2 className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t('services.paymentsTooltip', { count: s.paymentsCount ?? 0 })}
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {Object.keys(s.meta ?? {}).length > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={t('services.metaTooltip')}
                              onClick={() => onMeta(s)}
                            >
                              <IconBraces className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t('services.metaTooltip')}</TooltipContent>
                        </Tooltip>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t('common.edit')}
                        onClick={() => onEdit(s)}
                      >
                        <IconEdit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t('common.delete')}
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(s)}
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {!isLoading && services?.length === 0 && (
              <TableRow>
                <TableCell colSpan={9}>
                  <p className="py-4 text-center text-muted-foreground">{t('services.empty')}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
