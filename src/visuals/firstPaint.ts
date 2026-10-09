type PaintStats = { supported: boolean; frames?: number };

/** Report a real engine paint, including when the first usable size arrives later. */
export function observeFirstPaint(
  canvas: HTMLCanvasElement,
  controller: { getStats(): PaintStats },
  onReady?: (ready: boolean) => void,
) {
  let frame = 0;
  const check = () => {
    const stats = controller.getStats();
    if (!stats.supported || (stats.frames ?? 0) > 0) {
      canvas.dataset.renderReady = stats.supported ? 'frame' : 'fallback';
      onReady?.(true);
    } else {
      frame = requestAnimationFrame(check);
    }
  };
  frame = requestAnimationFrame(check);
  return () => {
    cancelAnimationFrame(frame);
    delete canvas.dataset.renderReady;
    onReady?.(false);
  };
}
