import { useEffect, useRef } from 'react';
import { useMotion } from '../../hooks/useMotion';
import { ApplicationFrame } from '../application/ApplicationFrame';
import { ApplicationProductScene } from '../application/ApplicationProductScene';
import { startApplicationPlayback } from '../application/applicationPlayback';

export type ProductSceneName = 'query' | 'results' | 'host' | 'evidence' | 'suggestions';

/** Responsive, inert excerpt from the current APCOSYS marketing website. */
export default function ProductScene({ scene, className = '', paused = false }: {
  scene: ProductSceneName; className?: string; paused?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const playback = useRef<ReturnType<typeof startApplicationPlayback> | null>(null);
  const motion = useMotion();
  useEffect(() => {
    if (!frameRef.current) return;
    playback.current = startApplicationPlayback(frameRef.current, scene);
    return () => { playback.current?.dispose(); playback.current = null; };
  }, [scene]);
  useEffect(() => playback.current?.setPaused(paused || motion.paused), [paused, motion.paused, scene]);
  return <div className={`apco-product-scene ${className}`} aria-hidden="true" inert>
    <ApplicationFrame scene={scene} frameRef={frameRef}><ApplicationProductScene scene={scene} /></ApplicationFrame>
  </div>;
}
