import { Alert, Anchor, Button, Code, Group, Loader, Stack, Text } from '@mantine/core';
import { IconBrandOauth, IconExternalLink } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NetcupDeviceStart } from '@infra/shared';
import { useNetcupDeviceStart, useNetcupDevicePoll } from '@/api/providers';
import { notifyError, notifySuccess } from '@/utils/notify';

type Phase = 'idle' | 'waiting' | 'authorized' | 'error';

/** Return the URL only if it is a real http(s) URL, else null (no javascript:/empty hrefs). */
function httpUrl(u: string): string | null {
  try {
    const { protocol } = new URL(u);
    return protocol === 'https:' || protocol === 'http:' ? u : null;
  } catch {
    return null;
  }
}

// netcup OAuth2 device flow in-panel: shows verification link + user code, polls until the
// owner approves, then hands the minted refresh token to the parent form via onToken.
export function NetcupAuthorizeButton({ onToken }: { onToken: (token: string) => void }) {
  const { t } = useTranslation();
  const startMut = useNetcupDeviceStart();
  const pollMut = useNetcupDevicePoll();
  const [phase, setPhase] = useState<Phase>('idle');
  const [info, setInfo] = useState<NetcupDeviceStart | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const timerRef = useRef<number | null>(null);
  const cancelled = useRef(false);

  // Stop polling if the modal closes / component unmounts.
  useEffect(() => {
    cancelled.current = false;
    return () => {
      cancelled.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const fail = (msg: string) => {
    setPhase('error');
    setErrMsg(msg);
    notifyError(msg);
  };

  const schedulePoll = (deviceCode: string, interval: number, deadline: number) => {
    timerRef.current = window.setTimeout(async () => {
      if (cancelled.current) return;
      try {
        const r = await pollMut.mutateAsync(deviceCode);
        if (cancelled.current) return;
        if (r.status === 'authorized' && r.refreshToken) {
          setPhase('authorized');
          onToken(r.refreshToken);
          notifySuccess(t('providers.netcup.authorized'));
          return;
        }
        if (r.status === 'pending') {
          if (Date.now() < deadline) schedulePoll(deviceCode, interval, deadline);
          else fail(t('providers.netcup.expired'));
          return;
        }
        fail(r.message || t('providers.netcup.failed'));
      } catch {
        if (cancelled.current) return;
        // Transient network error → keep trying until the code expires.
        if (Date.now() < deadline) schedulePoll(deviceCode, interval, deadline);
        else fail(t('providers.netcup.failed'));
      }
    }, interval * 1000);
  };

  const authorize = async () => {
    setErrMsg('');
    setPhase('waiting');
    try {
      const d = await startMut.mutateAsync();
      if (cancelled.current) return;
      setInfo(d);
      schedulePoll(d.deviceCode, d.interval, Date.now() + d.expiresIn * 1000);
    } catch {
      if (cancelled.current) return;
      fail(t('providers.netcup.startFailed'));
    }
  };

  if (phase === 'authorized') {
    return (
      <Text size="sm" c="teal">
        {t('providers.netcup.authorized')}
      </Text>
    );
  }

  if (phase === 'waiting' && info) {
    // Only ever render an http(s) link (never a javascript:/empty href from a tampered response).
    const safeUrl = httpUrl(info.verificationUriComplete);
    return (
      <Alert variant="light" color="brand" title={t('providers.netcup.instructions')}>
        <Stack gap="xs">
          {safeUrl ? (
            <Anchor href={safeUrl} target="_blank" rel="noopener noreferrer">
              <Group gap={4}>
                <IconExternalLink size={16} />
                {t('providers.netcup.openLink')}
              </Group>
            </Anchor>
          ) : (
            <Code>{info.verificationUriComplete || info.verificationUri}</Code>
          )}
          <Group gap="xs">
            <Text size="sm">{t('providers.netcup.code')}</Text>
            <Code>{info.userCode}</Code>
          </Group>
          <Group gap="xs">
            <Loader size="xs" />
            <Text size="sm" c="dimmed">
              {t('providers.netcup.waiting')}
            </Text>
          </Group>
        </Stack>
      </Alert>
    );
  }

  return (
    <Stack gap={4}>
      <Button
        variant="light"
        leftSection={<IconBrandOauth size={16} />}
        loading={phase === 'waiting'}
        onClick={authorize}
      >
        {phase === 'error' ? t('providers.netcup.retry') : t('providers.netcup.authorize')}
      </Button>
      {phase === 'error' && (
        <Text size="xs" c="red">
          {errMsg}
        </Text>
      )}
    </Stack>
  );
}
