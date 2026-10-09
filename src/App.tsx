import { useEffect, useMemo, useRef, useState } from 'react';
import { catalog, groups, type Item } from './catalog';
import { Logo } from './components/ui/Logo';
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

function Card({ item, tone, paused, open }: {
  item: Item; tone: Tone; paused: boolean; open: (item: Item) => void;
}) {
  const { ref, visible } = useInView();
  return (
    <article className="lib-card" ref={ref} data-testid={item.id}>
      <div className="lib-card__head">
        <button type="button" className="lib-card__name" onClick={() => open(item)}>{item.name}</button>
        <button type="button" className="lib-card__open" aria-label={`View ${item.name} source`} onClick={() => open(item)}>
          <Icon name="external" />
        </button>
      </div>
      <div className="lib-surface lib-card__preview" data-tone={tone}>
        <Preview id={item.id} tone={tone} speed={1} active={visible && !paused} />
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
    if (!el) return;
    el.showModal();
    return () => { if (el.open) el.close(); };
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
  const [category, setCategory] = useState<(typeof groups)[number]>('All components');
  const [search, setSearch] = useState('');
  const [tone, setTone] = useState<Tone>(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = tone;
    document.documentElement.style.colorScheme = tone;
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', tone === 'dark' ? '#0d1113' : '#f6f6f6');
    try { window.localStorage.setItem('apcosys-components-theme', tone); } catch { /* Storage may be unavailable */ }
  }, [tone]);
  const [paused, setPaused] = useState(false);
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
          <span className="lib-header__title">Component library</span>
          <a className="lib-header__repo" href="https://github.com/IMONsergey/Apco-components-lib" target="_blank" rel="noreferrer">GitHub <Icon name="external"/></a>
        </div>
      </header>

      <main className="container lib-main">
        <div className="lib-title-row">
          <h1>Components <span>{catalog.length}</span></h1>
          <div className="lib-tools">
            <button className="lib-icon-button" type="button" aria-label={tone === 'light' ? 'Dark theme' : 'Light theme'} aria-pressed={tone === 'dark'}
              onClick={() => setTone(tone === 'light' ? 'dark' : 'light')}><Icon name="appearance"/></button>
            <button className="lib-icon-button" type="button" aria-label={paused ? 'Resume animations' : 'Pause animations'}
              aria-pressed={paused} onClick={() => setPaused(!paused)}><Icon name={paused ? 'play' : 'pause'} /></button>
          </div>
        </div>
        <div className="lib-filters">
          <div className="lib-tabs" aria-label="Component types">
            {groups.map(g => <button key={g} type="button" aria-pressed={category === g} data-active={category === g}
              onClick={() => setCategory(g)}>
              {g === 'All components' ? 'All' : g === 'Visual engines' ? 'Visual' : g === 'Product motion' ? 'Product' : 'Interface'}
              <span>{g === 'All components' ? catalog.length : catalog.filter(item => item.group === g).length}</span>
            </button>)}
          </div>
          <label className="lib-search"><Icon name="search"/><input type="search" aria-label="Search components" placeholder="Search"
            value={search} onChange={e => setSearch(e.target.value)}/></label>
        </div>
        {filtered.length > 0
          ? <div className="lib-grid">{filtered.map(item => <Card key={item.id} item={item} tone={tone} paused={paused} open={setSelected}/>)}</div>
          : <p className="lib-empty">No components found.</p>}
      </main>
      <footer className="lib-footer"><div className="container">APCOSYS <span> / </span> Components</div></footer>
      {selected && <Detail key={selected.id} item={selected} tone={tone} onClose={() => setSelected(null)} />}
    </div>
  );
}
