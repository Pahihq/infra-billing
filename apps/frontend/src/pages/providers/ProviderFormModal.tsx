import { IconLoader2 } from '@tabler/icons-react';
import type { FormEventHandler } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProviderCredentialFields } from './ProviderCredentialFields';
import type { FormValues } from './providerForm';

interface ProviderFormModalProps {
  opened: boolean;
  editing: boolean;
  form: UseFormReturn<FormValues>;
  kindOptions: { value: string; label: string }[];
  isPending: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onClose: () => void;
}

export function ProviderFormModal({
  opened,
  editing,
  form,
  kindOptions,
  isPending,
  onSubmit,
  onClose,
}: ProviderFormModalProps) {
  const { t } = useTranslation();
  const nameError = form.formState.errors.name;
  return (
    <Dialog open={opened} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? t('providers.modalEdit') : t('providers.modalCreate')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider-name">
              {t('providers.field.name')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="provider-name"
              aria-invalid={nameError ? true : undefined}
              {...form.register('name', {
                validate: (v) => (v.trim() ? true : t('validation.enterName')),
              })}
            />
            {nameError && <p className="text-xs text-destructive">{nameError.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider-kind">{t('providers.field.type')}</Label>
            <Controller
              control={form.control}
              name="kind"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={editing}>
                  <SelectTrigger id="provider-kind" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {kindOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <ProviderCredentialFields form={form} editing={editing} />
          <div className="space-y-2">
            <Label htmlFor="provider-login-url">{t('providers.field.loginUrl')}</Label>
            <p className="text-xs text-muted-foreground">{t('providers.field.loginUrlDesc')}</p>
            <Input id="provider-login-url" {...form.register('loginUrl')} />
          </div>
          <Controller
            control={form.control}
            name="isPostpaid"
            render={({ field }) => (
              <div className="flex items-start gap-2">
                <Checkbox
                  id="provider-postpaid"
                  checked={field.value}
                  onCheckedChange={(c) => field.onChange(c === true)}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label htmlFor="provider-postpaid">{t('providers.field.isPostpaid')}</Label>
                  <p className="text-xs text-muted-foreground">
                    {t('providers.field.isPostpaidDesc')}
                  </p>
                </div>
              </div>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <IconLoader2 className="size-4 animate-spin" />}
            {t('common.save')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
