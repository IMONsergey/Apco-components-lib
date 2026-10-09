import { useEffect, useMemo, useState } from 'react';
import { Menu, X, Search, Check, Plus, Minus, ArrowRight, ArrowDown } from 'lucide';
import { MorphIcon } from 'morphicons/react';
import type { IconName } from '../components/ui/Icon';
import { LibraryIcon } from '../components/system/LibraryIcon';
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

async function copyText(value:string) {
  try { await navigator.clipboard.writeText(value); } catch { /* clipboard permission */ }
}

function MorphPairs(){
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
      <a href="https://www.morphicons.com/" target="_blank" rel="noreferrer">morphicons.com ↗</a>
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
    <div className="ds-code-line"><code>{'import { MorphIcon } from "morphicons/react";'}</code><button onClick={()=>void copyText('import { MorphIcon } from "morphicons/react";\nimport { Menu, X } from "lucide";\n<MorphIcon icon={open ? X : Menu} size={24} strokeWidth={1.5} reducedMotion="user" />')}>Copy</button></div>
    <p className="ds-caption">Morphicons is a transition engine, not a replacement for the icon assets. Lucide supplies stroke geometry; transitions respect reduced motion.</p>
  </section>;
}

export default function IconsPage({initialFamily}:{initialFamily?:string}){
  useEffect(()=>{
   const [requestedFamily,requestedIcon]=initialFamily?.split('/')??[];
   const family=(requestedFamily==='feather'||requestedFamily==='phosphor'||requestedFamily==='apcosys')?requestedFamily:'apcosys';
   setFamily(family);setLimit(72);
   const valid=Boolean(requestedIcon&&all[family].includes(requestedIcon));
   setSelected(valid?{family,name:requestedIcon!}:null);
   setSearch(valid?requestedIcon!:'');
  },[initialFamily]);
  const [family,setFamily]=useState<Family>('apcosys');
  const [search,setSearch]=useState('');
  const [size,setSize]=useState(24);
  const [stroke,setStroke]=useState(1.5);
  const [limit,setLimit]=useState(72);
  const [selected,setSelected]=useState<IconChoice|null>(null);
  const [copied,setCopied]=useState(false);
  const names=useMemo(()=>all[family].filter(name=>name.toLowerCase().includes(search.trim().toLowerCase())),[family,search]);
  const visible=names.slice(0,limit);
  const sourceCode=(item:IconChoice)=>{
    if(item.family==='apcosys')return `<Icon name="${item.name}" />`;
    return `<LibraryIcon family="${item.family}" name="${item.name}" size={24} />`;
  };
  return <div className="ds-icons-page">
    <div id="docs-icon-library" className="ds-section-bar"><h2>Browse icons</h2><span className="ds-label">Click an icon to see how to use it</span></div>
    <div className="ds-icon-toolbar">
      <div className="ds-toggle-row">{families.map(f=><button key={f.key} type="button" data-active={family===f.key} aria-pressed={family===f.key}
        onClick={()=>{setFamily(f.key);setSelected(null);setLimit(72)}}>{f.label}<small>{all[f.key].length}</small></button>)}</div>
      <input type="search" aria-label="Search icons" placeholder="Find an icon..." value={search} onChange={e=>{setSearch(e.target.value);setLimit(72)}}/>
    </div>
    <details id="docs-icon-options" className="ds-icon-settings"><summary>Size & stroke <span>+</span></summary><div className="ds-icon-options">
      <span>{families.find(f=>f.key===family)?.notes}</span>
      <label>Size <select aria-label="Icon size" value={size} onChange={e=>setSize(Number(e.target.value))}>
        {[16,20,24,32].map(n=><option key={n} value={n}>{n}px</option>)}</select></label>
      <label>Stroke <select aria-label="Icon stroke width" value={stroke} onChange={e=>setStroke(Number(e.target.value))} disabled={family==='phosphor'}>
        {[1,1.5,2].map(n=><option key={n} value={n}>{n}px</option>)}</select></label>
    </div></details>
    <div className="ds-icon-catalog" role="group" aria-label={family+' icons'}>
      {visible.map(name=><button key={name} type="button" className="ds-icon-tile" data-selected={selected?.family===family&&selected.name===name}
        onClick={()=>{setSelected({family,name});setCopied(false)}} title={name}>
        <LibraryIcon family={family} name={name} size={size} stroke={stroke} spriteBaseUrl={spriteBaseUrl}/>
        <span>{name}</span></button>)}
    </div>
    {names.length===0&&<p className="ds-caption ds-empty">No icons found</p>}
    {names.length>limit&&<button className="ds-load-more" type="button" onClick={()=>setLimit(v=>v+72)}>Show more · {names.length-limit} remaining</button>}
    {selected&&<div className="ds-selected-icon" role="region" aria-label="Selected icon">
      <div className="ds-selected-symbol"><LibraryIcon {...selected} size={32} stroke={stroke} spriteBaseUrl={spriteBaseUrl}/></div>
      <div><strong>{selected.name}</strong><span>{selected.family} · {size}px</span></div>
      <code>{sourceCode(selected)}</code>
      <button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(sourceCode(selected));setCopied(true);}catch{setCopied(false);}}}>{copied?'Copied':'Copy code'}</button>
      <button type="button" className="ds-selected-close" onClick={()=>setSelected(null)} aria-label="Close icon inspector">×</button>
    </div>}
    <details className="ds-native-details ds-extra-section"><summary>Icon states & usage <span>+</span></summary><div className="ds-icon-states">
      <div className="ds-section-bar"><div><h2>States</h2><p>Color is semantic. Stroke and icon silhouette stay consistent.</p></div></div>
      <div className="ds-state-grid">
        {(['Default','Hover','Active','Disabled','Inverse'] as const).map((state,i)=>
          <div className={'ds-icon-state ds-icon-state--'+state.toLowerCase()} key={state}>
            <LibraryIcon family={family} name={family==='phosphor'?'magnifying-glass':'search'} size={24} stroke={1.5} spriteBaseUrl={spriteBaseUrl}/>
            <span>{state}</span><code>{['--ink','--action-hover','--action','--muted','--white'][i]}</code>
          </div>)}
      </div>
      <p className="ds-caption">Phosphor is fill-based: stroke weight does not apply. Use native APCOSYS for navigation and Feather for new stroke-based product icons. Reserve Phosphor for clearly defined alternative families.</p>
    </div>
    </details>
    <details className="ds-native-details ds-extra-section"><summary>Morphicons · animated transitions <span>+</span></summary><MorphPairs/></details>
  </div>;
}
