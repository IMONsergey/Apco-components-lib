import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
const FoundationsPage = lazy(() => import('./brand/FoundationsPage'));
const IconsPage = lazy(() => import('./brand/IconsPage'));
const GuidelinesPage = lazy(() => import('./brand/GuidelinesPage'));
import { catalog, groups, type Item } from './catalog';
import { DocsChrome } from './docs/DocsChrome';
import { parseRoute, href, routeTitle, type DocRoute } from './docs/navigation';
import Overview from './docs/Overview';
import { useClipboard } from './hooks/useClipboard';
import ManualCopy from './brand/ManualCopy';
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

function Card({ item, tone }: {
  item: Item; tone: Tone;
}) {
  const { ref, visible } = useInView();
  return (
    <article className="lib-card" ref={ref} data-testid={item.id} data-group={item.group}>
      <div className="lib-card__head">
        <a className="lib-card__name" href={href('components',item.id)}>
          <span>{item.name}</span><Icon name="arrow"/>
        </a>
      </div>
      <div className="lib-surface lib-card__preview" data-tone={tone}>
        <Preview id={item.id} tone={tone} speed={1} active={visible} />
      </div>
    </article>
  );
}

function ComponentPage({item,tone}:{item:Item;tone:Tone}){
 const clipboard=useClipboard(item.code);
 return <article className="docs-component">
  <div className="docs-component__heading">
   <a href={href('components')} className="docs-component__back">← All components</a>
   <h1>{item.name}</h1>
   <p>{item.description}</p>
   <div className="docs-component__tags"><span>{item.group}</span><span>{item.tech}</span></div>
  </div>
  <div className="docs-component__example" id="docs-component-preview">
   <div className="docs-component__example-head"><span>Preview</span><span>Try it out</span></div>
   <div className="docs-component__stage lib-surface" data-tone={tone}>
    <Preview id={item.id} tone={tone} speed={1} active large/>
   </div>
  </div>
  <section className="docs-component__section" id="docs-component-usage">
   <div className="docs-component__code">
    <div className="docs-component__code-heading"><h2>Code & usage</h2>
     <button type="button" onClick={()=>void clipboard.copy(item.code)}>{clipboard.copiedId?'Copied':'Copy code'} <Icon name="copy"/></button>
    </div>
    <pre className="lib-code" tabIndex={0} aria-label="Component code"><code>{item.code}</code></pre>
    {clipboard.manualValue!==null&&<ManualCopy value={clipboard.manualValue} label="Copy component code manually" onClose={clipboard.clear}/>}
   </div>
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
 useEffect(()=>{
  const page=route.section==='overview'?'Design system':routeTitle(route);
  document.title=page+' — APCOSYS Design System';
 },[route.section,route.slug]);
 useEffect(()=>{
  const onHash=()=>{setRoute(parseRoute(window.location.hash));window.scrollTo({top:0,behavior:'instant'})};
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
   (item.name+' '+item.tech+' '+item.group+' '+item.description).toLowerCase().includes(search.trim().toLowerCase())
 ).sort((a,b)=>{
   const rank:Record<string,number>={'Interface motion':0,'Product motion':1,'Visual engines':2};
   return (rank[a.group]??3)-(rank[b.group]??3);
 }),[category,search]);
 return <DocsChrome route={route} tone={tone} onTheme={()=>setTone(v=>v==='dark'?'light':'dark')}>
  {route.section==='overview'&&<Overview/>}
  {route.section==='components'&&(focused?
   <ComponentPage key={focused.id} item={focused} tone={tone}/>:
   <>
    <div className="lib-title-row docs-page-title"><div><h1>Components <span>{catalog.length}</span></h1><p>Explore the building blocks of APCOSYS.</p></div></div>
    <div className="lib-filters">
     <div className="lib-tabs" aria-label="Component types">
      {groups.map(g=>{
       const slug=g==='Visual engines'?'visual':g==='Product motion'?'product':g==='Interface motion'?'interface':'';
       return <a key={g} href={href('components',slug)} data-active={category===g} aria-current={category===g?'page':undefined}>
        {g==='All components'?'All':g==='Visual engines'?'Visual effects':g==='Product motion'?'Product previews':'Interface'}
       </a>;
      })}
     </div>
     <label className="lib-search"><Icon name="search"/><input type="search" aria-label="Search components" placeholder="Find a component..."
      value={search} onChange={e=>setSearch(e.target.value)}/></label>
    </div>
    {filtered.length>0?<div className="lib-grid">{filtered.map(item=><Card key={item.id} item={item} tone={tone}/>)}</div>:
     <div className="lib-empty">No components found.
      <button type="button" onClick={()=>{setSearch('');window.location.hash=href('components')}}>Clear filters</button>
     </div>}
   </>
  )}
  <Suspense fallback={<p className="lib-empty">Loading…</p>}>
   {route.section==='foundations'&&<>
    {!route.slug&&<div className="docs-page-title"><h1>Brand styles</h1><p>Colors, fonts, logos and layouts — all in one place.</p></div>}
    <FoundationsPage tone={tone} jumpTo={route.slug}/>
   </>}
   {route.section==='icons'&&<>
    <div className="docs-page-title"><h1>Icons</h1><p>Browse and copy icons for your next screen.</p></div>
    <IconsPage initialFamily={route.slug}/>
   </>}
   {route.section==='guidelines'&&<>
    <div className="docs-page-title"><h1>Guides</h1><p>Simple rules for keeping the product consistent.</p></div>
    <GuidelinesPage focus={route.slug}/>
   </>}
  </Suspense>
 </DocsChrome>;
}
