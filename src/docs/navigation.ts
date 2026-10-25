import { catalog } from '../catalog';
import { componentReference } from './component-reference';
import tokens from '../tokens/apcosys.tokens.json';
import iconRegistry from '../generated/icon-manifest.json';

export type Section = 'overview' | 'start' | 'foundations' | 'components' | 'saas' | 'icons' | 'guide' | 'guidelines' | 'resources';
export type DocRoute = { section: Section; slug: string };
const allowed: Section[] = ['overview', 'start', 'foundations', 'components', 'saas', 'icons', 'guide', 'guidelines', 'resources'];
export function parseRoute(hash: string): DocRoute {
  const [section, ...rest] = hash.replace(/^#\/?/, '').split('/');
  const name = allowed.includes(section as Section) ? section as Section : 'overview';
  return { section: name === 'guidelines' ? 'guide' : name, slug: rest.join('/') };
}
export function href(section: Section, slug = '') { return '#' + section + (slug ? '/' + slug : ''); }
export type NavItem = { label: string; route: string; keywords?: string };
export const saasNavigation: NavItem[] = [
  { label: 'Обзор SaaS', route: href('saas'), keywords: 'saas product dashboard платформа интерфейс' },
  { label: 'Рабочая область', route: href('saas', 'workspace'), keywords: 'shell sidebar navigation меню аккаунт' },
  { label: 'Кнопки и формы', route: href('saas', 'controls'), keywords: 'button input select dropdown checkbox поля выпадающий список' },
  { label: 'Поиск и фильтры', route: href('saas', 'search'), keywords: 'search facets conditions фильтр условия фасеты' },
  { label: 'Таблицы и пагинация', route: href('saas', 'results'), keywords: 'table results pagination pager сортировка выдача страницы' },
  { label: 'Карточка объекта', route: href('saas', 'object'), keywords: 'host domain ip dns whois services cve сервисы' },
  { label: 'Private Scanner', route: href('saas', 'scanner'), keywords: 'scan task targets ports csv сканер задания сканирование' },
  { label: 'Вход и подтверждение', route: href('saas', 'auth'), keywords: 'login password recovery verification 2fa регистрация пароль код авторизация' },
  { label: 'Аккаунт и безопасность', route: href('saas', 'account'), keywords: 'profile security api key sessions organization профиль ключ сессии' },
  { label: 'Тарифы и оплата', route: href('saas', 'billing'), keywords: 'pricing payment plans checkout monthly annual цены подписка' },
  { label: 'Состояния и сообщения', route: href('saas', 'feedback'), keywords: 'loading error empty success unknown toast skeleton ошибка загрузка пусто' },
  { label: 'Баланс и лимиты', route: href('saas', 'usage'), keywords: 'usage credits tokens progress лимит токены остаток' },
  { label: 'История поиска', route: href('saas', 'history'), keywords: 'history saved queries история сохраненные запросы' },
];
export const sections: { id: Section; label: string; items: NavItem[] }[] = [
  { id: 'overview', label: 'Главная', items: [] },
  { id: 'start', label: 'С чего начать', items: [] },
  { id: 'foundations', label: 'Основы стиля', items: [
    { label: 'Логотип', route: href('foundations', 'identity'), keywords: 'logo identity brand mark бренд логотип' },
    { label: 'Цвета', route: href('foundations', 'colors'), keywords: 'palette colors swatches dark light tokens цвет палитра тема' },
    { label: 'Типографика', route: href('foundations', 'typography'), keywords: 'text typography fonts шрифт текст заголовок' },
    { label: 'Отступы и радиусы', route: href('foundations', 'spacing'), keywords: 'spacing gaps radius corners отступ радиус' },
    { label: 'Сетка и размеры', route: href('foundations', 'layout'), keywords: 'layout grid responsive breakpoints адаптив сетка' },
    { label: 'Анимация', route: href('foundations', 'motion'), keywords: 'animation motion transition движение reduced motion' },
  ] },
  { id: 'components', label: 'Компоненты сайта', items: [] },
  { id: 'saas', label: 'SaaS-платформа', items: saasNavigation },
  { id: 'icons', label: 'Иконки', items: [] },
  { id: 'guide', label: 'Правила и сценарии', items: [
    { label: 'Как собрать экран', route: href('guide', 'usage'), keywords: 'assemble usage recipe сборка экран паттерны' },
    { label: 'Состояния интерфейса', route: href('guide', 'states'), keywords: 'states loading empty error limited состояния ошибки' },
    { label: 'Адаптивность', route: href('guide', 'responsive'), keywords: 'responsive mobile tablet desktop мобильный планшет' },
    { label: 'Доступность', route: href('guide', 'accessibility'), keywords: 'accessibility a11y keyboard focus contrast клавиатура доступность' },
    { label: 'Подключение в проект', route: href('guide', 'integration'), keywords: 'install code source react css developer интеграция разработчик' },
    { label: 'Передача и обновление', route: href('guide', 'handoff'), keywords: 'handoff checklist update проверка передача релиз' },
  ] },
  { id: 'resources', label: 'Материалы и загрузки', items: [] },
];
export const sourceRoutes: NavItem[] = [
  { label: 'Главная', route: href('overview'), keywords: 'home start overview library библиотека' },
  ...sections.filter(section => section.id !== 'overview').flatMap(section => [
    { label: section.label, route: href(section.id), keywords: section.id }, ...section.items,
  ]),
  ...catalog.map(item => ({ label: componentReference[item.id].title, route: href('components', item.id), keywords: item.name + ' ' + item.group + ' ' + item.tech + ' ' + item.description + ' ' + componentReference[item.id].keywords })),
  ...Object.entries({
    apcosys: ['arrow', 'down', 'chevron', 'search', 'plus', 'minus', 'close', 'menu', 'previous', 'external', 'focus', 'database', 'scanner', 'cube', 'book', 'bookmark', 'appearance', 'play', 'pause', 'copy'],
    feather: iconRegistry.feather, phosphor: iconRegistry.phosphor,
  }).flatMap(([family, names]) => names.map(name => ({ label: name, route: href('icons', family + '/' + name), keywords: 'icon иконка ' + family + ' ' + name.replace(/-/g, ' ') }))),
  ...Object.entries(tokens.colors).map(([key, v]) => ({ label: key + ' · цвет', route: href('foundations', 'colors'), keywords: 'palette цвет палитра ' + key + ' ' + v.css + ' ' + v.usage + ' ' + v.light + ' ' + v.dark })),
];
export const sectionTitles: Record<Section, string> = { overview: 'Главная', start: 'С чего начать', foundations: 'Основы стиля', components: 'Компоненты сайта', saas: 'SaaS-платформа', icons: 'Иконки', guide: 'Правила и сценарии', guidelines: 'Правила и сценарии', resources: 'Материалы и загрузки' };
export function routeTitle(route: DocRoute) {
  return sourceRoutes.find(item => item.route === href(route.section, route.slug))?.label ?? sectionTitles[route.section];
}
export const toc: Record<Section, Array<{ label: string; id: string }>> = {
  overview: [], start: [], saas: [], resources: [], guide: [], guidelines: [], components: [],
  foundations: [{ label: 'Логотип', id: 'ds-identity' }, { label: 'Цвета', id: 'ds-colors' }, { label: 'Типографика', id: 'ds-type' }, { label: 'Отступы', id: 'ds-spacing' }, { label: 'Сетка', id: 'ds-layout' }, { label: 'Анимация', id: 'ds-motion' }],
  icons: [{ label: 'Каталог', id: 'docs-icon-library' }, { label: 'Размер и обводка', id: 'docs-icon-options' }, { label: 'Состояния', id: 'docs-icon-states' }, { label: 'Переходы', id: 'docs-icon-morph' }],
};
