import { useEffect, useRef } from 'react';

const MODES = {
  idle: { speed: 1.1, flow: 1.25, pulse: 0, eddy: 0 },
  thinking: { speed: 2.1, flow: 2.25, pulse: 0, eddy: 1 },
  answer: { speed: 1.6, flow: 1.55, pulse: 1, eddy: 0.3 },
};

// Coefficients of the continuous colour field. No image assets are required.
const FIELD = [[4647.9,-552.81,-1151.25],[565.61,219.58,126.37],[45.73,23.32,24.78],[10.53,-0.91,-3.2],[-60.74,-18.52,-11.65],[-12.38,-3.03,-2.58],[-48.68,-14.15,-9.34],[-13.91,-3.78,-2.19],[-45.41,-14.04,-9.44],[12.75,1.05,-1.29],[-181.58,-75.16,-57.4],[1353.55,641.01,496.45],[-12307.22,-6897.95,-5342.7],[218.52,163.93,115.35],[-114.01,-3.01,20.67],[-51.67,-24.59,-20.05],[-53.68,-14.86,-10.15],[29.49,7.41,4.99],[0.66,-2.2,-2.22],[27.74,4.41,2.52],[2.62,-3.13,-3.29],[1.91,-0.98,-1.37],[-16.79,-1.26,1.89],[9.88,-6.17,-8.82],[-303.55,-87.26,-56.65],[2436.66,978.47,713.16],[19.34,-6.61,3.24],[-19.35,-13.23,-13.67],[-13.09,-4.11,-3.73],[45.9,13.0,9.89],[-32.86,-10.11,-7.5],[-28.18,-4.68,-1.43],[-69.29,-13.46,-8.58],[-58.72,-8.44,-2.75],[15.33,0.64,-0.62],[-14.62,-4.01,-3.14],[24.82,8.55,7.99],[-62.03,-25.36,-21.37],[-126.5,-52.37,-36.46],[5.45,1.98,-1.72],[-26.34,-4.05,-1.38],[16.46,2.61,1.91],[-54.93,-14.59,-10.15],[-42.7,-10.44,-6.58],[-88.2,-23.5,-16.66],[-24.29,-7.63,-4.36],[-74.34,-17.07,-12.25],[-54.75,-9.3,-4.04],[-12.83,-5.71,-4.27],[0.51,0.96,-0.1],[-4.08,-1.55,1.12],[10.02,5.35,1.16],[-47.6,-13.06,-7.33],[23.04,3.59,1.71],[-34.81,-11.27,-8.07],[-15.79,-1.57,-0.25],[-75.42,-23.09,-16.26],[-15.6,-2.02,-0.11],[-92.43,-26.41,-19.29],[-25.9,-10.17,-6.24],[-69.53,-12.52,-7.79],[-52.59,-9.91,-5.39],[-8.86,-4.27,-2.6],[-0.87,-0.23,-1.19],[-28.55,-10.69,-6.14],[-20.01,-2.22,-1.6],[18.57,-1.37,-2.11],[-60.35,-7.43,-2.84],[-0.44,-2.04,-1.68],[-72.1,-18.28,-12.4],[-94.63,-40.35,-31.88],[-20.68,-2.55,-0.14],[-89.11,-22.97,-16.47],[-40.15,-13.03,-8.75],[-81.99,-21.65,-14.6],[-25.25,-5.41,-3.99],[5.23,0.7,1.67],[-16.96,-5.66,-5.3],[-20.74,-9.38,-6.17],[-13.33,-4.36,-3.62],[-17.2,0.54,2.15],[-64.11,-11.76,-6.58],[15.52,6.3,5.36],[-60.9,-11.9,-6.56],[-99.67,-41.05,-32.48],[-54.68,-18.56,-12.78],[-63.34,-18.39,-13.21],[-71.76,-11.49,-5.89],[-42.81,-16.33,-11.49],[20.82,8.47,5.49],[-48.4,-17.35,-11.69],[-14.84,-2.72,-1.36],[4.98,-1.45,-1.98],[-56.27,-7.68,-3.28],[1.44,2.13,2.31],[-89.97,-15.82,-9.08],[6.49,0.0,-0.23],[-15.72,10.8,11.66],[-47.16,-10.68,-6.94],[-56.01,-11.95,-7.22],[-16.07,-11.46,-9.31],[-92.3,-17.77,-11.04],[12.59,-1.87,-1.36],[-22.43,-5.45,-4.09],[-60.08,-20.38,-14.37],[24.94,3.25,1.7],[-40.58,-6.54,-3.37],[-35.95,-4.03,-1.17],[-0.75,1.63,2.1],[-77.82,-13.52,-7.23],[-40.1,-18.43,-14.33],[-36.12,-4.93,-2.26],[-14.01,-2.65,-1.05],[-69.29,-12.85,-7.56],[-16.62,-10.49,-7.93],[24.41,8.3,5.54],[-55.47,-15.53,-10.67],[20.02,17.57,14.49],[-39.51,-16.08,-12.11],[21.91,4.01,2.07],[-64.15,-13.19,-7.49],[-32.23,-3.49,-1.28],[-18.4,-3.9,-2.17],[-15.58,2.94,3.72],[-45.84,-14.78,-10.2],[-49.86,-6.58,-2.97],[-40.81,-17.54,-13.45],[40.44,12.27,8.7],[-56.95,-13.36,-8.39],[13.04,-6.17,-5.1],[36.59,-13.43,-13.76],[-66.25,-9.86,-4.04],[12.55,-1.33,-1.69],[11.28,-1.29,-1.78],[-40.34,-10.07,-6.69],[-46.56,-11.61,-7.29],[-54.05,-16.39,-11.18],[-31.18,-3.15,-1.24],[-8.32,-6.0,-4.44],[37.23,11.73,8.63],[-12.56,0.84,1.68],[-56.56,-30.64,-23.6],[67.29,35.83,24.57],[1123.86,372.49,244.9],[-154.63,-58.29,-43.54],[-50.11,-2.75,-0.62],[-14.76,-5.01,-3.45],[8.34,0.47,0.6],[4.24,-0.01,-0.98],[4.26,2.89,2.59],[5.44,-3.84,-3.75],[12.73,4.7,3.53],[-43.7,-12.72,-8.87],[-65.99,-28.95,-22.43],[-32.28,-8.64,-9.24],[455.11,184.42,139.38],[-3969.36,-1812.09,-1052.4],[991.3,283.59,184.9],[-56.39,-42.85,-28.43],[-5.31,2.18,0.58],[-30.23,-10.89,-8.01],[-16.87,-4.47,-2.52],[-23.12,-9.21,-6.67],[-13.25,-0.77,0.25],[-38.45,-12.75,-8.54],[6.84,0.29,-0.54],[93.76,33.72,26.57],[464.11,190.7,139.65],[317.01,116.28,410.14]];
const SOURCE_SIZE = 256;
let cachedField;

