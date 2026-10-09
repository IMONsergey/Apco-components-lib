import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
const FoundationsPage = lazy(() => import('./brand/FoundationsPage'));
const IconsPage = lazy(() => import('./brand/IconsPage'));
const GuidelinesPage = lazy(() => import('./brand/GuidelinesPage'));
import { catalog, groups, type Item } from './catalog';
import { DocsChrome } from './docs/DocsChrome';
import { parseRoute, href, type DocRoute } from './docs/navigation';
import Overview from './docs/Overview';
import { Icon } from './components/ui/Icon';
import Preview from './gallery/Preview';

type Tone = 'light' | 'dark';
function useInView() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: '200px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function Card({ item, tone, open }: {
  item: Item; tone: Tone; open: (item: Item) => void;
}) {
  const { ref, visible } = useInView();
  return (
    <article className="lib-card" ref={ref} data-testid={item.id}>
      <div className="lib-card__head">
        <button type="button" className="lib-card__name" onClick={() => open(item)}>{item.name}</button>
        <button type="button" className="lib-card__open" aria-label={`Inspect ${item.name}`} onClick={() => open(item)}>
          <Icon name="focus" />
        </button>
      </div>
      <div className="lib-surface lib-card__preview" data-tone={tone}>
        <Preview id={item.id} tone={tone} speed={1} active={visible} />
      </div>
      <div className="lib-card__foot"><span>{item.tech}</span><span>{item.group}</span></div>
    </article>
  );
}

function Detail({ item, tone, onClose }: { item: Item; tone: Tone; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const el = dialog.current;
    if (el && !el.open) el.showModal();
    // Closing during StrictMode effect cleanup emits a native 'close' event
    // and immediately unmounts the inspector. The DOM releases top-layer
    // state when the dialog element itself is removed.
  }, []);
  const copy = async () => {
    try { await navigator.clipboard.writeText(item.code); setCopied(true); }
    catch { setCopied(false); }
  };
  return (
    <dialog ref={dialog} className="lib-dialog" onClose={onClose}
      onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      <div className="lib-dialog__inside">
        <header className="lib-dialog__head">
          <div><span className="lib-label">{item.group}</span><h2>{item.name}</h2></div>
          <button type="button" className="lib-icon-button" aria-label="Close" onClick={() => dialog.current?.close()}>
            <Icon name="close"/>
          </button>
        </header>
        <div className="lib-surface lib-dialog__preview" data-tone={tone}>
          <Preview id={item.id} tone={tone} speed={1} active large />
        </div>
        <div className="lib-dialog__meta"><a href={href('components',item.id)} onClick={onClose}>Full documentation <Icon name="arrow"/></a><span>{item.tech}</span><a href={`https://github.com/IMONsergey/Apco-components-lib/blob/main/${item.source}`} target="_blank" rel="noreferrer">Source <Icon name="external"/></a></div>
        <div className="lib-code-head"><span>Usage</span><button type="button" onClick={() => void copy()}><Icon name="copy" />{copied ? 'Copied' : 'Copy'}</button></div>
        <pre className="lib-code"><code>{item.code}</code></pre>
      </div>
    </dialog>
  );
}


