import { ProviderIcon } from '@/components/ProviderIcon';

// Provider/project favicon (or colored initial) + its name. The recurring leading cell in the
// services, payments, projects and dashboard tables.
export function EntityLabel({
  name,
  src,
  size = 18,
}: {
  name: string;
  src: string | null;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <ProviderIcon name={name} src={src} size={size} />
      <span className="text-sm">{name}</span>
    </div>
  );
}