function getColourField() {
  if (cachedField) return cachedField;

  const count = 13;
  const sigma = 0.13;
  const basis = new Float64Array(SOURCE_SIZE * count);
  for (let x = 0; x < SOURCE_SIZE; x++) {
    for (let j = 0; j < count; j++) {
      const delta = (2 * x / (SOURCE_SIZE - 1) - 1) - (-1 + 2 * j / (count - 1));
      basis[x * count + j] = Math.exp(-delta * delta / (2 * sigma * sigma));
    }
  }

  const rows = new Float64Array(SOURCE_SIZE * count * 3);
  for (let y = 0; y < SOURCE_SIZE; y++) {
    for (let j = 0; j < count; j++) {
      for (let i = 0; i < count; i++) {
        const weight = FIELD[i * count + j];
        const factor = basis[y * count + i];
        const offset = (y * count + j) * 3;
        for (let channel = 0; channel < 3; channel++) {
          rows[offset + channel] += factor * weight[channel];
        }
      }
    }
  }

  const pixels = new Uint8ClampedArray(SOURCE_SIZE * SOURCE_SIZE * 4);
  for (let y = 0; y < SOURCE_SIZE; y++) {
    for (let x = 0; x < SOURCE_SIZE; x++) {
      const rgb = [248, 252, 252];
      for (let j = 0; j < count; j++) {
        const factor = basis[x * count + j];
        const offset = (y * count + j) * 3;
        for (let channel = 0; channel < 3; channel++) {
          rgb[channel] += factor * rows[offset + channel];
        }
      }
      const offset = (y * SOURCE_SIZE + x) * 4;
      pixels[offset] = rgb[0];
      pixels[offset + 1] = rgb[1];
      pixels[offset + 2] = rgb[2];
      pixels[offset + 3] = 255;
    }
  }
  cachedField = pixels;
  return pixels;
}

