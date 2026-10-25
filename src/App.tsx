import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { catalog, groups, type Item } from './catalog';
import { DocsChrome } from './docs/DocsChrome';
import { parseRoute, href, routeTitle, type DocRoute } from './docs/navigation';
import Overview from './docs/Overview';
import ComponentPage from './docs/ComponentPage';
import { componentReference } from './docs/component-reference';
import { Icon } from './components/ui/Icon';
import Preview from './gallery/Preview';

const FoundationsPage = lazy(() => import('./brand/FoundationsPage'));
const IconsPage = lazy(() => import('./brand/IconsPage'));
const StartPage = lazy(() => import('./docs/StartPage'));
const ResourcesPage = lazy(() => import('./docs/ResourcesPage'));
const GuidePage = lazy(() => import('./docs/GuidePage'));
const SaasPage = lazy(() => import('./saas/SaasPage'));

type Tone = 'light' | 'dark';
function useInView() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { rootMargin: '120px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}
function Card({ item, tone }: { item: Item; tone: Tone }) {
  const { ref, visible } = useInView();
  const reference = componentReference[item.id];
  return <article className="lib-card" ref={ref} data-testid={item.id} data-group={item.group}>
    <div className="lib-card__head"><a className="lib-card__name" href={href('components', item.id)}><span>{reference.title}</span><Icon name="arrow" /></a></div>
    <div className="lib-surface lib-card__preview" data-tone={tone}><Preview id={item.id} tone={tone} speed={1} active={visible} /></div>
    <p className="docs-card-description">{reference.purpose}</p>
  </article>;
}
const filterBySlug: Record<string, (typeof groups)[number]> = { visual: 'Visual engines', product: 'Product motion', interface: 'Interface motion' };
const groupLabels: Record<string, string> = { 'All components': 'Все', 'Visual engines': 'Фирменная графика', 'Product motion': 'Сцены продукта', 'Interface motion': 'Интерфейс' };
export default function App() {
  const [route, setRoute] = useState<DocRoute>(() => parseRoute(window.location.hash));
  const [search, setSearch] = useState('');
  const [tone, setTone] = useState<Tone>(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  useEffect(() => { document.title = routeTitle(route) + ' — APCOSYS Design System'; }, [route]);
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#docs-content') { document.getElementById('docs-content')?.focus(); return; }
      setRoute(parseRoute(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = tone;
    document.documentElement.style.colorScheme = tone;
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', tone === 'dark' ? '#0d1113' : '#f6f6f6');
    try { localStorage.setItem('apcosys-components-theme', tone); } catch { /* Storage is optional. */ }
  }, [tone]);
  const category = filterBySlug[route.slug] || 'All components';
  const focused = route.section === 'components' ? catalog.find(item => item.id === route.slug) : undefined;
  const filtered = useMemo(() => catalog.filter(item => {
    const reference = componentReference[item.id];
    const haystack = [item.name, item.tech, item.group, reference.title, reference.purpose, reference.keywords].join(' ').toLowerCase();
    return (category === 'All components' || item.group === category) && search.trim().toLowerCase().split(/\s+/).every(term => haystack.includes(term));
  }).sort((a, b) => {
    const rank: Record<string, number> = { 'Interface motion': 0, 'Product motion': 1, 'Visual engines': 2 };
    return (rank[a.group] ?? 3) - (rank[b.group] ?? 3);
  }), [category, search]);
  return <DocsChrome route={route} tone={tone} onTheme={() => setTone(value => value === 'dark' ? 'light' : 'dark')}>
    {route.section === 'overview' && <Overview />}
    {route.section === 'components' && (focused ? <ComponentPage key={focused.id} item={focused} tone={tone} /> : <>
      <div className="docs-page-title"><h1>Компоненты сайта <span>{catalog.length}</span></h1><p>Кнопки, навигация, тарифы и фирменная графика. Откройте компонент, чтобы настроить пример и получить код.</p></div>
      <a className="docs-catalog-crosslink" href="#saas">Ищете таблицы, фильтры или экраны приложения? <span>Перейти в SaaS <Icon name="arrow" /></span></a>
      <div className="lib-filters"><div className="lib-tabs" aria-label="Категории компонентов">{groups.map(group => {
        const slug = group === 'Visual engines' ? 'visual' : group === 'Product motion' ? 'product' : group === 'Interface motion' ? 'interface' : '';
        return <a key={group} href={href('components', slug)} data-active={category === group} aria-current={category === group ? 'page' : undefined}>{groupLabels[group]}</a>;
      })}</div><label className="lib-search"><Icon name="search" /><input type="search" aria-label="Найти компонент" placeholder="Название или задача…" value={search} onChange={event => setSearch(event.target.value)} /></label></div>
      <p className="docs-result-count" role="status">Найдено: {filtered.length}</p>
      {filtered.length > 0 ? <div className="lib-grid">{filtered.map(item => <Card key={item.id} item={item} tone={tone} />)}</div> : <div className="lib-empty">Компоненты не найдены.<button type="button" onClick={() => { setSearch(''); window.location.hash = href('components'); }}>Сбросить поиск и фильтры</button></div>}
    </>)}
    <Suspense fallback={<p className="lib-empty" role="status">Загружаем раздел…</p>}>
      {route.section === 'start' && <StartPage />}
      {route.section === 'resources' && <ResourcesPage />}
      {route.section === 'guide' && <GuidePage focus={route.slug} />}
      {route.section === 'saas' && <SaasPage key={route.slug} slug={route.slug} tone={tone} />}
      {route.section === 'foundations' && <>{!route.slug && <div className="docs-page-title"><h1>Основы стиля</h1><p>Логотипы, палитра, типографика, отступы и сетка маркетингового сайта.</p></div>}<FoundationsPage tone={tone} jumpTo={route.slug} /></>}
      {route.section === 'icons' && <><div className="docs-page-title"><h1>Иконки</h1><p>Найдите символ, выберите размер и скопируйте SVG. Используйте одну семью внутри панели инструментов.</p></div><IconsPage initialFamily={route.slug} /></>}
    </Suspense>
  </DocsChrome>;
}
