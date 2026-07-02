import {
  IconAlertTriangle,
  IconFingerprint,
  IconLoader2,
  IconLock,
  IconPassword,
} from '@tabler/icons-react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MethodRow } from './MethodRow';

export interface MethodsFormValues {
  passwordEnabled: boolean;
  passkeyEnabled: boolean;
  rpId: string;
  rpName: string;
  rpOrigin: string;
}

interface AuthMethodsCardProps {
  form: UseFormReturn<MethodsFormValues>;
  pkOpen: boolean;
  onTogglePk: () => void;
  onUseCurrentHost: () => void;
  onSave: () => void;
  saving: boolean;
}

// Password is a plain on/off toggle; passkey expands to its WebAuthn relying-party settings.
export function AuthMethodsCard({
  form,
  pkOpen,
  onTogglePk,
  onUseCurrentHost,
  onSave,
  saving,
}: AuthMethodsCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="gap-0 py-6">
      <CardContent className="flex items-center gap-3 pb-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
          <IconLock className="size-5" stroke={1.5} />
        </div>
        <div>
          <p className="font-semibold">{t('auth.methods.title')}</p>
          <p className="text-xs text-muted-foreground">{t('auth.methods.subtitle')}</p>
        </div>
      </CardContent>
      <Separator />

      <CardContent>
        <Controller
          control={form.control}
          name="passwordEnabled"
          render={({ field }) => (
            <MethodRow
              icon={IconPassword}
              title={t('auth.methods.password')}
              description={t('auth.methods.passwordDescription')}
              enabled={field.value}
              onToggle={field.onChange}
            />
          )}
        />
      </CardContent>

      <Separator />

      <CardContent>
        <Controller
          control={form.control}
          name="passkeyEnabled"
          render={({ field }) => (
            <MethodRow
              icon={IconFingerprint}
              title={t('auth.methods.passkey')}
              description={t('auth.methods.passkeyDescription')}
              enabled={field.value}
              onToggle={field.onChange}
              opened={pkOpen}
              onToggleOpen={onTogglePk}
            >
              <div className="space-y-3">
                <Alert className="border-warning/30 bg-warning/10 text-warning [&>svg]:text-warning">
                  <IconAlertTriangle className="size-4.5" />
                  <AlertDescription className="text-warning">
                    {t('auth.methods.warning')}
                  </AlertDescription>
                </Alert>
                <div className="space-y-1.5">
                  <Label htmlFor="auth-rp-id">{t('auth.methods.rpId')}</Label>
                  <p className="text-xs text-muted-foreground">
                    {t('auth.methods.rpIdDescription')}
                  </p>
                  <Input id="auth-rp-id" placeholder="example.com" {...form.register('rpId')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="auth-rp-name">{t('auth.methods.rpName')}</Label>
                  <Input
                    id="auth-rp-name"
                    placeholder="Infra Billing"
                    {...form.register('rpName')}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="auth-rp-origin">{t('auth.methods.rpOrigin')}</Label>
                  <p className="text-xs text-muted-foreground">
                    {t('auth.methods.rpOriginDescription')}
                  </p>
                  <Input
                    id="auth-rp-origin"
                    placeholder="https://example.com"
                    {...form.register('rpOrigin')}
                  />
                </div>
                <div>
                  <Button type="button" variant="ghost" size="sm" onClick={onUseCurrentHost}>
                    {t('auth.methods.useCurrent')}
                  </Button>
                </div>
              </div>
            </MethodRow>
          )}
        />
      </CardContent>

      <CardContent className="flex justify-end pt-4">
        <Button onClick={onSave} disabled={saving}>
          {saving && <IconLoader2 className="size-4 animate-spin" />}
          {t('common.save')}
        </Button>
      </CardContent>
    </Card>
  );
}
