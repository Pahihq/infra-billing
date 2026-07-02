import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  IconAlertTriangle,
  IconCheck,
  IconCopy,
  IconLoader2,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import type { ApiToken, CreatedApiToken } from '@infra/shared';
import { useCreateToken, useDeleteToken, useTokens } from '@/api/tokens';
import { apiErrorMessage } from '@/api/client';
import { PageHeader } from '@/components/PageHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDisclosure } from '@/hooks/useDisclosure';
import { notifyError, notifySuccess } from '@/utils/notify';
import { formatDateShort } from '@/utils/format';

export function TokensPage() {
  const { t } = useTranslation();
  const { data: tokens, isLoading } = useTokens();
  const create = useCreateToken();
  const del = useDeleteToken();
  const [opened, { open, close }] = useDisclosure(false);
  // The raw token, captured from the create response. Shown once, then cleared.
  const [created, setCreated] = useState<CreatedApiToken | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<{ tokenName: string }>({
    defaultValues: { tokenName: '' },
    mode: 'onSubmit',
  });

  const openCreate = () => {
    form.reset({ tokenName: '' });
    open();
  };

  const submit = form.handleSubmit(async (v) => {
    try {
      const res = await create.mutateAsync({ tokenName: v.tokenName.trim() });
      close();
      setCreated(res); // open the one-time reveal. The raw token isn't recoverable afterwards
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  });

  const closeReveal = () => {
    setCreated(null);
    setCopied(false);
  };

  const copyToken = async () => {
    await navigator.clipboard.writeText(created?.token ?? '');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const doDelete = async (tok: ApiToken) => {
    if (!window.confirm(t('tokens.confirmDelete', { name: tok.tokenName }))) return;
    try {
      await del.mutateAsync(tok.uuid);
      notifySuccess(t('common.deleted'));
    } catch (e) {
      notifyError(apiErrorMessage(e));
    }
  };

  const nameError = form.formState.errors.tokenName;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tokens.title')}
        subtitle={t('tokens.subtitle')}
        actions={
          <Button onClick={openCreate}>
            <IconPlus className="size-4" />
            {t('common.add')}
          </Button>
        }
      />

      <Card className="overflow-hidden py-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">{t('tokens.colName')}</TableHead>
                <TableHead className="text-muted-foreground">{t('tokens.colToken')}</TableHead>
                <TableHead className="text-muted-foreground">{t('tokens.colCreated')}</TableHead>
                <TableHead className="text-muted-foreground">{t('tokens.colLastUsed')}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens?.map((tok) => (
                <TableRow key={tok.uuid}>
                  <TableCell className="font-semibold">{tok.tokenName}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                      {`${tok.tokenPrefix}…`}
                    </code>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDateShort(tok.createdAt)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {tok.lastUsedAt ? formatDateShort(tok.lastUsedAt) : t('tokens.lastUsedNever')}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        aria-label={t('common.delete')}
                        onClick={() => doDelete(tok)}
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && tokens?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    {t('tokens.empty')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={opened} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('tokens.modalCreate')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} noValidate className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token-name">
                {t('tokens.fieldName')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="token-name"
                placeholder={t('tokens.namePlaceholder')}
                autoFocus
                aria-invalid={!!nameError}
                {...form.register('tokenName', {
                  validate: (v) => (v.trim() ? true : t('validation.enterName')),
                })}
              />
              {nameError && <p className="text-xs text-destructive">{nameError.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={create.isPending}>
              {create.isPending && <IconLoader2 className="size-4 animate-spin" />}
              {t('tokens.create')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!created} onOpenChange={(o) => !o && closeReveal()}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{t('tokens.reveal.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <IconAlertTriangle className="size-4" />
              <AlertDescription>{t('tokens.reveal.warning')}</AlertDescription>
            </Alert>
            <div className="flex items-center gap-1.5">
              <code className="min-w-0 flex-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs break-all">
                {created?.token}
              </code>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={copied ? t('tokens.copied') : t('tokens.copy')}
                    onClick={copyToken}
                  >
                    {copied ? <IconCheck className="size-4" /> : <IconCopy className="size-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{copied ? t('tokens.copied') : t('tokens.copy')}</TooltipContent>
              </Tooltip>
            </div>
            <Button className="w-full" onClick={closeReveal}>
              {t('tokens.reveal.done')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
