import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { Menu, X, Search, Check, Plus, Minus, ArrowRight, ArrowDown } from 'lucide';
import { MorphIcon } from 'morphicons/react';
import { useClipboard } from '../hooks/useClipboard';
import ManualCopy from './ManualCopy';
import { href } from '../docs/navigation';
import { Icon, type IconName } from '../components/ui/Icon';
import { LibraryIcon } from '../components/system/LibraryIcon';
import type {IconBrowserState} from './icon-browser-state';
import registry from '../generated/icon-manifest.json';

type Family = 'apcosys' | 'feather' | 'phosphor';
type IconChoice = { family: Family; name: string };
const native: IconName[] = [
  'arrow','down','chevron','search','plus','minus','close','menu','previous',
  'external','focus','database','scanner','cube','book','bookmark','appearance',
  'play','pause','copy',
];
const families: {key:Family;label:string;notes:string}[] = [
  {key:'apcosys',label:'APCOSYS',notes:'16px grid · 1.5px stroke · product default'},
  {key:'feather',label:'Feather',notes:'24px grid · stroke normalized to 1.5px'},
  {key:'phosphor',label:'Phosphor',notes:'256px source grid · regular weight · fill-based'},
];
const spriteBaseUrl = import.meta.env.BASE_URL + 'icons/';
const all: Record<Family, readonly string[]> = {
  apcosys:native, feather:registry.feather, phosphor:registry.phosphor,
};

function MorphPairs(){
  const clipboard=useClipboard();
  const code='import { MorphIcon } from "morphicons/react";\nimport { Menu, X } from "lucide";\n<MorphIcon icon={open ? X : Menu} size={24} strokeWidth={1.5} reducedMotion="user" />';
  const pairs=[
    {name:'Navigation',a:Menu,b:X},
    {name:'Search / done',a:Search,b:Check},
    {name:'Expand / collapse',a:Plus,b:Minus},
    {name:'Direction',a:ArrowRight,b:ArrowDown},
  ] as const;
  const [states,setStates]=useState([false,false,false,false]);
  const [spring,setSpring]=useState<'smooth'|'snappy'|'bouncy'>('smooth');
  return <section className="ds-morph-panel">
    <div className="ds-section-bar">
      <div><h2>Morphicons</h2><p>Live icon transitions · motion only where a state changes</p></div>
      <a href="https://www.morphicons.com/" target="_blank" rel="noreferrer">morphicons.com <Icon name="external"/></a>
    </div>
    <div className="ds-morph-top">
      <span className="ds-label">Spring</span>
      <div className="ds-toggle-row">{(['smooth','snappy','bouncy'] as const).map(p=>
        <button type="button" key={p} data-active={spring===p} aria-pressed={spring===p} onClick={()=>setSpring(p)}>{p}</button>)}</div>
    </div>
    <div className="ds-morph-grid">
      {pairs.map((pair,i)=><button type="button" className="ds-morph-card" key={pair.name}
        aria-pressed={states[i]??false} onClick={()=>setStates(s=>s.map((v,j)=>j===i?!v:v))}>
        <MorphIcon icon={(states[i]??false)?pair.b:pair.a} spring={spring}
          strokeWidth={1.5} size={32} reducedMotion="user" />
        <span>{pair.name}</span>
      </button>)}
    </div>
    <div className="ds-code-line"><code>{'import { MorphIcon } from "morphicons/react";'}</code><button type="button" onClick={()=>void clipboard.copy(code)}>{clipboard.copiedId?'Copied':'Copy'}</button></div>
    {clipboard.manualValue!==null&&<ManualCopy value={clipboard.manualValue} label="Copy Morphicons code manually" onClose={clipboard.clear}/>}
    <p className="ds-caption">Morphicons is a transition engine, not a replacement for the icon assets. Lucide supplies stroke geometry; transitions respect reduced motion.</p>
  </section>;
}