function createAnimator(canvas, shell, resolution, initialMode) {
  const context = canvas.getContext('2d');
  if (!context) return { setMode() {}, destroy() {} };

  canvas.width = canvas.height = resolution;
  const source = getColourField();
  const output = context.createImageData(resolution, resolution);
  const geometry = new Float32Array(resolution * resolution * 3);
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const nx = 2 * x / (resolution - 1) - 1;
      const ny = 2 * y / (resolution - 1) - 1;
      const offset = (y * resolution + x) * 3;
      const rim = Math.max(0, 1 - nx * nx - ny * ny);
      geometry[offset] = nx;
      geometry[offset + 1] = ny;
      geometry[offset + 2] = rim * rim * rim;
    }
  }

  let mode = initialMode;
  let target = MODES[mode];
  let { speed, flow, pulse, eddy } = target;
  let phase = 0;
  let last = 0;
  let frame = 0;
  let visible = true;
  let destroyed = false;
  let entryAnimation = null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function draw(t) {
    const swirl = (0.30 * Math.sin(t) + 0.10 * Math.sin(t * 1.7)) * flow;
    const driftX = 0.13 * Math.sin(t * 0.73) * flow;
    const driftY = 0.10 * Math.sin(t * 1.13) * flow;
    const wave = 0.12 * Math.sin(t * 0.91) * flow;
    const breath = pulse * (0.20 * Math.sin(t * 4) + 0.055 * Math.sin(t * 7));
    const ripple = eddy * 0.24 * Math.sin(t * 2.3);
    const stretch = pulse * 0.13 * Math.sin(t * 2.7);
    const curl = eddy * 0.18 * Math.cos(t * 1.4);
    const destination = output.data;

    for (let k = 0; k < resolution * resolution; k++) {
      const x = geometry[k * 3];
      const y = geometry[k * 3 + 1];
      const fade = geometry[k * 3 + 2];
      const u = x + fade * (-y * swirl + driftX + (wave + ripple) * x * y + x * (breath + stretch) + curl * (y * y - 0.22));
      const v = y + fade * (x * swirl + driftY + (wave - ripple) * (y * y - x * x) * 0.5 + y * (breath - stretch) - curl * x * y);
      const sx = Math.max(0, Math.min(SOURCE_SIZE - 1.001, (u + 1) * (SOURCE_SIZE - 1) * 0.5));
      const sy = Math.max(0, Math.min(SOURCE_SIZE - 1.001, (v + 1) * (SOURCE_SIZE - 1) * 0.5));
      const ix = sx | 0;
      const iy = sy | 0;
      const fx = sx - ix;
      const fy = sy - iy;
      const a = (iy * SOURCE_SIZE + ix) * 4;
      const b = a + 4;
      const c = a + SOURCE_SIZE * 4;
      const d = c + 4;
      const offset = k * 4;
      const wa = (1 - fx) * (1 - fy);
      const wb = fx * (1 - fy);
      const wc = (1 - fx) * fy;
      const wd = fx * fy;
      for (let channel = 0; channel < 3; channel++) {
        destination[offset + channel] = source[a + channel] * wa + source[b + channel] * wb + source[c + channel] * wc + source[d + channel] * wd;
      }
      destination[offset + 3] = 255;
    }
    context.putImageData(output, 0, 0);
  }

  function canRun() {
    return !destroyed && visible && !document.hidden && !reduced.matches;
  }

  function stop() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  }

  function tick(now) {
    frame = 0;
    if (!canRun()) { last = 0; return; }
    if (!last) last = now;
    const elapsed = (now - last) / 1000;
    if (elapsed >= 1 / 30) {
      const dt = Math.min(elapsed, 0.07);
      const ease = 1 - Math.exp(-dt * 3);
      speed += (target.speed - speed) * ease;
      flow += (target.flow - flow) * ease;
      pulse += (target.pulse - pulse) * ease;
      eddy += (target.eddy - eddy) * ease;
      phase += dt * speed;
      draw(phase);
      last = now;
    }
    frame = window.requestAnimationFrame(tick);
  }

  function syncPlayback() {
    if (canRun()) {
      if (!frame) frame = window.requestAnimationFrame(tick);
      if (entryAnimation?.playState === 'paused') entryAnimation.play();
    } else {
      stop();
      if (entryAnimation?.playState === 'running') entryAnimation.pause();
    }
  }

  function markEntry(nextMode) {
    const from = window.getComputedStyle(shell).transform;
    entryAnimation?.cancel();
    entryAnimation = null;
    if (reduced.matches || typeof shell.animate !== 'function') return;
    const depth = nextMode === 'thinking' ? 0.94 : 0.91;
    const frames = nextMode === 'idle'
      ? [{ transform: from }, { transform: 'scale(1)' }]
      : [
          { transform: from, offset: 0, easing: 'cubic-bezier(.4,0,.2,1)' },
          { transform: `scale(${depth})`, offset: 0.28, easing: 'cubic-bezier(.22,0,.2,1)' },
          { transform: 'scale(1)', offset: 1 },
        ];
    entryAnimation = shell.animate(frames, {
      duration: nextMode === 'idle' ? 240 : nextMode === 'thinking' ? 720 : 850,
      fill: 'none',
    });
    if (!canRun()) entryAnimation.pause();
  }

  function onReducedMotionChange() {
    if (reduced.matches) {
      entryAnimation?.cancel();
      entryAnimation = null;
      phase = 0;
      draw(0);
    }
    syncPlayback();
  }

  const observer = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncPlayback(); })
    : null;
  observer?.observe(shell);
  document.addEventListener('visibilitychange', syncPlayback);
  reduced.addEventListener('change', onReducedMotionChange);
  draw(0);
  syncPlayback();

  return {
    setMode(nextMode) {
      if (nextMode === mode) return;
      mode = nextMode;
      target = MODES[mode];
      markEntry(mode);
      syncPlayback();
    },
    destroy() {
      destroyed = true;
      stop();
      entryAnimation?.cancel();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      reduced.removeEventListener('change', onReducedMotionChange);
    },
  };
}

