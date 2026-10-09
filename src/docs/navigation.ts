import { catalog } from '../catalog';
import tokens from '../tokens/apcosys.tokens.json';

export type Section = 'overview'|'foundations'|'components'|'icons'|'guidelines';
export type DocRoute={section:Section;slug:string};
const allowed:Section[]=['overview','foundations','components','icons','guidelines'];
export function parseRoute(hash:string):DocRoute {
 const [section, ...rest] = hash.replace(/^#\/?/,'').split('/');
 const name = allowed.includes(section as Section)?section as Section:'overview';
 return {section:name,slug:rest.join('/')};
}
export function href(section:Section,slug=''):string{
 return '#'+section+(slug?'/'+slug:'');
}
export type NavItem={label:string;route:string;keywords?:string};
export const sections:{id:Section;label:string;items:NavItem[]}[]=[
 {id:'overview',label:'Overview',items:[]},
 {id:'foundations',label:'Foundations',items:[
  {label:'Identity',route:href('foundations','identity')},
  {label:'Color tokens',route:href('foundations','colors')},
  {label:'Typography',route:href('foundations','typography')},
  {label:'Spacing & radii',route:href('foundations','spacing')},
  {label:'Layout & responsive',route:href('foundations','layout')},
  {label:'Motion',route:href('foundations','motion')},
 ]},
 {id:'components',label:'Components',items:[
  {label:'All components',route:href('components')},
  {label:'Controls & interface',route:href('components','interface')},
  {label:'Product motion',route:href('components','product')},
  {label:'Visual engines',route:href('components','visual')},
 ]},
 {id:'icons',label:'Iconography',items:[
  {label:'All icons',route:href('icons')},
  {label:'APCOSYS / Native',route:href('icons','apcosys')},
  {label:'Feather',route:href('icons','feather')},
  {label:'Phosphor',route:href('icons','phosphor')},
 ]},
 {id:'guidelines',label:'Guidelines',items:[
  {label:'Implementation rules',route:href('guidelines')},
  {label:'Usage patterns',route:href('guidelines','usage')},
  {label:'Integration',route:href('guidelines','integration')},
 ]},
];
export const sourceRoutes:NavItem[]=[
 {label:'Overview',route:href('overview'),keywords:'start home index design system'},
 ...sections.filter(section=>section.id!=='overview').flatMap(section=>[
  {label:section.label,route:href(section.id),keywords:section.id},
  ...section.items
 ]),
 ...catalog.map(item=>({
  label:item.name,route:href('components',item.id),
  keywords:item.group+' '+item.tech+' '+item.description,
 })),
 ...Object.entries(tokens.colors).map(([key,v])=>({
  label:key+' · '+v.css,route:href('foundations','colors'),
  keywords:'token '+v.usage+' '+v.light+' '+v.dark,
 })),
];
export const sectionTitles:Record<Section,string>={
 overview:'Design system',foundations:'Foundations',components:'Components',
 icons:'Icons',guidelines:'Guidelines',
};
export const toc:{[K in Section]:Array<{label:string;id:string}>}={
 overview:[{label:'Explore',id:'docs-explore'},{label:'Principles',id:'docs-principles'}],
 foundations:[
  {label:'Identity',id:'ds-identity'},{label:'Colors',id:'ds-colors'},
  {label:'Typography',id:'ds-type'},{label:'Spacing',id:'ds-spacing'},
  {label:'Layout',id:'ds-layout'},{label:'Motion',id:'ds-motion'},
 ],
 components:[],icons:[
  {label:'Browse icons',id:'docs-icon-library'},
  {label:'Icon families',id:'docs-icon-options'},
 ],guidelines:[
  {label:'Rules',id:'docs-guideline-rules'},
  {label:'Code examples',id:'docs-guideline-patterns'},
 ],
};
