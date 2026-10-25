import { useEffect, useRef } from 'react';
import { useMotion } from '../../hooks/useMotion';
import { ApplicationFrame } from '../application/ApplicationFrame';
import { ApplicationApiScene } from '../application/ApplicationApiScene';
import { startApplicationPlayback } from '../application/applicationPlayback';

/** Account API access excerpt from the current APCOSYS website. No network requests. */
export default function ApiScene({ className = '', paused = false }: { className?: string; paused?: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const playback = useRef<ReturnType<typeof startApplicationPlayback> | null>(null);
  const motion = useMotion();
  useEffect(() => {
    if (!frameRef.current) return;
    playback.current = startApplicationPlayback(frameRef.current, 'api');
    return () => { playback.current?.dispose(); playback.current = null; };
  }, []);
  useEffect(() => playback.current?.setPaused(paused || motion.paused), [paused, motion.paused]);
  return <div className={`apco-api-scene ${className}`} aria-hidden="true" inert>
    <ApplicationFrame scene="api" frameRef={frameRef}><ApplicationApiScene /></ApplicationFrame>
  </div>;
}
