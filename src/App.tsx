import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
const FoundationsPage = lazy(() => import('./brand/FoundationsPage'));
const IconsPage = lazy(() => import('./brand/IconsPage'));
const GuidelinesPage = lazy(() => import('./brand/GuidelinesPage'));
import { catalog, groups, type Item } from './catalog';
import { Logo } from './components/ui/Logo';
import { Icon } from './components/ui/Icon';
import Preview from './gallery/Preview';

type Tone = 'light' | 'dark';
type View = 'components' | 'foundations' | 'icons' | 'guidelines';
const views: {id:View;label:string}[] = [
  {id:'components',label:'Components'},
  {id:'foundations',label:'Foundations'},
  {id:'icons',label:'Icons'},
  {id:'guidelines',label:'Guidelines'},
];
const titleByView:Record<View,string>={components:'Components',foundations:'Foundations',icons:'Icons',guidelines:'Guidelines'};
function currentView():View {
  const hash = window.location.hash.replace('#','');
  return views.some(v=>v.id===hash)?hash as View:'components';
}

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
        <div className="lib-dialog__meta"><span>{item.tech}</span><a href={`https://github.com/IMONsergey/Apco-components-lib/blob/main/${item.source}`} target="_blank" rel="noreferrer">Source <Icon name="external"/></a></div>
        <div className="lib-code-head"><span>Usage</span><button type="button" onClick={() => void copy()}><Icon name="copy" />{copied ? 'Copied' : 'Copy'}</button></div>
        <pre className="lib-code"><code>{item.code}</code></pre>
      </div>
    </dialog>
  );
}

export default function App() {
  const [view,setView] = useState<View>(currentView);
  useEffect(() => {
    const onHash = () => {setView(currentView());setSelected(null)};
    window.addEventListener('hashchange',onHash);
    return () => window.removeEventListener('hashchange',onHash);
  }, []);
  const [category, setCategory] = useState<(typeof groups)[number]>('All components');
  const [search, setSearch] = useState('');
  const [tone, setTone] = useState<Tone>(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = tone;
    document.documentElement.style.colorScheme = tone;
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', tone === 'dark' ? '#0d1113' : '#f6f6f6');
    try { window.localStorage.setItem('apcosys-components-theme', tone); } catch { /* Storage may be unavailable */ }
  }, [tone]);
  const [selected, setSelected] = useState<Item | null>(null);
  const filtered = useMemo(() =>
    catalog.filter(item =>
      (category === 'All components' || item.group === category)
      && (item.name + ' ' + item.tech + ' ' + item.group).toLowerCase().includes(search.trim().toLowerCase())
    ), [category, search]);
  return (
    <div className="lib-app">
      <header className="lib-header">
        <div className="container lib-header__inner">
          <a href="https://imonsergey.github.io/apcoweb/" aria-label="APCOSYS website"><Logo /></a>
          <span className="lib-header__divider" aria-hidden="true"/>
          <span className="lib-header__title">Design system</span>
          <a className="lib-header__repo" href="https://github.com/IMONsergey/Apco-components-lib" target="_blank" rel="noreferrer">GitHub <Icon name="external"/></a>
        </div>
      </header>

      <main className="container lib-main">
        <div className="lib-title-row">
          <h1>{titleByView[view]} {view==='components'&&<span>{catalog.length}</span>}</h1>
          <div className="lib-tools">
            <button className="lib-icon-button" type="button" aria-label={tone === 'light' ? 'Dark theme' : 'Light theme'} aria-pressed={tone === 'dark'}
              onClick={() => setTone(tone === 'light' ? 'dark' : 'light')}><Icon name="appearance"/></button>
          </div>
        </div>
        <nav className="ds-main-nav" aria-label="Design system sections">
          {views.map(v=><a key={v.id} href={'#'+v.id}
            aria-current={view===v.id?'page':undefined} data-active={view===v.id}
            onClick={()=>{if(view!==v.id){setView(v.id);setSelected(null);window.scrollTo({top:0,behavior:'auto'})}}}>
            {v.label}</a>)}
        </nav>
        {view === 'components' && <>
        <div className="lib-filters">
          <div className="lib-tabs" aria-label="Component types">
            {groups.map(g => <button key={g} type="button" aria-pressed={category === g} data-active={category === g}
              onClick={() => setCategory(g)}>
              {g === 'All components' ? 'All' : g === 'Visual engines' ? 'Visual' : g === 'Product motion' ? 'Product' : 'Interface'}
            </button>)}
          </div>
          <label className="lib-search"><Icon name="search"/><input type="search" aria-label="Search components" placeholder="Search"
            value={search} onChange={e => setSearch(e.target.value)}/></label>
        </div>
        {filtered.length > 0
          ? <div className="lib-grid">{filtered.map(item => <Card key={item.id} item={item} tone={tone} open={setSelected}/>)}</div>
          : <p className="lib-empty">No components found.</p>}
        </>}
        <Suspense fallback={<p className="lib-empty">Loading…</p>}>
          {view === 'foundations' && <FoundationsPage tone={tone} />}
          {view === 'icons' && <IconsPage />}
          {view === 'guidelines' && <GuidelinesPage />}
        </Suspense>
      </main>
      <footer className="lib-footer"><div className="container">APCOSYS <span> / </span> Design system</div></footer>
      {view==='components' && selected && <Detail key={selected.id} item={selected} tone={tone} onClose={() => setSelected(null)} />}
    </div>
  );
}
