import { catalog } from '../catalog';
import tokens from '../tokens/apcosys.tokens.json';
import iconRegistry from '../generated/icon-manifest.json';

export type Section='overview'|'foundations'|'components'|'icons'|'guidelines';
export type DocRoute={section:Section;slug:string};
const allowed:Section[]=['overview','foundations','components','icons','guidelines'];
export function parseRoute(hash:string):DocRoute{
 const [section,...rest]=hash.replace(/^#\/?/,'').split('/');
 const name=allowed.includes(section as Section)?section as Section:'overview';
 return {section:name,slug:rest.join('/')};
}
export function href(section:Section,slug=''):string{return '#'+section+(slug?'/'+slug:'')}
export type NavItem={label:string;route:string;keywords?:string};
export const sections:{id:Section;label:string;items:NavItem[]}[]=[
 {id:'overview',label:'Home',items:[]},
 {id:'foundations',label:'Brand styles',items:[
  {label:'Logo',route:href('foundations','identity'),keywords:'identity brand mark'},
  {label:'Colors',route:href('foundations','colors'),keywords:'palette swatches dark light color tokens'},
  {label:'Typography',route:href('foundations','typography'),keywords:'text styles fonts'},
  {label:'Spacing',route:href('foundations','spacing'),keywords:'gaps radius corners'},
  {label:'Layout',route:href('foundations','layout'),keywords:'grid responsive screen breakpoints'},
  {label:'Animations',route:href('foundations','motion'),keywords:'motion transitions'},
 ]},
 {id:'components',label:'Components',items:[
  {label:'All components',route:href('components')},
 ]},
 {id:'icons',label:'Icons',items:[
  {label:'All icons',route:href('icons')},
 ]},
 {id:'guidelines',label:'Guides',items:[
  {label:'Best practices',route:href('guidelines')},
  {label:'Examples',route:href('guidelines','usage')},
  {label:'For developers',route:href('guidelines','integration')},
 ]},
];
export const sourceRoutes:NavItem[]=[
 {label:'Home',route:href('overview'),keywords:'start overview library'},
 ...sections.filter(section=>section.id!=='overview').flatMap(section=>[
  {label:section.label,route:href(section.id),keywords:section.id},
  ...section.items
 ]),
 ...catalog.map(item=>({
  label:item.name,route:href('components',item.id),
  keywords:item.group+' '+item.tech+' '+item.description,
 })),
 ...Object.entries({
  apcosys:['arrow','down','chevron','search','plus','minus','close','menu','previous','external','focus','database','scanner','cube','book','bookmark','appearance','play','pause','copy'],
  feather:iconRegistry.feather,
  phosphor:iconRegistry.phosphor,
 }).flatMap(([family,names])=>names.map(name=>({
  label:name,route:href('icons',family+'/'+name),
  keywords:'icon '+family+' '+name.replace(/-/g,' ')+' symbol',
 }))),
 ...Object.entries(tokens.colors).map(([key,v])=>({
  label:key+' color',route:href('foundations','colors'),
  keywords:'palette '+key+' '+v.css+' '+v.usage+' '+v.light+' '+v.dark,
 })),
];
export const sectionTitles:Record<Section,string>={
 overview:'Home',foundations:'Brand styles',components:'Components',
 icons:'Icons',guidelines:'Guides'
};
export const toc:{[K in Section]:Array<{label:string;id:string}>}={
 overview:[],
 foundations:[
  {label:'Logo',id:'ds-identity'},{label:'Colors',id:'ds-colors'},
  {label:'Typography',id:'ds-type'},{label:'Spacing',id:'ds-spacing'},
  {label:'Layout',id:'ds-layout'},{label:'Animations',id:'ds-motion'}
 ],
 components:[],icons:[{label:'Browse icons',id:'docs-icon-library'},{label:'Options',id:'docs-icon-options'}],
 guidelines:[{label:'Best practices',id:'docs-guideline-rules'},{label:'Examples',id:'docs-guideline-patterns'}]
};
