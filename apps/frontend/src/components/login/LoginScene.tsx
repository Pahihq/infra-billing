import { Player, type PlayerRef } from '@remotion/player';
import { useEffect, useMemo, useRef } from 'react';
import { AbsoluteFill } from 'remotion';
import { MarkerHighlight } from '@/components/remocn/marker-highlight';
import { ShaderGrainGradient } from '@/components/remocn/shader-grain-gradient';

const FPS = 30;
// Long backdrop cycle so the loop seam (gradient jump) happens rarely.
const BACKDROP_FRAMES = 90 * FPS;
// The title plays once and freezes on its last frame.
const TITLE_FRAMES = 75;

// Muted brand magenta on charcoal black — the backdrop must not compete with the form.
const BRAND_GRAIN = ['#2a0a24', '#571649', '#9d287d'];

/** The Player's built-in autoplay doesn't survive StrictMode's double mount — drive the frames by hand via seekTo. */
function useSeekLoop(playerRef: React.RefObject<PlayerRef | null>, frames: number, loop: boolean) {
  const reduceMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.floor(((now - start) / 1000) * FPS);
      const frame = loop ? elapsed % frames : Math.min(elapsed, frames - 1);
      playerRef.current?.seekTo(frame);
      if (loop || elapsed < frames - 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playerRef, frames, loop, reduceMotion]);
  return reduceMotion;
}

function BackdropComposition() {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0c' }}>
      <ShaderGrainGradient
        colors={BRAND_GRAIN}
        colorBack="#0a0a0c"
        speed={0.4}
        softness={0.85}
        intensity={0.18}
        noise={0.25}
      />
      {/* Darken toward the center/bottom so the form on top stays readable. */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(10,10,12,0.55), rgba(10,10,12,0.82))',
        }}
      />
    </AbsoluteFill>
  );
}

// Cover-fit the square composition over any viewport (the Player has no object-fit knob).
// Module scope keeps the style object identity-stable across renders.
const BACKDROP_COVER_STYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  height: 'auto',
  minWidth: '100%',
  minHeight: '100%',
  aspectRatio: '1 / 1',
} satisfies React.CSSProperties;

/** Full-screen animated login backdrop (remocn shader-grain-gradient). */
export function LoginBackdrop() {
  const playerRef = useRef<PlayerRef>(null);
  const reduceMotion = useSeekLoop(playerRef, BACKDROP_FRAMES, true);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0c]">
      <Player
        ref={playerRef}
        acknowledgeRemotionLicense
        component={BackdropComposition}
        durationInFrames={BACKDROP_FRAMES}
        fps={FPS}
        compositionWidth={1200}
        compositionHeight={1200}
        loop
        initialFrame={reduceMotion ? 240 : 0}
        controls={false}
        clickToPlay={false}
        style={BACKDROP_COVER_STYLE}
      />
    </div>
  );
}

function TitleComposition({ before, highlight }: { before: string; highlight: string }) {
  return (
    // marker-highlight reads its font from var(--font-geist-sans) — override it with the app font stack.
    <AbsoluteFill style={{ ['--font-geist-sans' as string]: "'Mulish', sans-serif" }}>
      <MarkerHighlight
        before={before}
        highlight={highlight}
        markerColor="#fb7be2"
        baseColor="#ffffff"
        highlightedTextColor="#430b34"
        fontSize={64}
        fontWeight={800}
      />
    </AbsoluteFill>
  );
}

/** "Infra Billing" title with the remocn marker behind "Billing"; plays once. */
export function LoginTitle() {
  const playerRef = useRef<PlayerRef>(null);
  const reduceMotion = useSeekLoop(playerRef, TITLE_FRAMES, false);

  return (
    <Player
      ref={playerRef}
      acknowledgeRemotionLicense
      component={TitleComposition}
      inputProps={{ before: 'Infra ', highlight: 'Billing' }}
      durationInFrames={TITLE_FRAMES}
      fps={FPS}
      compositionWidth={640}
      compositionHeight={110}
      initialFrame={reduceMotion ? TITLE_FRAMES - 1 : 0}
      controls={false}
      clickToPlay={false}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
