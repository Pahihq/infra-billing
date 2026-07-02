import { IconActivity, IconCheck, IconCopy } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuildInfo } from '@/api/buildInfo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDisclosure } from '@/hooks/useDisclosure';
import { cn } from '@/lib/utils';

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function CommitCopy({ commit }: { commit: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard.writeText(commit);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-1.5">
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{commit.slice(0, 8)}</code>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-xs" aria-label={t('build.copy')} onClick={copy}>
            {copied ? <IconCheck className="size-3.5" /> : <IconCopy className="size-3.5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{copied ? t('build.copied') : t('build.copy')}</TooltipContent>
      </Tooltip>
    </div>
  );
}

export function BuildInfo() {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = useBuildInfo();
  const version = data?.version ?? '—';
  // "unknown" is what the build emits when not built from a git checkout.
  const commit = data?.gitCommit && data.gitCommit !== 'unknown' ? data.gitCommit : '';
  // "dev" = the build-arg default (not a tagged release). Flag it with a highlighted "DEV" badge.
  const isDev = version === 'dev';
  const label = isDev ? 'DEV' : `v${version}`;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'text-muted-foreground',
          isDev &&
            'bg-brand/15 font-bold tracking-[0.1em] text-brand hover:bg-brand/25 hover:text-brand',
        )}
        onClick={open}
      >
        <IconActivity className="size-4" />
        {label}
      </Button>

      <Dialog open={opened} onOpenChange={(o) => !o && close()}>
        {/* No autofocus: otherwise the focus ring lights up on the close button right away. */}
        <DialogContent className="sm:max-w-sm" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{t('build.about')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Badge className="border-transparent bg-brand/15 px-2.5 py-1 text-sm text-brand">
                {label}
              </Badge>
            </div>
            <Row label={t('build.date')}>
              <span className="text-sm">
                {data?.buildTime ? dayjs(data.buildTime).format('DD.MM.YYYY HH:mm') : '—'}
              </span>
            </Row>
            <Row label={t('build.commit')}>
              {commit ? <CommitCopy commit={commit} /> : <span className="text-sm">—</span>}
            </Row>
            <Row label={t('build.node')}>
              <span className="text-sm">{data?.nodeVersion ?? '—'}</span>
            </Row>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