export default function IconsPage({initialFamily='',state,onStateChange}:{initialFamily?:string;state:IconBrowserState;onStateChange:Dispatch<SetStateAction<IconBrowserState>>}){
  const {family,search,size,stroke,limit}=state;
  const setFamily=(value:Family)=>onStateChange(previous=>({...previous,family:value}));
  const setSearch=(value:string)=>onStateChange(previous=>({...previous,search:value}));
  const setSize=(value:number)=>onStateChange(previous=>({...previous,size:value}));
  const setStroke=(value:number)=>onStateChange(previous=>({...previous,stroke:value}));
  const setLimit=(value:number|((previous:number)=>number))=>onStateChange(previous=>({...previous,limit:typeof value==='function'?value(previous.limit):value}));
  useEffect(()=>{
   onStateChange(previous=>{
    if(previous.route===initialFamily)return previous;
    const [requestedFamily,requestedIcon]=initialFamily.split('/');
    const family=(requestedFamily==='feather'||requestedFamily==='phosphor'||requestedFamily==='apcosys')?requestedFamily:previous.family;
    const valid=Boolean(requestedIcon&&all[family].includes(requestedIcon));
    const sameFamily=family===previous.family;
    return {...previous,route:initialFamily,family,search:valid?requestedIcon!:sameFamily?previous.search:'',limit:sameFamily?previous.limit:72};
   });
   const [source,name]=initialFamily.split('/');
   const validSource=source==='apcosys'||source==='feather'||source==='phosphor';
   setSelected(validSource&&name&&all[source].includes(name)?{family:source,name}:null);clear();
  },[initialFamily,onStateChange]);
  const [selected,setSelected]=useState<IconChoice|null>(null);
  const [copyTarget,setCopyTarget]=useState<IconChoice|null>(null);
  const {manualValue:manualCode,copy,clear}=useClipboard(family+':'+size+':'+stroke+':'+search);
  const copyFallback=manualCode!==null?copyTarget:null;
  const names=useMemo(()=>all[family].filter(name=>name.toLowerCase().includes(search.trim().toLowerCase())),[family,search]);
  const visible=names.slice(0,limit);
  const sourceCode=(item:IconChoice)=>{
    if(item.family==='apcosys')return `<Icon name="${item.name}" width={${size}} height={${size}} strokeWidth={${stroke}} />`;
    return `<LibraryIcon family="${item.family}" name="${item.name}" size={${size}}${item.family==='feather'?` stroke={${stroke}}`:""} />`;
  };
  return <div className="ds-icons-page">
    <div id="docs-icon-library" className="ds-section-bar"><h2>Browse icons</h2></div>
    <div className="ds-icon-toolbar">
      <div className="ds-toggle-row ds-icon-families" role="group" aria-label="Icon families">{families.map(f=><button key={f.key} type="button" data-active={family===f.key} aria-pressed={family===f.key} aria-label={f.label+', '+all[f.key].length+' icons'}
        onClick={()=>{setFamily(f.key);setSelected(null);clear();setSearch('');setLimit(72);window.location.hash=href('icons',f.key)}}><span className="ds-icon-family-name">{f.label}</span><small className="ds-icon-family-count" aria-hidden="true">{all[f.key].length}</small></button>)}</div>
      <input type="search" aria-label="Search icons" placeholder="Find an icon..." value={search} onChange={e=>{setSearch(e.target.value);setLimit(72)}}/>
    </div>
    <div id="docs-icon-options" className="ds-icon-settings"><div className="ds-icon-options">
      <span>{families.find(f=>f.key===family)?.notes}</span>
      <label>Size <select aria-label="Icon size" value={size} onChange={e=>setSize(Number(e.target.value))}>
        {[16,20,24,32].map(n=><option key={n} value={n}>{n}px</option>)}</select></label>
      <label>Stroke <select aria-label="Icon stroke width" value={stroke} onChange={e=>setStroke(Number(e.target.value))} disabled={family==='phosphor'}>
        {[1,1.5,2].map(n=><option key={n} value={n}>{n}px</option>)}</select></label>
    </div></div>
    <div className="ds-icon-catalog" role="group" aria-label={family+' icons'}>
      {visible.map(name=><div className="ds-icon-cell" key={name}>
        <button type="button" className="ds-icon-tile" data-selected={selected?.family===family&&selected.name===name}
          aria-label={name} title={'Copy '+name+' code'}
          onClick={async()=>{
            setCopyTarget({family,name});
            await copy(sourceCode({family,name}),family+'/'+name);
          }}>
          <LibraryIcon family={family} name={name} size={size} stroke={stroke} spriteBaseUrl={spriteBaseUrl}/>
          <span>{name}</span>
        </button>
        {copyFallback?.family===family&&copyFallback.name===name&&
          <div className="ds-icon-copy-fallback" role="status">
            <span>Clipboard unavailable. Select to copy:</span>
            <input readOnly aria-label="Icon JSX code" value={sourceCode({family,name})}
              onFocus={e=>e.currentTarget.select()} onClick={e=>e.currentTarget.select()}/>
            <button type="button" onClick={clear} aria-label="Close copy fallback"><Icon name="close"/></button>
          </div>}
      </div>)}
    </div>
    {names.length===0&&<div className="ds-caption ds-empty">No icons found.
      <button type="button" onClick={()=>setSearch('')}>Clear search</button>
    </div>}
    {names.length>limit&&<button className="ds-load-more" type="button" onClick={()=>setLimit(v=>v+72)}>Show more · {names.length-limit} remaining</button>}
    <section className="ds-icon-reference" id="docs-icon-states"><div className="ds-icon-states">
      <div className="ds-section-bar"><div><h2>States</h2><p>Color is semantic. Stroke and icon silhouette stay consistent.</p></div></div>
      <div className="ds-state-grid">
        {(['Default','Hover','Active','Disabled','Inverse'] as const).map((state,i)=>
          <div className={'ds-icon-state ds-icon-state--'+state.toLowerCase()} key={state}>
            <LibraryIcon family={family} name={family==='phosphor'?'magnifying-glass':'search'} size={24} stroke={1.5} spriteBaseUrl={spriteBaseUrl}/>
            <span>{state}</span><code>{['--ink','--action-hover','--action','--muted','--on-action'][i]}</code>
          </div>)}
      </div>
      <p className="ds-caption">Phosphor is fill-based: stroke weight does not apply. Use native APCOSYS for navigation and Feather for new stroke-based product icons. Reserve Phosphor for clearly defined alternative families.</p>
    </div>
    </section>
    <section className="ds-icon-reference ds-icon-reference--morph" id="docs-icon-morph"><MorphPairs/></section>
  </div>;
}
