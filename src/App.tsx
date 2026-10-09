import { useEffect, useMemo, useRef, useState } from 'react';
import { catalog, groups, type Item, type Group } from './catalog';
import Preview from './gallery/Preview';

type Tone = 'light' | 'dark';
function useVisible() {
  const node=useRef<HTMLElement>(null);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const element=node.current;
    if(!element)return;
    const io=new IntersectionObserver(entries=>setVisible(entries.some(x=>x.isIntersecting)),{rootMargin:'160px'});
    io.observe(element);
    return ()=>io.disconnect();
  },[]);
  return {node,visible};
}
function Symbol({name}:{name:'arrow'|'pause'|'play'|'copy'|'close'|'github'|'sun'|'moon'|'search'}) {
 const paths:{[key:string]:string}={
  arrow:'M4 12h16m-7-7 7 7-7 7',
  pause:'M8 5v14m8-14v14',
  play:'m8 5 11 7-11 7V5Z',
  copy:'M9 9h11v11H9zM5 16H4V4h12v1',
  close:'M5 5l14 14M19 5 5 19',
  github:'M8 19c-5 1-5-2-7-3m7 5v-3c-6-2-7-11 0-13 2-2 6-2 8 0 7 2 6 11 0 13v3M6 6c-2-2-2-3-1-5m13 5c2-2 2-3 1-5',
  sun:'M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  moon:'M20 15.4A8 8 0 0 1 8.6 4 8.5 8.5 0 1 0 20 15.4Z',
  search:'M20 20l-4-4M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z'
 };
 return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]}/></svg>;
}
function GalleryCard({item,tone,paused,speed,onOpen}:{item:Item;tone:Tone;paused:boolean;speed:number;onOpen:()=>void}) {
 const {node,visible}=useVisible();
 return <article className="component-card" ref={node}>
  <div className="card-topline"><span>{item.group}</span><span>{item.tech}</span></div>
  <div className="card-preview" data-tone={tone}>
   <Preview id={item.id} active={visible&&!paused} tone={tone} speed={speed}/>
   <span className="card-index">{String(catalog.findIndex(c=>c.id===item.id)+1).padStart(2,'0')}</span>
  </div>
  <div className="card-info"><div><h3>{item.name}</h3><p>{item.description}</p></div>
    <button className="card-more" type="button" aria-label={`Inspect ${item.name}`} onClick={onOpen}><Symbol name="arrow"/></button>
  </div>
 </article>;
}
export default function App(){
 const [filter,setFilter]=useState<(typeof groups)[number]>('All components');
 const [query,setQuery]=useState('');
 const [tone,setTone]=useState<Tone>('dark');
 const [paused,setPaused]=useState(false);
 const [speed,setSpeed]=useState(1);
 const [selected,setSelected]=useState<Item|null>(null);
 const [copied,setCopied]=useState(false);
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fn=()=>setReduced(media.matches);
  media.addEventListener('change',fn);
  return ()=>media.removeEventListener('change',fn);
 },[]);
 useEffect(()=>{
  if(!selected)return;
  const key=(event:KeyboardEvent)=>{if(event.key==='Escape')setSelected(null)};
  document.addEventListener('keydown',key);
  const old=document.body.style.overflow;
  document.body.style.overflow='hidden';
  return ()=>{document.removeEventListener('keydown',key);document.body.style.overflow=old};
 },[selected]);
 const matches=useMemo(()=>catalog.filter(item=>(filter==='All components'||item.group===filter)&&`${item.name} ${item.description} ${item.tech}`.toLowerCase().includes(query.trim().toLowerCase())),[filter,query]);
 async function copyCode(text:string){
  try{await navigator.clipboard.writeText(text);setCopied(true);window.setTimeout(()=>setCopied(false),1800)}
  catch{setCopied(false)}
 }
 return <div className="app">
  <header className="topbar">
   <a className="wordmark" href="#top" aria-label="APCOSYS Motion Library home"><span className="brand-emblem" aria-hidden="true">A<span>•</span></span><span>APCOSYS <span className="brand-slash">/</span> MOTION</span></a>
   <span className="topbar-caption">COMPONENT REPOSITORY <span>—</span> 001</span>
   <a className="repo-link" href="https://github.com/IMONsergey/Apco-components-lib" target="_blank" rel="noreferrer"><Symbol name="github"/> SOURCE ON GITHUB <Symbol name="arrow"/></a>
  </header>
  <main id="top">
   <section className="intro">
    <div className="eyebrow"><span className="status-dot"/> THE MOTION SYSTEM <span> / VERSION 01</span></div>
    <div className="intro-columns"><h1>Designed<br/>to <em>move.</em></h1><div className="intro-side"><span className="intro-plus">✳</span><p>A living collection of animations and interaction primitives extracted from APCOSYS. Built to be inspected, configured and reused without reconstructing the original experience.</p></div></div>
    <div className="intro-stats"><span><b>{String(catalog.length).padStart(2,'0')}</b> COMPONENTS</span><span><b>04</b> RENDERING PATTERNS</span><span><b>01</b> SHARED SOURCE</span><span className="intro-credit">REACT 19 / VITE / TYPESCRIPT</span></div>
   </section>
   <section className="library" aria-labelledby="library-heading">
    <div className="section-header"><div><span className="section-number">01 / LIBRARY</span><h2 id="library-heading">Component collection<span className="count-label">{matches.length}</span></h2></div><p>Original rendering engines. Isolated previews.<br/>No functional dependency on the product backend.</p></div>
    <div className="toolbar">
     <div className="filters" aria-label="Component categories">{groups.map(g=><button key={g} type="button" className={filter===g?'active':''} aria-pressed={filter===g} onClick={()=>setFilter(g)}>{g}</button>)}</div>
     <label className="search"><Symbol name="search"/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find component…" aria-label="Search components"/></label>
    </div>
    <div className="preview-toolbar"><div className="controls-caption"><span className="live-led"/> LIVE PREVIEW CONTROLS</div>
     <div className="global-controls">
      <button type="button" onClick={()=>setPaused(!paused)} aria-pressed={paused}><Symbol name={paused?'play':'pause'}/>{paused?'Resume all':'Pause all'}</button>
      <span className="control-divider"/>
      <div className="tone-switch" role="group" aria-label="Preview background">
       <button type="button" aria-pressed={tone==='light'} className={tone==='light'?'active':''} onClick={()=>setTone('light')} aria-label="Light preview"><Symbol name="sun"/></button>
       <button type="button" aria-pressed={tone==='dark'} className={tone==='dark'?'active':''} onClick={()=>setTone('dark')} aria-label="Dark preview"><Symbol name="moon"/></button>
      </div>
      <span className="control-divider"/>
      <label className="speed-control">SPEED <input type="range" min="0.5" max="2" step="0.25" value={speed} onChange={e=>setSpeed(Number(e.target.value))}/><output>{speed.toFixed(2)}×</output></label>
     </div>
    </div>
    {reduced&&<p className="reduced-note">Reduced-motion preference is active. Visual engines may display a static frame.</p>}
    <div className="card-grid">{matches.map(item=><GalleryCard key={item.id} item={item} tone={tone} paused={paused} speed={speed} onOpen={()=>{setSelected(item);setCopied(false)}}/>)}</div>
    {matches.length===0&&<div className="empty">No matching components. Try another search or category.</div>}
   </section>
   <section className="usage-section"><div className="usage-mark">↗</div><div><span className="section-number">02 / INTEGRATION</span><h2>Motion is a component.<br/><span>Not a screenshot.</span></h2><p>Every entry links back to a source file and includes a minimal React example. Product scenes stay DOM/SVG/GSAP; visual engines keep their original Canvas/SVG implementations. Offscreen previews are unmounted to avoid runaway CPU usage.</p><a href="https://github.com/IMONsergey/Apco-components-lib#integration" target="_blank" rel="noreferrer">Read integration guide <Symbol name="arrow"/></a></div></section>
  </main>
  <footer><span>© APCOSYS / COMPONENTS LIBRARY</span><span>BUILT FOR PRODUCTION REUSE</span><a href="https://github.com/IMONsergey/apcoweb" target="_blank" rel="noreferrer">UPSTREAM: APCOWEB ↗</a></footer>
  {selected&&<div className="overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}>
   <section role="dialog" aria-modal="true" aria-label={selected.name} className="detail-drawer">
    <header><div><span className="section-number">COMPONENT / {selected.id.toUpperCase()}</span><h2>{selected.name}</h2></div><button autoFocus type="button" aria-label="Close details" onClick={()=>setSelected(null)}><Symbol name="close"/></button></header>
    <div className="detail-preview" data-tone={tone}><Preview id={selected.id} tone={tone} speed={speed} active={!paused} large/></div>
    <div className="detail-meta"><span>{selected.group}</span><span>{selected.tech}</span></div>
    <p className="detail-description">{selected.description}</p>
    <div className="code-header"><span>REACT EXAMPLE</span><button type="button" onClick={()=>void copyCode(selected.code)}><Symbol name="copy"/>{copied?'COPIED':'COPY CODE'}</button></div>
    <pre className="code"><code>{selected.code}</code></pre>
    <a className="source-link" href={`https://github.com/IMONsergey/Apco-components-lib/blob/main/${selected.source}`} target="_blank" rel="noreferrer">VIEW SOURCE FILE <Symbol name="arrow"/></a>
   </section>
  </div>}
 </div>;
}
