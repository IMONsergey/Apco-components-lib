import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import tokens from '../tokens/apcosys.tokens.json';

export type Theme = 'light' | 'dark';
export type ColorRole = keyof typeof tokens.colors;
export type TypeRole = 'Display' | 'Heading' | 'Section body' | 'Controls' | 'Eyebrow';
export type ScalarKind = 'typography' | 'spacing' | 'radii' | 'layout' | 'motion';
export const colorRoles = Object.keys(tokens.colors) as ColorRole[];
export const typeRoles: TypeRole[] = ['Display', 'Heading', 'Section body', 'Controls', 'Eyebrow'];
export const radiusRoles = Object.keys(tokens.radii) as (keyof typeof tokens.radii)[];
export const motionRoles = ['disclosure', 'theme'] as const;
const storageKey = 'apcosys-design-draft-v2';
const oldColorKey = 'apcosys-palette-draft-v1';
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
const blank = (): DesignDraft => ({ colors: {}, typography: {}, spacing: {}, radii: {}, layout: {}, motion: {} });
function sanitize(raw: unknown): DesignDraft {
 const result = blank();
 if (!raw || typeof raw !== 'object') return result;
 const r = raw as Record<string, unknown>;
 const colors = r.colors as Record<string, Record<string, unknown>> | undefined;
 for (const theme of ['light','dark'] as const) {
  for (const role of colorRoles) {
   const v = colors?.[theme]?.[role];
   if (typeof v === 'string' && hexPattern.test(v) && v.toLowerCase() !== tokens.colors[role][theme].toLowerCase())
    (result.colors[theme] ||= {})[role] = v.toUpperCase();
  }
 }
 const t = r.typography as Record<string, unknown> | undefined;
 for (const role of typeRoles) if (validNumber(t?.[role], 70, 130, 5) && t?.[role] !== 100) result.typography[role] = t?.[role] as number;
 const spacing = r.spacing as Record<string, unknown> | undefined;
 for (const original of tokens.spaces) {
  const value = spacing?.[String(original)];
  if (validNumber(value, 4, 240, 4) && value !== original) result.spacing[String(original)] = value as number;
 }
 const radii = r.radii as Record<string, unknown> | undefined;
 for (const role of radiusRoles) {
  const v = radii?.[role];
  if (validNumber(v, 0, 32) && v !== parseInt(tokens.radii[role], 10)) result.radii[role] = v as number;
 }
 const max = (r.layout as Record<string, unknown> | undefined)?.maxWidth;
 if (validNumber(max, 960, 2400, 8) && max !== 1760) result.layout.maxWidth = max as number;
 const motion = r.motion as Record<string, unknown> | undefined;
 for (const role of motionRoles) {
  const v = motion?.[role];
  const original = parseInt(tokens.motions[role],10);
  if (validNumber(v, 80, 800, 20) && v !== original) result.motion[role] = v as number;
 }
 return result;
}
function readInitial(): DesignDraft {
 try {
  const saved=localStorage.getItem(storageKey);
  if (saved) return sanitize(JSON.parse(saved));
  const legacy=localStorage.getItem(oldColorKey);
  if (legacy) return sanitize({ colors: JSON.parse(legacy) });
 } catch { /* Storage unavailable or invalid; use immutable defaults. */ }
 return blank();
}
export const draftCount = (d: DesignDraft, section?: 'colors' | ScalarKind) => {
 const colors = colorRoles.reduce((sum, role) => sum + Number(Boolean(d.colors.light?.[role])) + Number(Boolean(d.colors.dark?.[role])),0);
 const count = (x: Record<string, unknown>) => Object.keys(x).length;
 if(section==='colors')return colors;
 if(section)return count(d[section]);
 return colors + count(d.typography) + count(d.spacing) + count(d.radii) + count(d.layout) + count(d.motion);
};
export function buildDraftCss(d: DesignDraft) {
 const groups: string[] = [];
 for(const theme of ['light','dark'] as const){
  const lines=colorRoles.filter(role=>Boolean(d.colors[theme]?.[role])).map(role=>
   '  '+tokens.colors[role].css+': '+d.colors[theme]?.[role]+';');
  if(lines.length)groups.push((theme==='light'?':root':':root[data-theme="dark"]')+' {\n'+lines.join('\n')+'\n}');
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
 const colors = Object.fromEntries(colorRoles.map(role=>[role,{
  ...tokens.colors[role],
  light: d.colors.light?.[role] || tokens.colors[role].light,
  dark: d.colors.dark?.[role] || tokens.colors[role].dark,
 }]));
 return {
  ...tokens,
  name: 'APCOSYS Design Tokens — Draft',
  draft: true,
  basedOnVersion: tokens.version,
  colors,
  spaces: tokens.spaces.map(n=>d.spacing[String(n)]??n),
  radii: Object.fromEntries(radiusRoles.map(role=>[role,(d.radii[role]??parseInt(tokens.radii[role],10))+'px'])),
  layout: {...tokens.layout, ...(d.layout.maxWidth!==undefined?{maxWidth:d.layout.maxWidth+'px'}:{})},
  motions: {...tokens.motions, ...Object.fromEntries(motionRoles.filter(role=>d.motion[role]!==undefined).map(role=>[role,d.motion[role]+'ms']))},
  draftExtensions: { typographySizeScalePercent: {...d.typography}, notice:
   'Typography scale is a responsive preview extension, not a replacement for the published font-size CSS; integrate explicitly. Spacing/radii/layout/motion aliases must be adopted by consuming components.' }
 };
}
export function downloadDraft(content: string, filename: string, type: string) {
 const url=URL.createObjectURL(new Blob([content],{type}));
 const link=document.createElement('a');
 link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();
 window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
interface DesignDraftContext {
 draft: DesignDraft;
 count: number;
 setColor:(theme:Theme,role:ColorRole,value:string)=>void;
 setScalar:(kind:ScalarKind,role:string,value:number)=>void;
 reset:(scope?:'colors' | ScalarKind)=>void;
 exportCss:()=>string;
 exportJson:()=>void;
}
const Context=createContext<DesignDraftContext|null>(null);
export function DesignDraftProvider({children}:{children:ReactNode}){
 const [draft,setDraft]=useState<DesignDraft>(readInitial);
 useEffect(()=>{
  try {if(draftCount(draft))localStorage.setItem(storageKey,JSON.stringify(draft));else localStorage.removeItem(storageKey);
   localStorage.removeItem(oldColorKey);
  } catch {/* local storage optional */}
 },[draft]);
 const value=useMemo<DesignDraftContext>(()=>({
  draft,count:draftCount(draft),
  setColor(theme,role,hex){
   if(!hexPattern.test(hex))return;
   setDraft(prev=>{
    const next:DesignDraft={...prev,colors:{...prev.colors,[theme]:{...prev.colors[theme]}}};
    if(hex.toLowerCase()===tokens.colors[role][theme].toLowerCase())delete next.colors[theme]?.[role];
    else (next.colors[theme] ||= {})[role]=hex.toUpperCase();
    return next;
   });
  },
  setScalar(kind,role,value){
   const candidate:DesignDraft= {...blank(),[kind]:{[role]:value}};
   if(!Object.prototype.hasOwnProperty.call(sanitize(candidate)[kind],role)){
    const original =
     kind==='typography'?100:
     kind==='spacing'?Number(role):
     kind==='radii'?parseInt(tokens.radii[role as keyof typeof tokens.radii],10):
     kind==='layout'?1760:
     parseInt(tokens.motions[role as keyof typeof tokens.motions],10);
    if(value!==original)return;
   }
   setDraft(prev=> {
    const next={...prev,[kind]:{...prev[kind]}} as DesignDraft;
    const records=next[kind] as Record<string,number>;
    const original=kind==='typography'?100:kind==='spacing'?Number(role):kind==='radii'?parseInt(tokens.radii[role as keyof typeof tokens.radii],10):kind==='layout'?1760:parseInt(tokens.motions[role as keyof typeof tokens.motions],10);
    if(value===original)delete records[role]; else records[role]=value;
    return next;
   });
  },
  reset(scope){
   setDraft(prev=>scope?{...prev,[scope]:scope==='colors'?{}:{}}:blank());
  },
  exportCss:()=>buildDraftCss(draft),
  exportJson:()=>downloadDraft(JSON.stringify(buildDraftJson(draft),null,2)+'\n','apcosys.tokens.draft.json','application/json'),
 }),[draft]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDesignDraft(){
 const ctx=useContext(Context);
 if(!ctx)throw new Error('useDesignDraft requires DesignDraftProvider');
 return ctx;
}
