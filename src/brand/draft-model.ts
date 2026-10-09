import tokens from '../tokens/apcosys.tokens.json' with { type: 'json' };

export type Theme = 'light' | 'dark';
export type ColorRole = keyof typeof tokens.colors;
export type TypeRole = 'Display' | 'Heading' | 'Section body' | 'Controls' | 'Eyebrow';
export type ScalarKind = 'typography' | 'spacing' | 'radii' | 'layout' | 'motion';
export const colorRoles = Object.keys(tokens.colors) as ColorRole[];
export const typeRoles: TypeRole[] = ['Display', 'Heading', 'Section body', 'Controls', 'Eyebrow'];
export const radiusRoles = Object.keys(tokens.radii) as (keyof typeof tokens.radii)[];
export const motionRoles = ['disclosure', 'theme'] as const;
export const storageKey = 'apcosys-design-draft-v2';
export const oldColorKey = 'apcosys-palette-draft-v1';
const hexPattern = /^#[a-f0-9]{6}$/i;
const validNumber = (value: unknown, min: number, max: number, step = 1) =>
 typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max && Math.abs(value / step - Math.round(value / step)) < 0.00001;

export interface DesignDraft {
 colors: Partial<Record<Theme, Partial<Record<ColorRole, string>>>>;
 typography: Partial<Record<TypeRole, number>>; // percent size preview scale
 spacing: Record<string, number>; // original spacing pixels mapped to edited pixels
 radii: Record<string, number>; // pixels
 layout: Record<string, number>; // maximum width
 motion: Record<string, number>; // durations in milliseconds
}
export const blank = (): DesignDraft => ({ colors: {}, typography: {}, spacing: {}, radii: {}, layout: {}, motion: {} });
export type DraftScope = 'colors' | ScalarKind;
export type ScalarSpec = { original: number; min: number; max: number; step: number };
export const scalarSpecs: Record<ScalarKind, Record<string, ScalarSpec>> = {
 typography: Object.fromEntries(typeRoles.map(role => [role, { original: 100, min: 70, max: 130, step: 5 }])),
 spacing: Object.fromEntries(tokens.spaces.map(n => [String(n), { original: n, min: 4, max: 240, step: 4 }])),
 radii: Object.fromEntries(radiusRoles.map(role => [role, { original: parseInt(tokens.radii[role], 10), min: 0, max: 32, step: 1 }])),
 layout: { maxWidth: { original: parseInt(tokens.layout.maxWidth, 10), min: 960, max: 2400, step: 8 } },
 motion: Object.fromEntries(motionRoles.map(role => [role, { original: parseInt(tokens.motions[role], 10), min: 80, max: 800, step: 20 }]))
};
export function validScalar(value: unknown, spec: ScalarSpec): value is number {
 return validNumber(value, spec.min, spec.max, spec.step);
}
const record = (value: unknown): Record<string, unknown> =>
 value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
