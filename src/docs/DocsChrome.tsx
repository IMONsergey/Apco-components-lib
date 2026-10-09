import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useModalFocus } from '../hooks/useModalFocus';
import { Icon } from '../components/ui/Icon';
import { Logo } from '../components/ui/Logo';
import { sections, sectionTitles, sourceRoutes, toc, href, routeTitle, type DocRoute } from './navigation';

type Tone='light'|'dark';
const searchIndex=sourceRoutes.map((item,index)=>({item,index,name:item.label.toLowerCase(),extra:(item.keywords||'').toLowerCase()}));
function resultCategory(route:string){
 if(route.startsWith('#components/'))return 'Component';
 if(route.startsWith('#foundations/colors'))return 'Colors';
 const section=route.split('/')[0]?.replace('#','')??'';
 const names:Record<string,string>={overview:'Home',foundations:'Brand styles',components:'Components',icons:'Icons',guidelines:'Guides'};
 return names[section]||'Library';
}
function CommandSearch({open,onClose,onNavigate}:{open:boolean;onClose:()=>void;onNavigate:()=>void}){
 const [query,setQuery]=useState('');
 const [active,setActive]=useState(0);
 const field=useRef<HTMLInputElement>(null);
 const dialog=useRef<HTMLElement>(null);
 const restore=useModalFocus(open,dialog,'input');
 const navigate=()=>{restore.current=false;onClose();onNavigate();};
 useEffect(()=>{if(open){setQuery('');setActive(0);requestAnimationFrame(()=>field.current?.focus())}},[open]);
 const matches=useMemo(()=>{
  const q=query.trim().toLowerCase();
  const scored=searchIndex.map(({item,index,name,extra})=>{
   const score=!q?index<9?200-index:0:name===q?500:name.startsWith(q)?400:name.includes(q)?300:q.split(/\s+/).every(word=>(name+' '+extra).includes(word))?120:0;
   return {item,score,index};
  });
  const seen=new Set<string>();
  return scored.filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.index-b.index)
   .filter(({item})=>{if(seen.has(item.route))return false;seen.add(item.route);return true})
   .slice(0,8).map(x=>x.item);
 },[query]);
 useEffect(()=>{
  if(open&&matches.length)document.getElementById('docs-search-option-'+Math.min(active,matches.length-1))?.scrollIntoView({block:'nearest',behavior:'instant'});
 },[open,active,query,matches.length]);
 if(!open)return null;
 return <div className="docs-command-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section ref={dialog} className="docs-command" role="dialog" aria-modal="true" aria-label="Search design system"
   onKeyDown={e=>{
    if(e.nativeEvent.isComposing)return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onClose();return;}
    if(e.target!==field.current)return;
    if(e.key==='ArrowDown'){e.preventDefault();setActive(v=>Math.max(0,Math.min(matches.length-1,v+1)))}
    if(e.key==='ArrowUp'){e.preventDefault();setActive(v=>Math.max(0,v-1))}
    if(e.key==='Enter'&&matches.length){e.preventDefault();const target=matches[Math.min(active,matches.length-1)];if(target){window.location.hash=target.route;navigate();}}
   }}>
   <div className="docs-command__field"><Icon name="search"/><input ref={field} type="search" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls="docs-search-results"
    aria-activedescendant={matches.length?'docs-search-option-'+Math.min(active,matches.length-1):undefined}
    placeholder="Search colors, components, icons..." aria-label="Search all docs" value={query}
    onChange={e=>{setQuery(e.target.value);setActive(0)}}/>
    <button type="button" onClick={onClose} aria-label="Close search">ESC</button></div>
   <div className="docs-command__results" id="docs-search-results" role="listbox" aria-label="Search results">
    {matches.length?matches.map((x,i)=><a key={x.route+x.label} id={'docs-search-option-'+i} href={x.route} role="option" aria-selected={i===active}
     onMouseEnter={()=>setActive(i)} tabIndex={-1} onClick={navigate}>
     <span className="docs-command__result-main">{x.label}</span>
     <span className="docs-command__path">{resultCategory(x.route)}</span>
     <Icon name="arrow"/></a>):<p>Nothing found. Try a color, button or icon name.</p>}
   </div>
   <div className="docs-command__footer"><span>↑↓ Select</span><span>↵ Open</span><span>Esc Close</span></div>
  </section>
 </div>;
}
function Sidebar({route,open,compact,onClose,onCompact,mobile,search}:{route:DocRoute;open:boolean;compact:boolean;onClose:()=>void;onCompact:()=>void;mobile:boolean;search:boolean}){
 const ref=useRef<HTMLElement>(null);
 const restore=useModalFocus(open&&mobile,ref,'.docs-sidebar__close');
 const navigate=()=>{restore.current=false;onClose();};
 return <>
  {open&&<div className="docs-mobile-shade" onClick={onClose} aria-hidden="true"/>}
  <aside ref={ref} id="docs-navigation" className="docs-sidebar" data-open={open} data-compact={compact} inert={search||(mobile?!open:compact)} role={mobile&&open?'dialog':undefined} aria-modal={mobile&&open?true:undefined} aria-label="Documentation navigation">
   <div className="docs-sidebar__scroll">
    <div className="docs-sidebar__caption">LIBRARY
      <button type="button" className="docs-sidebar__desktop-collapse" onClick={onCompact}
       aria-label="Collapse navigation" title="Collapse navigation"><Icon name="menu"/></button>
      <button type="button" className="docs-sidebar__close" onClick={onClose} aria-label="Close navigation"><Icon name="close"/></button>
    </div>
    <nav className="docs-sidebar__nav" aria-label="Design system">
     <a className="docs-sidebar__overview" href={href('overview')} aria-current={route.section==='overview'?'page':undefined}
       onClick={navigate}><span>Home</span><Icon name="arrow"/></a>
     {sections.filter(s=>s.id!=='overview').map(section=>
      (section.id==='components'||section.id==='icons')
       ? <a key={section.id} href={href(section.id)} className="docs-sidebar__section-link"
         aria-current={route.section===section.id?'page':undefined} onClick={navigate}>
          <span>{section.label}</span><Icon name="arrow"/>
         </a>
       : <details className="docs-sidebar__group" key={section.id}
           open={route.section===section.id||(route.section==='overview'&&section.id==='foundations')?true:undefined} data-section={section.id}>
          <summary><span>{section.label}</span><Icon name="chevron"/></summary>
          <div className="docs-sidebar__subitems">
           {section.items.map(item=>{
            const active=window.location.hash===item.route||(!route.slug&&route.section===section.id&&item.route===href(section.id));
            return <a key={item.route} href={item.route} aria-current={active?'page':undefined}
              title={item.label} onClick={navigate}>{item.label}</a>;
           })}
          </div>
         </details>)}
    </nav>
    <div className="docs-sidebar__links">
     <a href="https://github.com/IMONsergey/Apco-components-lib" target="_blank" rel="noreferrer">GitHub <Icon name="external"/></a>
    </div>
   </div>
  </aside>
 </>;
}
function Toc({route}:{route:DocRoute}){
 const items=route.section==='components'&&route.slug&&route.slug!=='visual'&&route.slug!=='product'&&route.slug!=='interface'
  ?[{label:'Preview',id:'docs-component-preview'},{label:'Usage',id:'docs-component-usage'},{label:'Source',id:'docs-component-source'}]
  :route.section==='foundations'&&route.slug
   ? ({
       colors:[{label:'Surfaces',id:'ds-color-surfaces'},{label:'Typography',id:'ds-color-typography'},{label:'Brand & actions',id:'ds-color-brand-actions'},{label:'Borders',id:'ds-color-borders'},{label:'Contrast',id:'ds-contrast'}],
       identity:[{label:'Logo',id:'ds-identity'},{label:'Symbols',id:'ds-symbols'}],
       spacing:[{label:'Spacing scale',id:'ds-spacing-values'},{label:'Corner radii',id:'ds-radii'}],
       layout:[{label:'Dimensions',id:'ds-layout-values'},{label:'Breakpoints',id:'ds-breakpoints'}],
     } as Record<string,Array<{label:string;id:string}>>)[route.slug]||[]
  :toc[route.section];
 if(!items.length)return <aside className="docs-toc docs-toc--empty" aria-hidden="true"/>;
 return <aside className="docs-toc" aria-label="On this page">
  <span>On this page</span>
  <nav>{items.map(item=><a key={item.id} href={href(route.section,route.slug)} onClick={e=>{
   e.preventDefault();document.getElementById(item.id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }}>{item.label}</a>)}</nav>
  <a className="docs-toc__top" href="#top" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}}>Back to top</a>
 </aside>;
}
export function DocsChrome({route,tone,onTheme,children}:{route:DocRoute;tone:Tone;onTheme:()=>void;children:ReactNode}){
 const [open,setOpen]=useState(false),[collapsed,setCollapsed]=useState(false),[search,setSearch]=useState(false);
 const [mobile,setMobile]=useState(()=>matchMedia('(max-width:1000px)').matches);
 useEffect(()=>{const media=matchMedia('(max-width:1000px)');const change=()=>{setMobile(media.matches);if(!media.matches)setOpen(false);};media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{
   if(e.defaultPrevented||e.isComposing)return;
   const target=e.target as HTMLElement|null;
   if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'||(e.key==='/'&&!e.metaKey&&!e.ctrlKey&&!target?.closest('input,textarea,select,[contenteditable=true]'))){
    e.preventDefault();setOpen(false);setSearch(s=>!s);
   }else if(e.key==='Escape'){setSearch(false);setOpen(false)}
  };
  document.addEventListener('keydown',key);
  return ()=>document.removeEventListener('keydown',key);
 },[]);
 useEffect(()=>{setOpen(false)},[route.section,route.slug]);
 const openSearch=()=>{setOpen(false);setSearch(true)};
 const go=()=>{setOpen(false)};
 return <div className="docs-shell" data-collapsed={collapsed&&!mobile}>
  <a className="docs-skip" href="#docs-content" onClick={e=>{e.preventDefault();const main=document.getElementById('docs-content');main?.focus({preventScroll:true});main?.scrollIntoView({block:'start',behavior:'instant'});}}>Skip to content</a>
  <header className="docs-header" inert={search||(open&&mobile)}>
   <div className="docs-header__brand">
    <button type="button" className="docs-header__menu" aria-label="Open navigation" aria-expanded={open} aria-controls="docs-navigation" onClick={()=>setOpen(true)}><Icon name="menu"/></button>
    <button type="button" className="docs-header__collapse" aria-label="Expand navigation" aria-pressed={collapsed}
     onClick={()=>{setCollapsed(v=>!v);requestAnimationFrame(()=>document.querySelector<HTMLButtonElement>('.docs-sidebar__desktop-collapse')?.focus());}}><Icon name="menu"/></button>
    <a href={href('overview')} aria-label="APCOSYS design system home" onClick={go}><Logo/></a>
    <span className="docs-header__divider"/>
    <span className="docs-header__brand-title">Design library</span>
   </div>
   <div className="docs-header__actions">
    <button className="docs-header__search" type="button" onClick={openSearch} aria-label="Search documentation">
     <Icon name="search"/><span>Search anything</span><kbd>{/Mac|iPhone|iPad/.test(navigator.platform)?'⌘ K':'Ctrl K'}</kbd>
    </button>
    <button type="button" className="docs-header__theme" onClick={onTheme} aria-label={tone==='light'?'Dark theme':'Light theme'}
     aria-pressed={tone==='dark'}><Icon name="appearance"/></button>

   </div>
  </header>
  <Sidebar route={route} open={open} compact={collapsed&&!mobile} onClose={go} onCompact={()=>{setCollapsed(true);requestAnimationFrame(()=>document.querySelector<HTMLButtonElement>('.docs-header__collapse')?.focus());}} mobile={mobile} search={search}/>
  <div className="docs-main-shell" inert={search||(open&&mobile)}>
   {route.section!=='overview'&&<div className="docs-breadcrumbs"><a href={href('overview')}>APCOSYS</a><span>/</span>
    <a href={href(route.section)} aria-current={!route.slug?'page':undefined}>{sectionTitles[route.section]}</a>
    {route.slug&&<><span>/</span><span>{routeTitle(route)}</span></>}
   </div>}
   <div className="docs-content-layout">
    <main id="docs-content" className="docs-content" tabIndex={-1}>
     {children}
    </main>
    <Toc route={route}/>
   </div>
   <footer className="docs-footer"><span>APCOSYS LIBRARY</span><a href="https://github.com/IMONsergey/Apco-components-lib" target="_blank" rel="noreferrer">GitHub <Icon name="external"/></a></footer>
  </div>
  <CommandSearch open={search} onClose={()=>setSearch(false)} onNavigate={go}/>
 </div>;
}
