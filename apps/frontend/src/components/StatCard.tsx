import type { Icon } from '@tabler/icons-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string;
  icon: Icon;
  /** Accepted but unused, so call sites don't have to change; the icon chip uses a single accent style. */
  color?: string;
}

export function StatCard({ label, value, icon: IconCmp }: StatCardProps) {
  return (
    <Card className="flex-row items-start justify-between gap-4 rounded-xl p-5">
      <div className="min-w-0">
        <p className="section-label">{label}</p>
        <p className="mt-1 truncate text-2xl font-bold">{value}</p>
      </div>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <IconCmp size={20} />
      </div>
    </Card>
  );
}
