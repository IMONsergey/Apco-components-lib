import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Icon } from '../components/ui/Icon';
import { Logo } from '../components/ui/Logo';
import { sections, sectionTitles, sourceRoutes, toc, href, type DocRoute } from './navigation';

type Tone='light'|'dark';
function CommandSearch({open,onClose,onNavigate}:{open:boolean;onClose:()=>void;onNavigate:()=>void}){
 const [query,setQuery]=useState('');
 const [active,setActive]=useState(0);
 const field=useRef<HTMLInputElement>(null);
 useEffect(()=>{if(open){setQuery('');setActive(0);requestAnimationFrame(()=>field.current?.focus())}},[open]);
 const matches=useMemo(()=>{
  const q=query.trim().toLowerCase();
  const scored=sourceRoutes.map((item,index)=>{
   const name=item.label.toLowerCase(),extra=(item.keywords||'').toLowerCase();
   const score=!q?index<9?200-index:0:name===q?500:name.startsWith(q)?400:name.includes(q)?300:extra.includes(q)?120:0;
   return {item,score,index};
  });
  return scored.filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,12).map(x=>x.item);
 },[query]);
 if(!open)return null;
 return <div className="docs-command-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className="docs-command" role="dialog" aria-modal="true" aria-label="Search design system"
   onKeyDown={e=>{
    if(e.key==='Escape'){e.preventDefault();onClose();}
   if(e.key==='Tab'){
    const focusable=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('input:not([disabled]),button:not([disabled]),a[href]'));
    const first=focusable[0],last=focusable[focusable.length-1];
    if(first&&last){
     if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
     else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
   }
    if(e.key==='ArrowDown'){e.preventDefault();setActive(v=>Math.min(matches.length-1,v+1))}
    if(e.key==='ArrowUp'){e.preventDefault();setActive(v=>Math.max(0,v-1))}
    if(e.key==='Enter'&&matches.length){e.preventDefault();const target=matches[Math.min(active,matches.length-1)];if(target){window.location.hash=target.route;onClose();onNavigate();}}
   }}>
   <div className="docs-command__field"><Icon name="search"/><input ref={field} type="search" placeholder="Search tokens, components, documentation..." aria-label="Search all docs" value={query}
    onChange={e=>{setQuery(e.target.value);setActive(0)}}/>
    <button type="button" onClick={onClose} aria-label="Close search">ESC</button></div>
   <div className="docs-command__results" role="listbox" aria-label="Search results">
    {matches.length?matches.map((x,i)=><a key={x.route+x.label} href={x.route} role="option" aria-selected={i===active}
     onMouseEnter={()=>setActive(i)} onClick={()=>{onClose();onNavigate()}}>
     <span className="docs-command__result-main">{x.label}</span>
     <span className="docs-command__path">{x.route.replace('#','')}</span>
     <Icon name="arrow"/></a>):<p>No results. Try “colors”, “button” or “grid”.</p>}
   </div>
   <div className="docs-command__footer"><span>↑↓ Navigate</span><span>↵ Open</span><span>Esc Close</span></div>
  </section>
 </div>;
}
function Sidebar({route,open,compact,onClose}:{route:DocRoute;open:boolean;compact:boolean;onClose:()=>void}){
 return <>
  {open&&<div className="docs-mobile-shade" onClick={onClose} aria-hidden="true"/>}
  <aside className="docs-sidebar" data-open={open} data-compact={compact} aria-label="Documentation navigation">
   <div className="docs-sidebar__scroll">
    <div className="docs-sidebar__caption">DOCUMENTATION <span>V2.0</span></div>
    <nav className="docs-sidebar__nav" aria-label="Design system">
     <a className="docs-sidebar__overview" href={href('overview')} aria-current={route.section==='overview'?'page':undefined}
       onClick={onClose}><span>Overview</span><Icon name="arrow"/></a>
     {sections.filter(s=>s.id!=='overview').map(section=>
      <details className="docs-sidebar__group" key={section.id} open={route.section===section.id||(route.section==='overview'&&section.id==='foundations')?true:undefined} data-section={section.id}>
       <summary onClick={e=>{const el=e.currentTarget.parentElement as HTMLDetailsElement;if(el.open&&route.section===section.id){e.preventDefault()}}}>
        <span>{section.label}</span><Icon name="chevron"/>
       </summary>
       <div className="docs-sidebar__subitems">
        {section.items.map(item=>{
         const active=window.location.hash===item.route||(!route.slug&&route.section===section.id&&item.route===href(section.id));
         return <a key={item.route} href={item.route} aria-current={active?'page':undefined} title={item.label}
           onClick={onClose}>{item.label}</a>;
        })}
       </div>
      </details>)}
    </nav>
    <div className="docs-sidebar__links">
     <a href="https://imonsergey.github.io/apcoweb/" target="_blank" rel="noreferrer">Live website <Icon name="external"/></a>
     <a href="https://github.com/IMONsergey/Apco-components-lib" target="_blank" rel="noreferrer">Source repository <Icon name="external"/></a>
    </div>
   </div>
  </aside>
 </>;
}
function Toc({route}:{route:DocRoute}){
 const items=route.section==='components'&&route.slug&&route.slug!=='visual'&&route.slug!=='product'&&route.slug!=='interface'
  ?[{label:'Preview',id:'docs-component-preview'},{label:'Usage',id:'docs-component-usage'},{label:'Source',id:'docs-component-source'}]
  :route.section==='foundations'&&route.slug==='colors'
   ?[{label:'Surfaces',id:'ds-color-surfaces'},{label:'Typography',id:'ds-color-typography'},{label:'Brand & actions',id:'ds-color-brand-actions'},{label:'Borders',id:'ds-color-borders'}]
  :route.section==='foundations'&&route.slug?[]:toc[route.section];
 if(!items.length)return <aside className="docs-toc docs-toc--empty" aria-hidden="true"/>;
 return <aside className="docs-toc" aria-label="On this page">
  <span>ON THIS PAGE</span>
  <nav>{items.map(item=><a key={item.id} href={href(route.section,route.slug)} onClick={e=>{
   e.preventDefault();document.getElementById(item.id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }}>{item.label}</a>)}</nav>
  <a className="docs-toc__top" href="#top" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})}}>Back to top ↑</a>
 </aside>;
}
export function DocsChrome({route,tone,onTheme,children}:{route:DocRoute;tone:Tone;onTheme:()=>void;children:ReactNode}){
 const [open,setOpen]=useState(false),[collapsed,setCollapsed]=useState(false),[search,setSearch]=useState(false);
 const last=useRef<HTMLElement|null>(null);
 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{
   if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'||(e.key==='/'&&!e.metaKey&&!e.ctrlKey&&!['INPUT','TEXTAREA'].includes((e.target as HTMLElement)?.tagName))){
    e.preventDefault();setSearch(s=>!s);
   }else if(e.key==='Escape'){setSearch(false);setOpen(false)}
  };
  document.addEventListener('keydown',key);
  return ()=>document.removeEventListener('keydown',key);
 },[]);
 useEffect(()=>{setOpen(false)},[route.section,route.slug]);
 useEffect(()=>{
  if(!search&&last.current?.isConnected){last.current.focus({preventScroll:true});last.current=null}
 },[search]);
 const openSearch=()=>{last.current=document.activeElement instanceof HTMLElement?document.activeElement:null;setSearch(true)};
 const go=()=>{setOpen(false)};
 return <div className="docs-shell" data-collapsed={collapsed}>
  <a className="docs-skip" href="#docs-content">Skip to content</a>
  <header className="docs-header">
   <div className="docs-header__brand">
    <button type="button" className="docs-header__menu" aria-label="Open navigation" aria-expanded={open} onClick={()=>setOpen(true)}><Icon name="menu"/></button>
    <button type="button" className="docs-header__collapse" aria-label={collapsed?'Expand navigation':'Collapse navigation'} aria-pressed={collapsed}
     onClick={()=>setCollapsed(v=>!v)}><Icon name="menu"/></button>
    <a href={href('overview')} aria-label="APCOSYS design system home" onClick={go}><Logo/></a>
    <span className="docs-header__divider"/>
    <span className="docs-header__brand-title">Design system</span>
   </div>
   <div className="docs-header__actions">
    <button className="docs-header__search" type="button" onClick={openSearch} aria-label="Search documentation">
     <Icon name="search"/><span>Search documentation</span><kbd>⌘ K</kbd>
    </button>
    <button type="button" className="docs-header__theme" onClick={onTheme} aria-label={tone==='light'?'Dark theme':'Light theme'}
     aria-pressed={tone==='dark'}><Icon name="appearance"/></button>
    <a className="docs-header__github" href="https://github.com/IMONsergey/Apco-components-lib" target="_blank" rel="noreferrer" aria-label="GitHub repository"><Icon name="external"/></a>
   </div>
  </header>
  <Sidebar route={route} open={open} compact={collapsed} onClose={go}/>
  <div className="docs-main-shell">
   <div className="docs-breadcrumbs"><a href={href('overview')}>APCOSYS</a><span>/</span>
    <a href={href(route.section)} aria-current={!route.slug?'page':undefined}>{sectionTitles[route.section]}</a>
    {route.slug&&<><span>/</span><span>{route.slug.replace(/-/g,' ')}</span></>}
   </div>
   <div className="docs-content-layout">
    <main id="docs-content" className="docs-content" tabIndex={-1}>
     {children}
    </main>
    <Toc route={route}/>
   </div>
   <footer className="docs-footer"><span>APCOSYS / DESIGN SYSTEM</span><a href="https://github.com/IMONsergey/Apco-components-lib" target="_blank" rel="noreferrer">Source ↗</a></footer>
  </div>
  <CommandSearch open={search} onClose={()=>setSearch(false)} onNavigate={go}/>
 </div>;
}