function ComponentPage({item,tone}:{item:Item;tone:Tone}){
 const [copied,setCopied]=useState(false);
 return <article className="docs-component">
  <div className="docs-component__heading">
   <a href={href('components')} className="docs-component__back">← All components</a>
   <h1>{item.name}</h1>
   <p>{item.description}</p>
   <div className="docs-component__tags"><span>{item.group}</span><span>{item.tech}</span></div>
  </div>
  <div className="docs-component__example" id="docs-component-preview">
   <div className="docs-component__example-head"><span>Preview</span><span>Live React component</span></div>
   <div className="docs-component__stage lib-surface" data-tone={tone}>
    <Preview id={item.id} tone={tone} speed={1} active large/>
   </div>
  </div>
  <section className="docs-component__section" id="docs-component-usage">
   <div className="docs-component__section-head"><h2>Usage</h2><button type="button" onClick={()=>void navigator.clipboard.writeText(item.code).then(()=>setCopied(true)).catch(()=>setCopied(false))}>{copied?'Copied':'Copy code'} <Icon name="copy"/></button></div>
   <pre className="lib-code"><code>{item.code}</code></pre>
  </section>
  <section className="docs-component__section" id="docs-component-source">
   <div className="docs-component__section-head"><h2>Source</h2></div>
   <a className="docs-component__source" href={'https://github.com/IMONsergey/Apco-components-lib/blob/main/'+item.source} target="_blank" rel="noreferrer">{item.source}<Icon name="external"/></a>
  </section>
 </article>;
}
const filterBySlug:Record<string,(typeof groups)[number]>={
 visual:'Visual engines',product:'Product motion',interface:'Interface motion'
};
export default function App() {
 const [route,setRoute]=useState<DocRoute>(()=>parseRoute(window.location.hash));
 const [search,setSearch]=useState('');
 const [tone,setTone]=useState<Tone>(()=>document.documentElement.dataset.theme==='dark'?'dark':'light');
 const [selected,setSelected]=useState<Item|null>(null);
 useEffect(()=>{
  const page=route.slug?route.slug.replace(/-/g,' '):route.section==='overview'?'Design system':route.section[0].toUpperCase()+route.section.slice(1);
  document.title=page+' — APCOSYS Design System';
 },[route.section,route.slug]);
 useEffect(()=>{
  const onHash=()=>{setRoute(parseRoute(window.location.hash));setSelected(null);window.scrollTo({top:0,behavior:'instant'})};
  window.addEventListener('hashchange',onHash);
  return ()=>window.removeEventListener('hashchange',onHash);
 },[]);
 useEffect(()=>{
  document.documentElement.dataset.theme=tone;
  document.documentElement.style.colorScheme=tone;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content',tone==='dark'?'#0d1113':'#f6f6f6');
  try{localStorage.setItem('apcosys-components-theme',tone)}catch{/* optional */}
 },[tone]);
 const category=filterBySlug[route.slug]||'All components';
 const focused=route.section==='components'?catalog.find(x=>x.id===route.slug):undefined;
 const filtered=useMemo(()=>catalog.filter(item=>
   (category==='All components'||item.group===category)&&
   (item.name+' '+item.tech+' '+item.group).toLowerCase().includes(search.trim().toLowerCase())
 ),[category,search]);
 return <DocsChrome route={route} tone={tone} onTheme={()=>setTone(v=>v==='dark'?'light':'dark')}>
  {route.section==='overview'&&<Overview/>}
  {route.section==='components'&&(focused?
   <ComponentPage item={focused} tone={tone}/>:
   <>
    <div className="lib-title-row docs-page-title"><div><h1>Components <span>{catalog.length}</span></h1><p>React components and motion patterns, sourced from APCOSYS.</p></div></div>
    <div className="lib-filters">
     <div className="lib-tabs" aria-label="Component types">
      {groups.map(g=>{
       const slug=g==='Visual engines'?'visual':g==='Product motion'?'product':g==='Interface motion'?'interface':'';
       return <a key={g} href={href('components',slug)} data-active={category===g} aria-current={category===g?'page':undefined}>
        {g==='All components'?'All':g==='Visual engines'?'Visual':g==='Product motion'?'Product':'Interface'}
       </a>;
      })}
     </div>
     <label className="lib-search"><Icon name="search"/><input type="search" aria-label="Search components" placeholder="Filter components"
      value={search} onChange={e=>setSearch(e.target.value)}/></label>
    </div>
    {filtered.length>0?<div className="lib-grid">{filtered.map(item=><Card key={item.id} item={item} tone={tone} open={setSelected}/>)}</div>:
     <p className="lib-empty">No components found.</p>}
   </>
  )}
  <Suspense fallback={<p className="lib-empty">Loading…</p>}>
   {route.section==='foundations'&&<>
    <div className="docs-page-title"><h1>Foundations</h1><p>Identity, semantics and responsive foundations.</p></div>
    <FoundationsPage tone={tone} jumpTo={route.slug}/>
   </>}
   {route.section==='icons'&&<>
    <div className="docs-page-title"><h1>Icons</h1><p>Consistent visual language across product interfaces.</p></div>
    <IconsPage initialFamily={route.slug}/>
   </>}
   {route.section==='guidelines'&&<>
    <div className="docs-page-title"><h1>Guidelines</h1><p>Source-first implementation rules and integration patterns.</p></div>
    <GuidelinesPage focus={route.slug}/>
   </>}
  </Suspense>
  {route.section==='components'&&selected&&<Detail key={selected.id} item={selected} tone={tone} onClose={()=>setSelected(null)}/>}
 </DocsChrome>;
}
