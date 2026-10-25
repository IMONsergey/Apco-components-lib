export type VisualTone = 'light' | 'dark';
export type ChatState = 'idle' | 'thinking' | 'answer';

/** The preview and its copyable example share the same explicit component props. */
export function visualExampleProps({ tone, speed = 1, large = false, chatState = 'idle' }: {
  tone: VisualTone;
  speed?: number;
  large?: boolean;
  chatState?: ChatState;
}) {
  const dark = tone === 'dark';
  const shape = {
    speed: 0.75 * speed, strength: 0.65, fps: 30, opacity: 0.42,
    strokeWidth: 1.35, color: dark ? '#A8B5BA' : '#121314',
  };
  return {
    flow: { theme: tone, speed, fps: 30 },
    dots: { fps: 30, startOpacity: 0.55, endOpacity: 0.02, color: dark ? '#A9DCE2' : '#03879f' },
    globe: {
      speed: 0.85 * speed, fps: 30, renderer: 'canvas2d' as const, interactive: true,
      pixelRatio: 1.5, landColor: dark ? '#5FAFBC' : '#6AB6C2',
      shellColor: dark ? '#2E3B40' : '#FFFFFF', signalColor: dark ? '#42C0CF' : '#269CAD',
    },
    waves: { theme: tone, speed: 0.7 * speed },
    rosette: { kind: 'rosette' as const, ...shape },
    echo: { kind: 'echo' as const, ...shape },
    'ai-orb': { state: chatState, size: large ? 170 : 130 },
    'orb-cube': { size: large ? 185 : 145, speed, fps: 30, color: dark ? '#F6FAFB' : '#121314', label: 'Loading' },
  };
}

type VisualId = keyof ReturnType<typeof visualExampleProps>;
const visualComponents: Record<VisualId, { name: string; source: string }> = {
  flow: { name: 'TurquoiseFlow', source: './visuals/flow/TurquoiseFlow' },
  dots: { name: 'DotCascade', source: './visuals/dots/DotCascade' },
  globe: { name: 'SignalGlobe', source: './visuals/globe/SignalGlobe' },
  waves: { name: 'IceSphereWaves', source: './visuals/waves/IceSphereWaves' },
  rosette: { name: 'AnimatedShape', source: './visuals/shapes/AnimatedShape' },
  echo: { name: 'AnimatedShape', source: './visuals/shapes/AnimatedShape' },
  'ai-orb': { name: 'AIChatOrb', source: './visuals/uploads/ai-chat/AIChatOrb' },
  'orb-cube': { name: 'OrbCubeLoader', source: './visuals/uploads/orb-cube/OrbCubeLoader' },
};

export function visualExampleCode(id: string, tone: VisualTone, chatState: ChatState = 'idle'): string | undefined {
  if (!Object.hasOwn(visualComponents, id)) return undefined;
  const key = id as VisualId;
  const component = visualComponents[key];
  const props = visualExampleProps({ tone, speed: 1, large: true, chatState })[key];
  const attributes = Object.entries(props).map(([name, value]) =>
    value === true ? name : typeof value === 'string' ? `${name}=${JSON.stringify(value)}` : `${name}={${value}}`,
  );
  const element = attributes.length > 4
    ? `<${component.name}\n  ${attributes.join('\n  ')}\n/>`
    : `<${component.name} ${attributes.join(' ')} />`;
  return `import ${component.name} from '${component.source}';\n\n${element}`;
}