/**
 * Controlled state; this component does not infer network or chat status.
 * idle: no request is pending and no response is being streamed.
 * thinking: a request has started; waiting for the first response content.
 * answer: response content is being streamed or spoken.
 * Return to idle when the response ends, errors, or is cancelled.
 * @param {{ state?: 'idle' | 'thinking' | 'answer', size?: number,
 *   className?: string, style?: import('react').CSSProperties,
 *   label?: string, decorative?: boolean }} props
 */
export default function AIChatOrb({
  state = 'idle', size = 48,
  className, style, label = 'AI assistant', decorative = false,
}) {
  const shellRef = useRef(null);
  const canvasRef = useRef(null);
  const animatorRef = useRef(null);
  const mode = Object.hasOwn(MODES, state) ? state : 'idle';
  const diameter = Number.isFinite(size) ? Math.max(1, size) : 48;
  const latest = useRef({ mode });
  latest.current = { mode };

  useEffect(() => {
    const resolution = Math.max(32, Math.min(256, Math.round(diameter * Math.min(window.devicePixelRatio || 1, 2))));
    const animator = createAnimator(canvasRef.current, shellRef.current, resolution, latest.current.mode);
    animatorRef.current = animator;
    return () => { animator.destroy(); animatorRef.current = null; };
  }, [diameter]);

  useEffect(() => { animatorRef.current?.setMode(mode); }, [mode]);

  return (
    <span
      ref={shellRef}
      className={className}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      style={{ ...style, display: 'inline-block', width: diameter, height: diameter, flexShrink: 0, verticalAlign: 'middle', lineHeight: 0 }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: 'block', width: '100%', height: '100%', borderRadius: '50%' }}
      />
    </span>
  );
}
