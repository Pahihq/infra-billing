import { useEffect, useState } from 'react';

// Neutral initial avatar, swapped for the favicon only once it loads. Google's "no favicon"
// placeholder is a ~16px globe, so reject anything that small to avoid the blurry globe.
export function ProviderIcon({
  name,
  src,
  size = 22,
}: {
  name: string;
  src: string | null;
  size?: number;
}) {
  const [favicon, setFavicon] = useState<string | null>(null);

  useEffect(() => {
    setFavicon(null);
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 16) setFavicon(src);
    };
    img.src = src;
  }, [src]);

  const initial = (name.trim().charAt(0) || '?').toUpperCase();

  if (favicon) {
    return (
      <img
        src={favicon}
        alt=""
        className="shrink-0 rounded-sm object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-sm border border-border bg-secondary font-semibold text-secondary-foreground select-none"
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.5)) }}
    >
      {initial}
    </div>
  );
}
