import { Avatar } from '@mantine/core';
import { useEffect, useState } from 'react';

const COLORS = ['violet', 'teal', 'blue', 'grape', 'cyan', 'indigo', 'pink', 'orange', 'lime'];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return COLORS[hash % COLORS.length];
}

// Colored initial avatar, swapped for the favicon only once it loads. Google's "no favicon"
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

  return (
    <Avatar src={favicon} size={size} radius="sm" color={colorFor(name)} variant="filled">
      {initial}
    </Avatar>
  );
}
