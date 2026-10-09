import { useEffect, useState, type ReactNode } from 'react';
import { MotionContext } from '../../hooks/useMotion';
/** No global motion switch in the design; respect the device preference automatically. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return <MotionContext value={{ paused: reduced, reduced }}>{children}</MotionContext>;
}
