'use client';

import { GrainGradient, type GrainGradientProps } from '@paper-design/shaders-react';
import { useCallback, useState } from 'react';
import {
  continueRender,
  delayRender,
  getRemotionEnvironment,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const NEUTRAL_COLORS = ['#3a3a52', '#4a4a68', '#5a5a7e'];

export interface ShaderGrainGradientProps extends Omit<GrainGradientProps, 'frame' | 'ref'> {}

export function ShaderGrainGradient({
  speed = 1,
  colors = NEUTRAL_COLORS,
  colorBack = '#12121a',
  softness = 0.6,
  intensity = 0.2,
  noise = 0.15,
  className,
  ...rest
}: ShaderGrainGradientProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // delayRender is needed only for a real video render: in the in-browser <Player> under
  // React StrictMode the double useState initializer call leaves an orphaned handle,
  // and the player freezes on frame zero (see shader-mesh-gradient).
  const [handle] = useState(() =>
    getRemotionEnvironment().isRendering ? delayRender('shader-grain-gradient') : null,
  );
  const gate = useCallback(
    (element: HTMLDivElement | null) => {
      if (!element || handle === null) return;
      requestAnimationFrame(() => requestAnimationFrame(() => continueRender(handle)));
    },
    [handle],
  );

  return (
    <div ref={gate} className={className} style={{ position: 'absolute', inset: 0 }}>
      <GrainGradient
        speed={0}
        frame={(frame / fps) * speed * 1000}
        colors={colors}
        colorBack={colorBack}
        softness={softness}
        intensity={intensity}
        noise={noise}
        fit="cover"
        width={width}
        height={height}
        {...rest}
      />
    </div>
  );
}
