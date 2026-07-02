import { IconFingerprint, IconLoader2, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { Passkey } from '@infra/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/utils/format';

interface PasskeysCardProps {
  passkeys: Passkey[] | undefined;
  canPasskey: boolean;
  adding: boolean;
  removing: boolean;
  onAdd: () => void;
  onRemove: (pk: Passkey) => void;
}

export function PasskeysCard({
  passkeys,
  canPasskey,
  adding,
  removing,
  onAdd,
  onRemove,
}: PasskeysCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="gap-4 py-6">
      <CardHeader>
        <CardTitle>{t('auth.passkeys.title')}</CardTitle>
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* span keeps the tooltip working over the disabled button */}
              <span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!canPasskey || adding}
                  onClick={onAdd}
                >
                  {adding ? (
                    <IconLoader2 className="size-4 animate-spin" />
                  ) : (
                    <IconPlus className="size-4" />
                  )}
                  {t('auth.passkeys.add')}
                </Button>
              </span>
            </TooltipTrigger>
            {!canPasskey && <TooltipContent>{t('auth.passkeys.unsupported')}</TooltipContent>}
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent>
        {passkeys && passkeys.length > 0 ? (
          <div className="space-y-2">
            {passkeys.map((pk) => (
              <div key={pk.uuid} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                    <IconFingerprint className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{pk.name ?? t('auth.passkeys.unnamed')}</p>
                      {pk.backedUp && (
                        <Badge className="border-transparent bg-success/15 text-success">
                          {t('auth.passkeys.backedUp')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('auth.passkeys.created', { date: formatDate(pk.createdAt) })}
                      {' · '}
                      {pk.lastUsedAt
                        ? t('auth.passkeys.lastUsed', { date: formatDate(pk.lastUsedAt) })
                        : t('auth.passkeys.neverUsed')}
                    </p>
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      aria-label={t('common.delete')}
                      disabled={removing}
                      onClick={() => onRemove(pk)}
                    >
                      {removing ? (
                        <IconLoader2 className="size-4 animate-spin" />
                      ) : (
                        <IconTrash className="size-4.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('common.delete')}</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('auth.passkeys.empty')}</p>
        )}
      </CardContent>
    </Card>
  );
}
