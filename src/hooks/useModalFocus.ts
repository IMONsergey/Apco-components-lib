import { useEffect, useRef, type RefObject } from 'react';

/** Focus and scrolling for the two documentation overlays; production components stay separate. */
export function useModalFocus(active: boolean, ref: RefObject<HTMLElement | null>, initialSelector: string) {
 const restore = useRef(true);
 useEffect(() => {
  if (!active || !ref.current) return;
  const node = ref.current;
  const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const overflow = document.body.style.overflow;
  restore.current = true;
  document.body.style.overflow = 'hidden';
  const focusable = () => Array.from(node.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex="0"]'))
   .filter(el => el.tabIndex >= 0 && el.getClientRects().length > 0 && !el.closest('[inert]'));
  const frame = requestAnimationFrame(() => (node.querySelector<HTMLElement>(initialSelector) || focusable()[0] || node).focus());
  const key = (event: KeyboardEvent) => {
   if (event.key !== 'Tab') return;
   const targets = focusable(), first = targets[0], last = targets.at(-1);
   if (!first || !last) { event.preventDefault(); node.focus(); return; }
   if (event.shiftKey && (document.activeElement === first || !node.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
   else if (!event.shiftKey && (document.activeElement === last || !node.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
  };
  node.addEventListener('keydown', key);
  return () => {
   cancelAnimationFrame(frame);
   node.removeEventListener('keydown', key);
   document.body.style.overflow = overflow;
   const target = restore.current ? previous : document.getElementById('docs-content');
   if (target?.isConnected) target.focus({preventScroll: true});
  };
 }, [active, ref, initialSelector]);
 return restore;
}