export function sanitizeDraft(raw: unknown): DesignDraft {
 const result = blank(), source = record(raw), colors = record(source.colors);
 for (const theme of ['light', 'dark'] as const) for (const role of colorRoles) {
  const value = record(colors[theme])[role];
  if (typeof value === 'string' && hexPattern.test(value) && value.toLowerCase() !== tokens.colors[role][theme].toLowerCase())
   (result.colors[theme] ||= {})[role] = value.toUpperCase();
 }
 for (const kind of Object.keys(scalarSpecs) as ScalarKind[]) {
  const values = record(source[kind]);
  for (const [role, spec] of Object.entries(scalarSpecs[kind])) {
   const value = values[role];
   if (validScalar(value, spec) && value !== spec.original) (result[kind] as Record<string, number>)[role] = value;
  }
 }
 return result;
}
export const draftCount = (d: DesignDraft, section?: 'colors' | ScalarKind) => {
 const colors = colorRoles.reduce((sum, role) => sum + Number(Boolean(d.colors.light?.[role])) + Number(Boolean(d.colors.dark?.[role])),0);
 const count = (x: Record<string, unknown>) => Object.keys(x).length;
 if(section==='colors')return colors;
 if(section)return count(d[section]);
 return colors + count(d.typography) + count(d.spacing) + count(d.radii) + count(d.layout) + count(d.motion);
};
export function buildDraftCss(d: DesignDraft) {
 d = sanitizeDraft(d);
 const groups: string[] = [];
 for(const theme of ['light','dark'] as const){
  const lines=colorRoles.filter(role=>Boolean(d.colors[theme]?.[role])).map(role=>
   '  '+tokens.colors[role].css+': '+d.colors[theme]?.[role]+';');
  if(lines.length)groups.push((theme==='light'?':root:not([data-theme="dark"])':':root[data-theme="dark"]')+' {\n'+lines.join('\n')+'\n}');
 }
 const normalized: string[]=[];
 for(const px of tokens.spaces) if(d.spacing[String(px)]!==undefined)normalized.push('  --ds-space-'+px/4+': '+d.spacing[String(px)]+'px;');
 for(const role of radiusRoles) if(d.radii[role]!==undefined)normalized.push('  --ds-radius-'+role.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())+': '+d.radii[role]+'px;');
 if(d.layout.maxWidth!==undefined)normalized.push('  --ds-grid-max: '+d.layout.maxWidth+'px;');
 for(const role of motionRoles)if(d.motion[role]!==undefined)normalized.push('  --ds-duration-'+role+': '+d.motion[role]+'ms;');
 for(const role of typeRoles)if(d.typography[role]!==undefined)normalized.push('  --ds-type-'+role.toLowerCase().replace(/\s+/g,'-')+'-scale: '+(d.typography[role] as number)/100+';');
 if(normalized.length)groups.push('/* Portable --ds-* aliases; product components must opt in. */\n:root {\n'+normalized.join('\n')+'\n}');
 return '/* APCOSYS DESIGN DRAFT — source token files unchanged.\n * Theme colors use published semantic variables.\n * Portable --ds-* aliases are recommendations, not product CSS replacements.\n */\n'+groups.join('\n\n')+'\n';
}
export function buildDraftJson(d:DesignDraft){
 d = sanitizeDraft(d);
 const {verifiedAgainst, ...reference} = tokens;
 const colors = Object.fromEntries(colorRoles.map(role=>[role,{
  ...tokens.colors[role],
  light: d.colors.light?.[role] || tokens.colors[role].light,
  dark: d.colors.dark?.[role] || tokens.colors[role].dark,
 }]));
 return {
  ...reference,
  name: 'APCOSYS Design Tokens — Draft',
  draft: true,
  basedOnVersion: tokens.version,
  verificationStatus: 'unverified-draft',
  sourceReference: { verifiedAgainst, version: tokens.version },
  draftSchema: 'apcosys-draft-v3',
  overrides: d,
  colors,
  spaces: tokens.spaces.map(n=>d.spacing[String(n)]??n),
  radii: Object.fromEntries(radiusRoles.map(role=>[role,(d.radii[role]??parseInt(tokens.radii[role],10))+'px'])),
  layout: {...tokens.layout, ...(d.layout.maxWidth!==undefined?{maxWidth:d.layout.maxWidth+'px'}:{})},
  motions: {...tokens.motions, ...Object.fromEntries(motionRoles.filter(role=>d.motion[role]!==undefined).map(role=>[role,d.motion[role]+'ms']))},
  draftExtensions: { spacingTokens: Object.fromEntries(tokens.spaces.map(n => ['--ds-space-'+n/4, {original: n+'px', value: (d.spacing[String(n)]??n)+'px'}])), typographySizeScalePercent: {...d.typography}, notice:
   'Typography scale is a responsive preview extension, not a replacement for the published font-size CSS; integrate explicitly. Spacing/radii/layout/motion aliases must be adopted by consuming components.' }
 };
}
export function downloadDraft(content: string, filename: string, type: string) {
 const url=URL.createObjectURL(new Blob([content],{type}));
 const link=document.createElement('a');
 link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();
 window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
