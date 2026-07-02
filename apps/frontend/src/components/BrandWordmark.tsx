import { cn } from '@/lib/utils';

/**
 * "Infra Billing" wordmark with a marker behind "Billing" — a browser adaptation
 * of the remocn marker-highlight (same as the login screen) built on pure CSS
 * keyframes, so Remotion stays out of the main bundle. The brand-marker/-text
 * classes are defined in index.css.
 */
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn('font-extrabold tracking-tight', className)}>
      {'Infra '}
      <span className="relative inline-block">
        <span
          aria-hidden
          className="brand-marker absolute inset-y-0 -inset-x-[0.12em] origin-left rounded-[2px] bg-[#fb7be2]"
        />
        <span className="brand-marker-text relative z-[1]">Billing</span>
      </span>
    </span>
  );
}
